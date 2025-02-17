import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import QrCodeDecoder from 'qrcode-decoder';

const Import = () => {
    const [status, setStatus] = useState("Please upload a QR code");
    const decoder = new QrCodeDecoder();

    const handleFileUpload = async (event) => {
        const file = event.target.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const img = new Image();
                img.src = e.target?.result;
                img.onload = async () => {
                    try {
                        const result = await decoder.decodeFromImage(img);
                        if (result) {
                            setStatus(`QR Code Valid: ${result.data}`);
                            let payload = { code: result.data };
                            await invoke('import_qr_code', payload);
                        } else {
                            setStatus('QR code not detected.');
                        }
                    } catch (err) {
                        setStatus('Error reading QR code');
                        console.error(err);
                    }
                };
            };
            reader.readAsDataURL(file);
        } else {
            setStatus("Please upload a QR code");
        }
    };

    return (
        <div>
            <h1>Import QR Code</h1>
            <input type="file" accept="image/*" multiple={false} onChange={handleFileUpload} />
            <p>{status}</p>
        </div>
    );
};

export default Import;
