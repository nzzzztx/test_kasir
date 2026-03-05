import CryptoJS from "crypto-js";

const SECRET_KEY = "POS_APP_SECRET_KEY_2026";

export const secureSet = (key, value) => {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(value),
    SECRET_KEY,
  ).toString();

  localStorage.setItem(key, encrypted);
};

export const secureGet = (key) => {
  const encrypted = localStorage.getItem(key);

  if (!encrypted) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);

    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decrypted);
  } catch {
    return null;
  }
};

export const secureRemove = (key) => {
  localStorage.removeItem(key);
};
