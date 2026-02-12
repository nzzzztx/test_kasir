export const getCurrentOwnerId = () => {
  const auth = JSON.parse(localStorage.getItem("authData"));
  if (!auth) return null;

  if (auth.role === "owner") return auth.id;

  // kalau kasir / gudang
  return auth.ownerId;
};
