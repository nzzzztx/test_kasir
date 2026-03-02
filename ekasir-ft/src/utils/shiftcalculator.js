const hitungSaldoSistem = ({
  saldoAwal = 0,
  transactions = [],
  expenses = [],
  notes = [],
}) => {
  const totalPenjualanTunai = transactions
    .filter((t) => t.payment_method === "TUNAI")
    .reduce((sum, t) => sum + Number(t.grand_total || 0), 0);

  const totalPengeluaranTunai = expenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0,
  );

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
