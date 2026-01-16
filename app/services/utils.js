"use client";
import { headerConfigKeyName } from "./app.config";
import { toast } from "react-hot-toast";

export function getHeaderConfig(lang) {
  if (
    typeof localStorage !== "undefined" &&
    localStorage.getItem(headerConfigKeyName)
  ) {
    return {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // "Accept-Language": lang,
        lang: lang,
        Authorization: ` Bearer ${JSON.parse(
          localStorage.getItem(headerConfigKeyName)
        )}`,
      },
    };
    //  JSON.parse(localStorage.getItem(headerConfigKeyName));
  } else {
    return {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // "Accept-Language": lang,
        lang: lang,
      },
    };
  }
}

export const storeTokenInLocalStorage = (token) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(headerConfigKeyName, JSON.stringify(token));
  }
};
export const RemoveTokenInLocalStorage = () => {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(headerConfigKeyName);
  }
};
export function getToken() {
  if (typeof localStorage !== "undefined") {
    return localStorage.getItem(headerConfigKeyName);
  }
  return null; // If localStorage is not available
}

export function getRole() {
  if (typeof localStorage !== "undefined") {
    // return localStorage.getItem("RoleTelecome");
    const roles = localStorage.getItem("RoleTelecome");
    return JSON.parse(roles);
  }
  return null; // If localStorage is not available
}

export const storeRoleInLocalStorage = async (role) => {
  if (typeof localStorage !== "undefined") {
    let roles = [];
    const res = await getByIdRole(role);
    res.rolePermissions.map((roleItem) => {
      // console.log("roleItem >", roleItem.permission)
      roles.push(roleItem.permission.name);
    });
    localStorage.setItem("RoleTelecome", JSON.stringify(roles));
    // localStorage.setItem("RoleTelecome", role);
  }
};

export function clearAuthInfo() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(headerConfigKeyName);
    localStorage.removeItem("RoleTelecome");
  }
}

export function makeFilterString(filter_obj) {
  let filterString = "?";
  console.log(filter_obj);

  Object.keys(filter_obj).forEach((key) => {
    const value = filter_obj[key];

    if (value !== null && value !== "" && value !== undefined) {
      if (Array.isArray(value)) {
        // Handle array values - create multiple key=value pairs
        value.forEach((arrayValue) => {
          if (
            arrayValue !== null &&
            arrayValue !== "" &&
            arrayValue !== undefined
          ) {
            filterString += `${encodeURIComponent(key)}=${encodeURIComponent(
              arrayValue
            )}&`;
          }
        });
      } else {
        // Handle single values
        filterString += `${encodeURIComponent(key)}=${encodeURIComponent(
          value
        )}&`;
      }
    }
  });

  // Remove trailing '&' if present
  if (filterString.endsWith("&")) {
    filterString = filterString.slice(0, -1);
  }

  // If only '?' remains, return empty string
  if (filterString === "?") {
    return "";
  }

  return filterString;
}
export const handleApiResponseError = (responseData) => {
  if (!responseData) {
    toast.error("An unexpected error occurred");
    return;
  }

  // Handle duplicate key error (specific case from your example)
  if (
    responseData.code === 400 &&
    responseData.message?.includes("Duplicate key violation")
  ) {
    toast.error(responseData.message);
    return;
  }

  // Handle array of error objects in message field
  if (Array.isArray(responseData.message)) {
    const errorMessages = responseData.message
      .map((err) => {
        const field = err?.field || "";
        const message = err?.message || "Validation error";
        return field ? `${field}: ${message}` : message;
      })
      .join("\n");
    toast.error(errorMessages);
    return;
  }

  // Handle simple string message
  if (typeof responseData.message === "string") {
    toast.error(responseData.message);
    return;
  }

  // Handle top-level error
  if (typeof responseData.error === "string") {
    toast.error(responseData.error);
    return;
  }

  // Fallback error message
  toast.error("An unexpected error occurred");
};

export const handleApiError = (err) => {
  if (err?.response) {
    // Handle Axios error response
    handleApiResponseError(err.response.data || err.response);
  } else if (err?.message) {
    toast.error(err.message);
  } else {
    toast.error("An unexpected error occurred");
  }
};
