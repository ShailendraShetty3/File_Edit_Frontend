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
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'modified_video.mp4';
            a.click();
            URL.revokeObjectURL(url);
        }, 'video/mp4');
    };
};
