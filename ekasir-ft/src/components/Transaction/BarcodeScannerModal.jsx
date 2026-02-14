import { useRef, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const BarcodeScannerModal = ({ onClose, onDetected }) => {
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const stoppedRef = useRef(false);

  const startScan = async () => {
    try {
      stoppedRef.current = false;
      readerRef.current = new BrowserMultiFormatReader();

      const devices =
        await BrowserMultiFormatReader.listVideoInputDevices();

      if (!devices.length) throw new Error("No camera found");

      const backCamera = devices.find(d =>
        d.label.toLowerCase().includes("back") ||
        d.label.toLowerCase().includes("rear")
      );

      const deviceId = backCamera?.deviceId || devices[0].deviceId;

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
    readerRef.current?.reset();
    readerRef.current = null;
  };

  useEffect(() => {
    return () => stopScan();
  }, []);

  return (
    <div className="scanner-overlay">
      <div className="scanner-card">
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          style={{ width: "100%" }}
        />

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
  audio.play().catch(() => { });
};
