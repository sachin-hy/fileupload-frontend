
import axios from "axios";
import { BASEURL } from "./BASEURL";
import streamSaver from 'streamsaver';
import { toast } from "react-toastify";


export const downloadFile = async(
    setDownloadProgress,
    setDownloadStart,
    s3Key,
    buttonRef
   ) => 
 {
     // disable the download button

       buttonRef.current.disabled = true;

       // set the download url
        const url = `${BASEURL}/download/${s3Key}`;
     
        // send request to get the download url using s3key
        const response = await axios.get(url,
          {
            headers:{
              Authorization : `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        const {downloadUrl, expiresAt, fileSize ,fileType, fileName} = response.data;

        console.log("expire at  = " , expiresAt);

        // call the file from the download url
        /*
        
         used fetch in place of axios because axios does not support 
            stream download very well as compared to fetch API
        
        and using streamsaver in place of Blob or window.URL.createObjectURL
         as they save the file in browser memory (ram) before downloading
            which creates problem for large files

            so streamsaver creates a stream and writes the file directly to disk
        */
        const res = await fetch(downloadUrl);


        setDownloadProgress(0);
        setDownloadStart(true);

        //const completeFileName = fileName + "." + fileType;
        // create a file stream to save the file
        const fileStream = streamSaver.createWriteStream(fileName);

        //make a read stream from the response
        const readStream = res.body.getReader();

        // create a write stream to write the file
        const writeStream = fileStream.getWriter();

        let fileSizeSum = 0;

        const pump = async() => {
          const {done, value} = await readStream.read();

           if(done) {
            writeStream.close();
            toast.success("File downloaded successfully");
            return;
          }


          fileSizeSum += value.length;
          setDownloadProgress( Math.round((fileSizeSum / fileSize) * 100));
         
         
         

          return writeStream.write(value).then(pump);
        }
        
        await pump();
        setDownloadStart(false);
        buttonRef.current.disabled = false; 
}