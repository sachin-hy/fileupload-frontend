import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { uploadFileUrl } from '../apiCall/UploadFileApi'; 






function UploadFile() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInput = useRef(null);
  const [uploadComplete, setuploadComplete] = useState(false);
  const [downloadLink, setdownloadLink] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
   

  const isPaused = useRef(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setUploadProgress(0); 
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadProgress(0); 
    }
  };

  const handleUploadClick = () => {
    fileInput.current.click();
  };

 
  const startUpload = async() => {
    if (!file) return;

   
    isPaused.current = false;

    const formData = {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
      };

      const uploadToast = await uploadFileUrl(formData, 
        file,
        setIsUploading,
        setUploadProgress,
        setdownloadLink,
        setuploadComplete,
        isPaused
    );
    
   
  };

 
  const handlePause = () => {
    isPaused.current = true;
  
  };

  const removeFile = () => {
    setFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    isPaused.current = false;
  };

  return (
    <>
    {
        uploadComplete? (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Upload Complete!
              </h2>
              
              <p className="text-gray-600 mb-6">
                Your file has been uploaded successfully.
              </p>

              {downloadLink && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-2">Download Link:</p>
                  <input
                    type="text"
                    value={downloadLink}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                    onClick={(e) => e.target.select()}
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(downloadLink)}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Copy Link
                  </button>
                </div>
              )}
              
               <button 
                  onClick={() => {setuploadComplete(false); removeFile();}}
                  className="text-blue-500 hover:underline mt-4"
               >
                  Upload Another File
               </button>
            </div>
          </div>
        </div>
        ) : (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Upload File
          </h1>
          <p className="text-gray-600">
            Choose a file to share with others
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInput}
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {!file ? (
              <div>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                
                <p className="text-gray-700 mb-2 font-medium">
                  Drag and drop your file here
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  or click the button below
                </p>
                
                <button
                  onClick={handleUploadClick}
                  className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Choose File
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <p className="font-medium text-gray-800 mb-1">{file.name}</p>
                <p className="text-gray-500 text-sm mb-4">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                </p>
                
                {isUploading ? (
                 

                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-600">Uploading... {uploadProgress}%</span>
                    </div>
                   
                    <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-xs mt-1">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>

                    <button 
                        onClick={handlePause}
                        className="text-sm font-medium text-amber-600 hover:text-amber-700 hover:underline mt-2"
                    >
                        Pause Upload
                    </button>
                  </div>
                ) : (
                  
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={startUpload}
                      className={`px-4 py-2 rounded text-white ${
                        uploadProgress > 0 
                        ? "bg-amber-500 hover:bg-amber-600" 
                        : "bg-green-500 hover:bg-green-600" 
                      }`}
                    >
                      {uploadProgress > 0 ? "Resume Upload" : "Upload File"}
                    </button>
                    
                    <button
                      onClick={removeFile}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          
          <div className="mt-4 text-center">
            <p className="text-gray-500 text-sm">
              Supports all file types up to 50GB
            </p>
          </div>
        </div>

      </div>
    </div>
    )}
    </>
  );
}

export default UploadFile;