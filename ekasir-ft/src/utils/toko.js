const STORAGE_KEY = "informasi_toko";

const DEFAULT_TOKO = {
  namaToko: "Nama Toko",
  pemilik: "-",
  telepon: "-",
  lokasi: "-",
  metodeAkuntansi: "-",
  statusOlshop: "-",
};

export const getInfoToko = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return DEFAULT_TOKO;

  try {
    const parsed = JSON.parse(saved);
    return {
      ...DEFAULT_TOKO,
      ...parsed,
    };
  } catch (e) {
    console.warn("informasi_toko rusak, fallback ke default");
    return DEFAULT_TOKO;
  }
};
