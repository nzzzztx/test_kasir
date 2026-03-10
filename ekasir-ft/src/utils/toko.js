export const getInfoToko = async () => {
  try {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const token = auth?.token;

    if (!token) return null;

    const res = await fetch("http://192.168.2.20:5000/api/store-information", {
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
