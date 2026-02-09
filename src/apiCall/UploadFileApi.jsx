import axios from "axios";
import { toast } from "react-toastify";
import { BASEURL } from "./BASEURL";
import React from "react";



export const uploadFileUrl = async (formData, 
    file,
    setIsUploading,
    setUploadProgress,
    setdownloadLink,
    setuploadComplete,
    isPaused
) => {
    try{
         setIsUploading(true);

        const fileKey = `uploadState_${file.name}_${file.size}_${file.lastModified}`;


        const existingUpload = localStorage.getItem(fileKey);
        
    
        if(!existingUpload)
        {
              const res = await axios.post(`${BASEURL}/uploadId`, formData,
              {
                headers:{
                   Authorization : `Bearer ${localStorage.getItem("token")}`
                  }
              }
            );

            const {uploadId, s3Key ,chunkSize, totalChunk} = res.data;

      
       
            localStorage.setItem(fileKey, JSON.stringify({uploadId, 
             s3Key,
             chunkSize, 
             totalChunk, 
              uploadParts:[]
             }));

           getPresignedUrl(uploadId,
            s3Key,
            chunkSize, 
            totalChunk,
            setIsUploading,
            setUploadProgress,
            file,
            setdownloadLink,
            setuploadComplete,
            fileKey,
            isPaused
           );
        }else{
          const uploadState = JSON.parse(existingUpload);
          getPresignedUrl(uploadState.uploadId,
            uploadState.s3Key,
            uploadState.chunkSize,
            uploadState.totalChunk,
            setIsUploading,
            setUploadProgress,
            file,
            setdownloadLink,
            setuploadComplete,
            fileKey,
            isPaused
            );
        }

    }catch(e)
    {
         toast.error("SomeThing went Wrong Please Try Again Later.");
         setIsUploading(false);
    }
}






export const getPresignedUrl = async (
    uploadId, s3Key, chunkSize, totalChunk,
    setIsUploading, setUploadProgress, file,
    setdownloadLink, setuploadComplete, fileKey, isPaused
) => {
    try {
        let uploadState = JSON.parse(localStorage.getItem(fileKey));
        const uploadedPartSet = new Set(uploadState.uploadParts.map(p => p.partNumber));
        const etags = [...uploadState.uploadParts];
        
        const CONCURRENCY_LIMIT = 5;
        const activeTasks = new Set();
        const queue = []; 

        
        for (let i = 0; i < totalChunk; i++) {
            if (!uploadedPartSet.has(i + 1)) {
                queue.push(i);
            }
        }

       
        const uploadNext = async () => {
            if (queue.length === 0 || isPaused.current) return;

            const i = queue.shift();
            const start = i * chunkSize;
            const end = Math.min(file.size, (i + 1) * chunkSize);
            const chunk = file.slice(start, end);
            const BATCH_SIZE = 10;
            
            const task = (async () => {
                try {
                    const urlResponse = await axios.post(`${BASEURL}/presignedurl`, {
                        partNumber: i + 1,
                        uploadId,
                        s3Key
                    }, {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                    });

                    const { url } = urlResponse.data;
                    const res = await retryUploadChunk(url, chunk, 4);
                    const etag = res.headers.get('ETag');

                  
                    const partInfo = { partNumber: i + 1, etag };
                    etags.push(partInfo);
                    uploadState.uploadParts.push(partInfo);

                    // only updating localstorage only if the 
                    // the batch size reach
                    // to reduce writing every time
                    if (uploadState.uploadParts.length % BATCH_SIZE === 0 || 
                         uploadState.uploadParts.length === totalChunk) {
                       localStorage.setItem(fileKey, JSON.stringify(uploadState));
                    }

                    setUploadProgress(Math.round((etags.length / totalChunk) * 100));
                } finally {
                    activeTasks.delete(task); 
                }
            })();

            activeTasks.add(task);
            return task;
        };

       
        while (queue.length > 0 && !isPaused.current) {
           if (isPaused.current) {
                await new Promise(resolve => setTimeout(resolve, 1000)); 
                continue; 
            }

            if (activeTasks.size < CONCURRENCY_LIMIT) {
                uploadNext(); 
            } else {
                await Promise.race(activeTasks);
            }
        }

        await Promise.all(activeTasks);

        if (!isPaused.current) {
            etags.sort((a, b) => a.partNumber - b.partNumber);
            completeUpload(etags, uploadId, s3Key, setIsUploading, setdownloadLink, setuploadComplete, fileKey);
        }

    } catch (e) {
        toast.error("Parallel upload failed. Please try again later.");
        setIsUploading(false);
    }
};



const retryUploadChunk = async (url, chunk, maxRetries) => {
  let attempt = 1;

  while (attempt <= maxRetries) {
    try {
      const res = await fetch(url, {
        method: "PUT",
        body: chunk,
      });

      if (res.ok) {
        return res;
      }

      
      // if the url  expired or unauthorized then we stop retrying
      // and throw error
      if (res.status === 403 || res.status === 401) {
        throw new Error("Presigned URL expired or unauthorized");
      }

      throw new Error(`Upload failed with status ${res.status}`);
    } catch (err) {
      
      
      if (attempt === maxRetries) {
        throw err;
      }

      // wait for some time before retrying
      await new Promise(resolve =>
        setTimeout(resolve, attempt * 1000)
      );

      attempt++;
    }
  }
};



export const completeUpload = async(etags,
    uploadId,
    s3Key,
    setIsUploading,
    setdownloadLink,
    setuploadComplete,
    fileKey
) => {

    try{
      
      // console.log("etags size = " , etags.length);
      //console.log("etags = " , etags);
     

    const completeRes = await axios.post(
      `${BASEURL}/completeUpload`,
      etags,
     {
       params: { 
             uploadId, 
             s3Key 
       },
      headers:{
              Authorization : `Bearer ${localStorage.getItem("token")}`
            }
      }
    );

    
    const {downloadUrl} = completeRes.data;
    
    setdownloadLink(downloadUrl);
    setuploadComplete(true);
    localStorage.removeItem(fileKey);
    toast.success("File uploaded successfully!");
   }catch(error)
   {
     if(error.status == 401)
      {
        toast.error("Session expired! Please login again.");
      }
      else{
             toast.error("SomeThing went wrong!Please try again later.");
     }
   }

    finally {
      setIsUploading(false);
    }
}






