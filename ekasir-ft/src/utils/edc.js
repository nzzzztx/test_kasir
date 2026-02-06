export const getEDCDevices = () => {
  const raw = localStorage.getItem("edc_devices");
  return raw ? JSON.parse(raw) : [];
};

export const getActiveEDC = () => {
  return getEDCDevices().filter((d) => d.status === "connected");
};
