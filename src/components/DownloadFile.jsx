
import { useParams } from "react-router-dom";
import axios from "axios";
import streamSaver from 'streamsaver';
import { useState } from "react";
import { useRef } from "react";
import { BASEURL } from "../apiCall/BASEURL";

import { toast } from "react-toastify";
import { downloadFile } from "../apiCall/DownloadApi";

function DownloadFile() {
 
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [downloadStart,setDownloadStart] = useState(false);
    const buttonRef = useRef();

    const {s3Key} = useParams();


    const handleDownload = async() => {
        
         downloadFile( setDownloadProgress,
          setDownloadStart,
          s3Key,
          buttonRef
        );
        
       
    }


   return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Download Your File
        </h1>
        
        <button
          onClick={handleDownload}
          ref={buttonRef}
          className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-900 transition"
        >
          { downloadStart ? (
              <span className="text text-black"> Downloading... {downloadProgress} %</span>
          ) :(
            <>
             Download File
            </>
          )

          } 
        </button>
      </div>
    </div>
   )
}


export default DownloadFile;