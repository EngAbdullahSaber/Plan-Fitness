import Cookies from "js-cookie";

const initialState = {
  lang: "en",
  user: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null, // Ensure cookie name is "user"
  userName: Cookies.get("userName") || null,
  accessToken: Cookies.get("accessToken") || null,
  phoneToken: Cookies.get("phoneToken") || null,
};

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_USER_DATA":
      // Set the cookie with the user data
      Cookies.set("user", JSON.stringify(action.payload), { path: "/" });

      return {
        ...state,
        user: action.payload,
      };

    case "SET_USER_NAME":
      Cookies.set("userName", JSON.stringify(action.payload), { path: "/" });
      return {
        ...state,
        userName: action.payload,
      };

    case "SET_TOKENS":
      Cookies.set("accessToken", action.payload.accessToken, { path: "/" });
      return {
        ...state,
        accessToken: action.payload.accessToken,
      };

    case "SET_PHONE_TOKENS":
      Cookies.set("phoneToken", action.payload.phoneToken, { path: "/" });
      return {
        ...state,
        phoneToken: action.payload.phoneToken,
      };

    case "REMOVE_TOKENS":
      Cookies.remove("accessToken", { path: "/" });
      Cookies.remove("phoneToken", { path: "/" });
      return {
        ...state,
        accessToken: null,
        phoneToken: null,
      };

    default:
      return state;
  }
}
