export const getCurrentOwnerId = () => {
  const raw = localStorage.getItem("auth");
  if (!raw) return null;

  try {
    const auth = JSON.parse(raw);

    if (auth.role === "owner") return auth.id;

    return auth.ownerId;
  } catch {
    return null;
  }
};
