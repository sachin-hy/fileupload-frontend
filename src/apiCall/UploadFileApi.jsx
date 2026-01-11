import axios from "axios";
import { toast } from "react-toastify";
import { BASEURL } from "./BASEURL";
import React from "react";



export const uploadFileUrl = async (formData, 
    file,
    setIsUploading,
    setUploadProgress,
    setdownloadLink,
    setuploadComplete
) => {
    try{
         const res = await axios.post(`${BASEURL}/uploadId`, formData,
        {
            headers:{
              Authorization : `Bearer ${localStorage.getItem("token")}`
            }
          }
     );

       const {uploadId, s3Key ,chunkSize, totalChunk} = res.data;

        getPresignedUrl(uploadId,
          s3Key,
          chunkSize, 
          totalChunk,
          setIsUploading,
          setUploadProgress,
          file,
          setdownloadLink,
          setuploadComplete
        );

    }catch(e)
    {
         toast.error("SomeThing went Wrong Please Try Again Later.");
         setIsUploading(false);
    }
}







export const getPresignedUrl = async (uploadId,
          s3Key,
          chunkSize, 
          totalChunk,
          setIsUploading,
          setUploadProgress,
          file,
          setdownloadLink,
          setuploadComplete
    ) => {
 
    try{
     const etags = [];
     setIsUploading(true);
     setUploadProgress(0);

     // console.log("Starting upload in chunks with s3Key = " , s3Key);
      for(let i = 0; i < totalChunk; i = i + 1)
     {
        
        const start = i * chunkSize;
        const end = Math.min(file.size, (i+1) * chunkSize);

        const chunk = file.slice(start , end);
        
        const urlResponse = await axios.post(`${BASEURL}/presignedurl`,{
            partNumber: i + 1,
            uploadId : uploadId,
            s3Key: s3Key
        },
          {
            headers:{
              Authorization : `Bearer ${localStorage.getItem("token")}`
            }
          });
     
           const {url} = urlResponse.data;
        
          /// console.log("presigned url = " , url);
       

           
           
          const  res = await fetch(url, {
               method: 'PUT',
               body: chunk
              });
          // }catch(error)
          // {
          //   console.error("Error uploading chunk:", error);
          //   setIsUploading(false);
          //   toast.error("Error uploading file chunk. Please try again.");
            
          //   return;
          // }
         
        const etag = res.headers.get('ETag');
        
        //console.log("etag recived  = " , etag);
        // const freshEtag = etag?.replace(/"/g, '');
        
        
        etags.push({partNumber: i + 1, etag: etag});
        
        setUploadProgress(Math.round(((i+1)/totalChunk)*100));
     }



        completeUpload(etags,
           uploadId,
           s3Key,
           setIsUploading,
           setdownloadLink,
           setuploadComplete
          );

    }catch(e)
    {
       toast.error("SomeThing went wrong!Please try again later.");
       setIsUploading(false);

    }
}



export const completeUpload = async(etags,
    uploadId,
    s3Key,
    setIsUploading,
    setdownloadLink,
    setuploadComplete

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