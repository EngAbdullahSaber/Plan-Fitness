import { UseFormSetError } from "react-hook-form";
import toast from "react-hot-toast";

/**
 * Handles API and Axios errors in a reusable way.
 * @param error - The caught error object (Axios or general)
 * @param setError - Optional react-hook-form setError function
 * @param setApiErrors - Optional function to store full API errors
 */
export function handleApiError(error: any) {
  console.log(error);
}
