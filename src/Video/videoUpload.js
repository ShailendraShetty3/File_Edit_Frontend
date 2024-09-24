// src/VideoUpload.js
import React from 'react';

const VideoUpload = ({ onUpload }) => {
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const videoUrl = URL.createObjectURL(file);
            console.log("Video URL:", videoUrl); // Log the video URL
            onUpload(videoUrl);
        }
    };

    return (
        <div>
            <input type="file" accept="video/*" onChange={handleFileChange} />
        </div>
    );
};

export default VideoUpload;
