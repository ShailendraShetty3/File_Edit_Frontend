// src/App.js
import React, { useState, useRef } from 'react';
import { Layout, Typography, Button, message } from 'antd';
import ReactPlayer from 'react-player';
import VideoUpload from './videoUpload';
import LogoUpload from './LogoUpload';
import './style.css';

const { Header, Content } = Layout;
const { Title } = Typography;

const App = () => {
    const [videoUrl, setVideoUrl] = useState(null);
    const [logoUrl, setLogoUrl] = useState(null);
    const [logoSize, setLogoSize] = useState({ width: 100, height: 100 });
    const [logoPosition, setLogoPosition] = useState({ x: 50, y: 50 });
    const logoRef = useRef(null);

    const handleUpload = (url) => {
        setVideoUrl(url);
        message.success('Video uploaded successfully!');
    };

    const handleLogoUpload = (url) => {
        setLogoUrl(url);
        message.success('Logo uploaded successfully!');
    };

    const handleResize = (event) => {
        const newWidth = Math.max(50, logoSize.width + event.movementX);
        const newHeight = Math.max(50, logoSize.height + event.movementY);
        setLogoSize({ width: newWidth, height: newHeight });
    };

    const handleDragStart = (event) => {
        const logo = logoRef.current;
        if (logo) {
            logo.initialX = logoPosition.x;
            logo.initialY = logoPosition.y;
            logo.startX = event.clientX;
            logo.startY = event.clientY;
            logo.style.cursor = 'grabbing';
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', handleDragEnd);
        }
    };

    const handleDrag = (event) => {
        const newX = logoRef.current.initialX + (event.clientX - logoRef.current.startX);
        const newY = logoRef.current.initialY + (event.clientY - logoRef.current.startY);
        setLogoPosition({ x: newX, y: newY });
    };

    const handleDragEnd = () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', handleDragEnd);
        logoRef.current.style.cursor = 'grab';
    };

    const handleDownload = () => {
        const videoElement = document.querySelector('video');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        context.drawImage(videoElement, 0, 0);

        const logoImage = new Image();
        logoImage.src = logoUrl;

        logoImage.onload = () => {
            context.drawImage(logoImage, logoPosition.x, logoPosition.y, logoSize.width, logoSize.height);

            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'modified_video.mp4';
                    document.body.appendChild(a); // Append to body
                    a.click();
                    document.body.removeChild(a); // Remove after click
                    URL.revokeObjectURL(url);
                } else {
                    alert("Failed to create blob for video download.");
                }
            }, 'video/mp4');
        };
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <h2>Video Editor</h2>
            <Content style={{ padding: '20px', background: '#fff' }}>
                <VideoUpload onUpload={handleUpload} />
                <LogoUpload onLogoUpload={handleLogoUpload} />

                {videoUrl && (
                    <div style={{ position: 'relative', marginTop: '20px' }}>
                        <ReactPlayer 
                            url={videoUrl} 
                            controls 
                            width="100%" 
                            height="80vh" // Set video height to 80vh
                        />
                        {logoUrl && (
                            <img
                                ref={logoRef}
                                src={logoUrl}
                                alt="Logo"
                                style={{
                                    position: 'absolute',
                                    top: logoPosition.y,
                                    left: logoPosition.x,
                                    width: logoSize.width,
                                    height: logoSize.height,
                                    cursor: 'grab',
                                    pointerEvents: 'auto'
                                }}
                                onMouseDown={handleDragStart}
                            />
                        )}
                    </div>
                )}
                {logoUrl && (
                    <Button 
                        type="primary" 
                        onClick={handleDownload} 
                        style={{ marginTop: '20px' }}
                    >
                        Download Video
                    </Button>
                )}
            </Content>
        </Layout>
    );
};

export default App;

