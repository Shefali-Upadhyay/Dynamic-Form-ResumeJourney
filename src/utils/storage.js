export const saveData = (userId, data) => {
  try {
    localStorage.setItem(`formData-${userId}`, JSON.stringify(data));
  } catch (e) {}
};
export const loadData = (userId) => {
  try {
    return JSON.parse(localStorage.getItem(`formData-${userId}`) || "{}");
  } catch (e) {
    return {};
  }
};
export const saveStage = (userId, stage) => {
  try {
    localStorage.setItem(`formStage-${userId}`, stage);
  } catch (e) {}
};
export const loadStage = (userId) => {
  try {
    return localStorage.getItem(`formStage-${userId}`);
  } catch (e) {
    return null;
  }
};
