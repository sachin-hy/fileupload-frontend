import axios from "axios";
import { BASEURL } from "./BASEURL";
import streamSaver from 'streamsaver';
import { toast } from "react-toastify";

export const downloadFile = async (
    setDownloadProgress,
    setDownloadStart,
    s3Key,
    buttonRef
) => {
    try {
     
        buttonRef.current.disabled = true;

        
        const url = `${BASEURL}/download/${s3Key}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        const { downloadUrl, fileSize, fileName } = response.data;

       
        const res = await fetch(downloadUrl);

        if (!res.ok) {
            throw new Error(`Failed to fetch file: ${res.statusText}`);
        }

        setDownloadProgress(0);
        setDownloadStart(true);

      
        const fileStream = streamSaver.createWriteStream(fileName, {
            size: fileSize 
        });

        const readStream = res.body.getReader();
        const writeStream = fileStream.getWriter();

        let fileSizeSum = 0;

        
        const pump = async () => {
            try {
                const { done, value } = await readStream.read();

                if (done) {
                    await writeStream.close();
                    toast.success("File downloaded successfully");
                    return;
                }

                fileSizeSum += value.length;
                setDownloadProgress(Math.round((fileSizeSum / fileSize) * 100));

                await writeStream.write(value);
                return pump(); 
            } catch (streamError) {
                
                writeStream.abort();
                throw streamError;
            }
        };

        await pump();

    } catch (error) {
        console.error("Download error:", error);
        
     
        if (error.response?.status === 401) {
            toast.error("Session expired. Please login again.");
        } else if (error.message.includes("Failed to fetch")) {
            toast.error("Network error: Could not connect to the server.");
        } else {
            toast.error("Something went wrong during the download.");
        }
    } finally {
       
        setDownloadStart(false);
        if (buttonRef.current) {
            buttonRef.current.disabled = false;
        }
    }
};