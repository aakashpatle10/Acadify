import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { BsQrCodeScan, BsCheckCircle, BsXCircle, BsCamera } from 'react-icons/bs';

const QrScanner = ({ isOpen, onClose }) => {
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [cameraPermission, setCameraPermission] = useState(null);
    const scannerRef = useRef(null);
    const html5QrCodeRef = useRef(null);

    useEffect(() => {
        if (isOpen && !html5QrCodeRef.current) {
            html5QrCodeRef.current = new Html5Qrcode("qr-reader");
        }

        return () => {
            if (html5QrCodeRef.current && scanning) {
                stopScanning();
            }
        };
    }, [isOpen]);

    const startScanning = async () => {
        try {
            setError(null);
            setResult(null);

            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            };

            await html5QrCodeRef.current.start(
                { facingMode: "environment" },
                config,
                onScanSuccess,
                onScanError
            );

            setScanning(true);
            setCameraPermission('granted');
        } catch (err) {
            console.error('Scanner error:', err);
            setError('Failed to access camera. Please grant camera permissions.');
            setCameraPermission('denied');
        }
    };

    const stopScanning = async () => {
        try {
            if (html5QrCodeRef.current) {
                await html5QrCodeRef.current.stop();
                setScanning(false);
            }
        } catch (err) {
            console.error('Error stopping scanner:', err);
        }
    };

    const onScanSuccess = async (decodedText) => {
        // Stop scanning immediately
        await stopScanning();

        // Mark attendance
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/attendance/mark`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    token: decodedText,
                    sessionId: extractSessionId(decodedText) // Extract from token or use separate field
                })
            });

            const data = await response.json();

            if (data.success) {
                setResult({
                    type: 'success',
                    message: 'Attendance marked successfully! ✓'
                });
            } else {
                setResult({
                    type: 'error',
                    message: data.message || 'Failed to mark attendance'
                });
            }
        } catch (err) {
            setResult({
                type: 'error',
                message: 'Network error. Please try again.'
            });
        }
    };

    const onScanError = (errorMessage) => {
        // Ignore scan errors (they happen frequently while scanning)
    };

    const extractSessionId = (token) => {
        // For now, we'll need to modify the token format to include sessionId
        // Or pass it separately. This is a placeholder.
        return token.split(':')[0]; // Temporary
    };

    const handleClose = async () => {
        if (scanning) {
            await stopScanning();
        }
        setResult(null);
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                {/* Header */}
                <div className="border-b border-gray-200 p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Scan QR Code</h2>
                        <p className="text-sm text-gray-500 mt-1">Position QR code within the frame</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <BsXCircle className="text-2xl text-gray-500" />
                    </button>
                </div>

                {/* Scanner Area */}
                <div className="p-6">
                    {!scanning && !result && (
                        <div className="text-center">
                            <div className="bg-blue-50 rounded-xl p-8 mb-4">
                                <BsCamera className="text-6xl text-blue-600 mx-auto mb-4" />
                                <p className="text-gray-600 mb-4">
                                    Click the button below to start scanning
                                </p>
                                <button
                                    onClick={startScanning}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                                >
                                    <BsQrCodeScan />
                                    Start Scanner
                                </button>
                            </div>
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}
                        </div>
                    )}

                    {scanning && (
                        <div>
                            <div id="qr-reader" className="rounded-xl overflow-hidden"></div>
                            <button
                                onClick={stopScanning}
                                className="mt-4 w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                            >
                                Stop Scanner
                            </button>
                        </div>
                    )}

                    {result && (
                        <div className={`text-center p-8 rounded-xl ${result.type === 'success' ? 'bg-green-50' : 'bg-red-50'
                            }`}>
                            {result.type === 'success' ? (
                                <BsCheckCircle className="text-6xl text-green-600 mx-auto mb-4" />
                            ) : (
                                <BsXCircle className="text-6xl text-red-600 mx-auto mb-4" />
                            )}
                            <p className={`text-lg font-semibold mb-4 ${result.type === 'success' ? 'text-green-900' : 'text-red-900'
                                }`}>
                                {result.message}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setResult(null);
                                        startScanning();
                                    }}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Scan Again
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QrScanner;
