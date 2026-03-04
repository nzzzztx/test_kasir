import html2pdf from "html2pdf.js";

export const generateStockOpnamePDF = (opname, toko = {}, logoUrl = "") => {
  if (!opname?.items || opname.items.length === 0) {
    alert("Opname belum memiliki item");
    return;
  }

  const tokoData = {
    namaToko: toko?.namaToko || "Nama Toko",
    lokasi: toko?.lokasi || "-",
    telepon: toko?.telepon || "-",
  };

  // ✅ FIX PETUGAS (multi kemungkinan field)
  const petugas =
    opname.created_by || opname.user_name || opname.user || opname.name || "-";

  // ✅ FIX TOTAL ITEM (selalu hitung dari items)
  const totalItem = opname.items.length;

  const rows = opname.items
    .map((i, idx) => {
      const selisih = Number(i.stok_fisik || 0) - Number(i.stok_sistem || 0);

      return `
      <tr>
        <td style="border:1px solid #d1d5db;padding:6px;text-align:center">${idx + 1}</td>
        <td style="border:1px solid #d1d5db;padding:6px">${i.product_name || "-"}</td>
        <td style="border:1px solid #d1d5db;padding:6px;text-align:center">${i.stok_sistem ?? 0}</td>
        <td style="border:1px solid #d1d5db;padding:6px;text-align:center">${i.stok_fisik ?? 0}</td>
        <td style="border:1px solid #d1d5db;padding:6px;text-align:center;
          color:${selisih < 0 ? "#dc2626" : "#16a34a"}">
          ${selisih}
        </td>
      </tr>
    `;
    })
    .join("");

  const element = document.createElement("div");

  element.innerHTML = `
    <div style="font-family:Arial;padding:28px;color:#111827">

      <div style="display:flex;align-items:center;gap:16px">
        ${logoUrl ? `<img src="${logoUrl}" style="height:60px"/>` : ""}
        <div>
          <h2 style="margin:0">${tokoData.namaToko}</h2>
          ${
            tokoData.lokasi !== "-"
              ? `<p style="margin:2px 0;font-size:12px;color:#374151">${tokoData.lokasi}</p>`
              : ""
          }
          ${
            tokoData.telepon !== "-"
              ? `<p style="margin:0;font-size:11px;color:#6b7280">Telp: ${tokoData.telepon}</p>`
              : ""
          }
        </div>
      </div>

      <hr style="margin:16px 0;border:1px solid #e5e7eb"/>

      <h3 style="margin-bottom:4px">Laporan Stock Opname</h3>
      <p style="font-size:11px;color:#6b7280;margin-bottom:16px">
        Dicetak: ${new Date().toLocaleString("id-ID")}
      </p>

      <table style="width:100%;font-size:12px;margin-bottom:16px">
        <tr>
          <td width="25%"><b>Tanggal</b></td>
          <td>: ${new Date(opname.tanggal).toLocaleDateString("id-ID")}</td>
        </tr>
        <tr>
          <td><b>Label Opname</b></td>
          <td>: ${opname.kategori || "-"}</td>
        </tr>
        <tr>
          <td><b>Status</b></td>
          <td>: ${opname.status || "-"}</td>
        </tr>
        <tr>
          <td><b>Petugas</b></td>
          <td>: ${petugas}</td>
        </tr>
      </table>

      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead style="background:#f3f4f6">
          <tr>
            <th style="border:1px solid #d1d5db;padding:6px">No</th>
            <th style="border:1px solid #d1d5db;padding:6px">Nama Barang</th>
            <th style="border:1px solid #d1d5db;padding:6px">Stok Sistem</th>
            <th style="border:1px solid #d1d5db;padding:6px">Stok Fisik</th>
            <th style="border:1px solid #d1d5db;padding:6px">Selisih</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <p style="font-size:11px;margin-top:12px">
        Total Item: <b>${totalItem}</b>
      </p>

      <div style="margin-top:48px;display:flex;justify-content:space-between">
        <div style="text-align:center;width:200px">
          <p>Petugas</p>
          <div style="height:60px"></div>
          <p><b>${petugas}</b></p>
        </div>

        <div style="text-align:center;width:200px">
          <p>Mengetahui</p>
          <div style="height:60px"></div>
          <p><b>Pimpinan</b></p>
        </div>
      </div>

    </div>
  `;

  html2pdf()
    .from(element)
    .set({
      filename: `stock-opname-${opname.tanggal}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .save();
};
