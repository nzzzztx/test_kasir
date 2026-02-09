import { useRef, useEffect } from "react";
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
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
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
        (result, err) => {
          if (result && !stoppedRef.current) {
            stoppedRef.current = true;

            playBeep();
            onDetected(result.text);

            stopScan();
            setTimeout(onClose, 300);
          }

          if (err && err.name !== "NotFoundException") {
            console.warn(err);
          }
        }
      );
    } catch (err) {
      console.error("Camera error:", err);
      alert("Kamera tidak dapat digunakan");
      stopScan();
      onClose();
    }
  };

  const stopScan = () => {
    stoppedRef.current = true;

    try {
      readerRef.current?.reset();
    } catch (_) {}

    streamRef.current?.getTracks().forEach((t) => t.stop());

    readerRef.current = null;
    streamRef.current = null;
  };

  // 🔒 cleanup kalau modal ditutup paksa
  useEffect(() => {
    return () => stopScan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="scanner-overlay">
      <div className="scanner-card">
        <video ref={videoRef} playsInline muted />

        <div className="scanner-laser" />
        <div className="scanner-hint">
          Arahkan barcode ke tengah
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button className="scanner-start" onClick={startScan}>
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
  audio.play().catch(() => {});
};
