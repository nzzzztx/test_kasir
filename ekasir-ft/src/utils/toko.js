import { getCurrentOwnerId } from "./owner";

const DEFAULT_TOKO = {
  namaToko: "Nama Toko",
  pemilik: "-",
  telepon: "-",
  lokasi: "-",
  metodeAkuntansi: "-",
  statusOlshop: "-",
};

export const getInfoToko = () => {
  const ownerId = getCurrentOwnerId();
  if (!ownerId) return DEFAULT_TOKO;

  const STORAGE_KEY = `informasi_toko_owner_${ownerId}`;

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
