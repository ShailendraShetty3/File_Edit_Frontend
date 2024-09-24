// src/components/LogoUpload.js
import React from 'react';

const LogoUpload = ({ onLogoUpload }) => {
    const handleLogoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const logoUrl = URL.createObjectURL(file);
            onLogoUpload(logoUrl);
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleLogoChange} />
        </div>
    );
};

export default LogoUpload;
