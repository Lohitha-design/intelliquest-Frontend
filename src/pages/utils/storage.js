export const saveToken = (token) => {
  try {
    localStorage.setItem("token", token);
  } catch (e) {
    sessionStorage.setItem("token", token);
  }
};
