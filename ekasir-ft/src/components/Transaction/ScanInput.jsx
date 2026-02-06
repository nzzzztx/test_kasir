import searchIcon from "../../assets/icons/search.png";
import barcodeIcon from "../../assets/icons/barcode.png";
import scanIcon from "../../assets/icons/scan.png";

const ScanInput = ({
    search,
    setSearch,
    scanMode,
    setScanMode,
    onScanOnce,
}) => {
    return (
        <div className={`scan-wrapper ${scanMode ? "scan-active" : ""}`}>
            <div className="scan-icon search">
                <img src={searchIcon} alt="search" />
            </div>

            <button
                type="button"
                className={`scan-icon barcode ${scanMode ? "active" : ""}`}
                onClick={() => setScanMode(!scanMode)}
                title="Mode Scanner"
            >
                <img src={barcodeIcon} alt="barcode" />
            </button>

            <input
                type="text"
                placeholder={
                    scanMode
                        ? "Mode scan aktif..."
                        : "Scan barcode / input kode"
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        onScanOnce();
                    }
                }}
            />

            <button
                type="button"
                className="scan-btn"
                onClick={onScanOnce}
                title="Scan Sekali"
            >
                <img src={scanIcon} alt="scan" />
            </button>
        </div>
    );
};

export default ScanInput;
