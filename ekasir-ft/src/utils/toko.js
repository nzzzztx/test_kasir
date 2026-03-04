export const getInfoToko = async (token) => {
  try {
    const res = await fetch("http://localhost:5000/api/store-information", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return null;

    const data = await res.json();

    if (!data) return null;

    return {
      namaToko: data.nama_toko || "Nama Toko",
      pemilik: data.pemilik || "-",
      telepon: data.telepon || "-",
      lokasi: data.lokasi || "-",
      metodeAkuntansi: data.metode_akuntansi || "-",
      statusOlshop: data.status_olshop || "-",
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};
