import html2pdf from "html2pdf.js";

/**
 * Generate PDF Stock Opname
 * @param {Object} opname
 * @param {String} logoUrl
 */
export const generateStockOpnamePDF = (opname, logoUrl = "") => {
  if (!opname.items || opname.items.length === 0) {
    alert("Opname belum memiliki item");
    return;
  }

  const rows = opname.items
    .map(
      (i, idx) => `
        <tr>
          <td style="border:1px solid #d1d5db;padding:6px;text-align:center">${idx + 1}</td>
          <td style="border:1px solid #d1d5db;padding:6px">${i.nama}</td>
          <td style="border:1px solid #d1d5db;padding:6px;text-align:center">${i.stokSistem}</td>
          <td style="border:1px solid #d1d5db;padding:6px;text-align:center">${i.stokFisik}</td>
          <td style="border:1px solid #d1d5db;padding:6px;text-align:center;
            color:${i.selisih < 0 ? "#dc2626" : "#16a34a"}">
            ${i.selisih}
          </td>
        </tr>
      `,
    )
    .join("");

  const element = document.createElement("div");

  element.innerHTML = `
        <div style="font-family:Arial;padding:28px;color:#111827">

        <!-- HEADER TOKO -->
        <div style="display:flex;align-items:center;gap:16px">
            ${logoUrl ? `<img src="${logoUrl}" style="height:60px"/>` : ""}
            <div>
            <h2 style="margin:0">Toko Maju Pak Ekoww</h2>
            <p style="margin:2px 0;font-size:12px;color:#374151">
                Jl. Maju Terus Tanpa Batas. 173 Purwokerto Tenggara
            </p>
            <p style="margin:0;font-size:11px;color:#6b7280">
                Telp: 0812-3456-7890
            </p>
            </div>
        </div>

        <hr style="margin:16px 0;border:1px solid #e5e7eb"/>

        <!-- JUDUL -->
        <h3 style="margin-bottom:4px">Laporan Stock Opname</h3>
        <p style="font-size:11px;color:#6b7280;margin-bottom:16px">
            Dicetak: ${new Date().toLocaleString("id-ID")}
        </p>

        <!-- INFO -->
        <table style="width:100%;font-size:12px;margin-bottom:16px">
            <tr>
            <td width="25%"><b>Tanggal</b></td>
            <td>: ${opname.tanggal}</td>
            </tr>
            <tr>
            <td><b>Label Opname</b></td>
            <td>: ${opname.kategori}</td>
            </tr>
            <tr>
            <td><b>Status</b></td>
            <td>: ${opname.status}</td>
            </tr>
            <tr>
            <td><b>Petugas</b></td>
            <td>: ${opname.user}</td>
            </tr>
        </table>

        <!-- TABEL -->
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
            Total Item: <b>${opname.totalItem}</b>
        </p>

        <!-- TTD -->
        <div style="margin-top:48px;display:flex;justify-content:space-between">
            <div style="text-align:center;width:200px">
            <p>Petugas</p>
            <div style="height:60px"></div>
            <p><b>${opname.user}</b></p>
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
