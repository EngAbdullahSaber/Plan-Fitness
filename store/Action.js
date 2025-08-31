// Action to store user data
export function changeUserData(data) {
  return {
    type: "SET_USER_DATA",
    payload: data,
  };
}
export function setUserName(data) {
  return {
    type: "SET_USER_NAME",
    payload: data,
  };
}
export const setTokens = (accessToken) => ({
  type: "SET_TOKENS",
  payload: { accessToken },
});
export const setPhoneTokens = (phoneToken) => ({
  type: "SET_PHONE_TOKENS",
  payload: { phoneToken },
});
export const removeTokens = () => ({
  type: "REMOVE_TOKENS",
});
