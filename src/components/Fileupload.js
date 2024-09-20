import React from 'react';

const FileUpload = ({ onFileUpload }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.ms-powerpoint')) {
      onFileUpload(file); // Call the onFileUpload function
    } else {
      alert('Please upload a valid PDF or PPT file.');
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf,.ppt,.pptx" onChange={handleFileChange} />
    </div>
  );
};

export default FileUpload;
