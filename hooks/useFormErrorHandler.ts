// import { useState } from "react";
// import { ApiError, useErrorHandler } from "@/app/services/handleApiError";

// interface UseFormErrorHandlerReturn {
//   apiErrors: ApiError[];
//   clearErrors: () => void;
//   handleFormError: (
//     error: any,
//     setError?: (field: string, message: string) => void
//   ) => string;
// }

// export const useFormErrorHandler = (): UseFormErrorHandlerReturn => {
//   const [apiErrors, setApiErrors] = useState<ApiError[]>([]);
//   const { handleError } = useErrorHandler();

//   const clearErrors = () => {
//     setApiErrors([]);
//   };

//   const handleFormError = (
//     error: any,
//     setError?: (field: string, message: string) => void
//   ): string => {
//     const { message } = handleError(error, {
//       setFieldError: setError,
//       setApiErrors,
//       showToast: true,
//     });

//     return message;
//   };

//   return {
//     apiErrors,
//     clearErrors,
//     handleFormError,
//   };
// };
