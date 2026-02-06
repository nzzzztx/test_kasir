import { useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const BarcodeScannerModal = ({ onClose, onDetected }) => {
    const videoRef = useRef(null);
    const readerRef = useRef(null);
    const streamRef = useRef(null);
    const stoppedRef = useRef(false);

    const startScan = async () => {
        try {
            stoppedRef.current = false;
            readerRef.current = new BrowserMultiFormatReader();

            streamRef.current = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: "environment" } },
            });

            videoRef.current.srcObject = streamRef.current;
            await videoRef.current.play();

            const devices =
                await BrowserMultiFormatReader.listVideoInputDevices();

            const deviceId = devices[0]?.deviceId;
            if (!deviceId) throw new Error("Camera not found");

            readerRef.current.decodeFromVideoDevice(
                deviceId,
                videoRef.current,
                (result) => {
                    if (result && !stoppedRef.current) {
                        stoppedRef.current = true;

                        playBeep();
                        onDetected(result.text);

                        stopScan();
                        setTimeout(onClose, 300);
                    }
                }
            );
        } catch (err) {
            console.error(err);
            alert("Kamera tidak dapat digunakan");
            stopScan();
            onClose();
        }
    };

    const stopScan = () => {
        stoppedRef.current = true;

        try {
            readerRef.current?.reset();
        } catch (_) { }

        streamRef.current?.getTracks().forEach((t) => t.stop());

        readerRef.current = null;
        streamRef.current = null;
    };

    return (
        <div className="scanner-overlay">
            <div className="scanner-card">
                <video ref={videoRef} playsInline muted />

                <div className="scanner-laser" />
                <div className="scanner-hint">
                    Arahkan barcode ke tengah
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                    <button
                        className="scanner-start"
                        onClick={startScan}
                    >
                        Mulai Scan
                    </button>

                    <button
                        className="scanner-close"
                        onClick={() => {
                            stopScan();
                            onClose();
                        }}
                    >
                        Tutup
                    </button>
                </div>
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
