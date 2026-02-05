import { useEffect, useRef } from "react";

const BarcodeScannerModal = ({ onClose, onDetected }) => {
    const videoRef = useRef(null);
    const stopRef = useRef(false);

    useEffect(() => {
        let stream = null;
        let detector = null;

        const startCamera = async () => {
            if (!("BarcodeDetector" in window)) {
                alert("Browser tidak mendukung Barcode Scanner");
                onClose();
                return;
            }

            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
            });

            videoRef.current.srcObject = stream;
            await videoRef.current.play();

            detector = new BarcodeDetector({
                formats: ["ean_13", "code_128", "qr_code"],
            });

            scanLoop();
        };

        const scanLoop = async () => {
            if (stopRef.current) return;

            try {
                const barcodes = await detector.detect(videoRef.current);
                if (barcodes.length > 0) {
                    stopRef.current = true;

                    playBeep();
                    onDetected(barcodes[0].rawValue);

                    setTimeout(onClose, 500);
                    return;
                }
            } catch (e) {
                console.error("Scan error", e);
            }

            requestAnimationFrame(scanLoop);
        };

        startCamera();

        return () => {
            stopRef.current = true;
            stream?.getTracks().forEach((t) => t.stop());
        };
    }, [onClose, onDetected]);

    return (
        <div className="scanner-overlay">
            <div className="scanner-card">
                <video ref={videoRef} playsInline />

                <div className="scanner-laser" />

                <div className="scanner-hint">
                    Arahkan barcode ke tengah
                </div>

                <button className="scanner-close" onClick={onClose}>
                    Tutup
                </button>
            </div>
        </div>
    );
};

export default BarcodeScannerModal;

const playBeep = () => {
    const audio = new Audio(
        "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA="
    );
    audio.play().catch(() => { });
};
