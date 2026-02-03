const hitungSaldoSistem = ({
  saldoAwal = 0,
  transactions = [],
  expenses = [],
  notes = [],
  activeShift,
}) => {
  const totalPenjualanTunai = transactions
    .filter(
      (t) =>
        t.metode === "TUNAI" &&
        t.status === "paid" &&
        t.shiftStartedAt === activeShift.startedAt,
    )
    .reduce((sum, t) => sum + Number(t.total || 0), 0);

  const totalPengeluaranTunai = expenses
    .filter(
      (e) => e.type === "TUNAI" && e.shiftStartedAt === activeShift.startedAt,
    )
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const kasMasukLain = notes
    .filter((n) => n.type === "IN")
    .reduce((sum, n) => sum + Number(n.amount || 0), 0);

  const kasKeluarLain = notes
    .filter((n) => n.type === "OUT")
    .reduce((sum, n) => sum + Number(n.amount || 0), 0);

  return (
    Number(saldoAwal) +
    totalPenjualanTunai -
    totalPengeluaranTunai +
    kasMasukLain -
    kasKeluarLain
  );
};

export default hitungSaldoSistem;
