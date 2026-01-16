import { toast as sonnerToast } from "react-hot-toast";

// Inject custom styles
const toastStyles = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  :root {
    --toast-success-bg: linear-gradient(135deg, #10b981 0%, #059669 100%);
    --toast-error-bg: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    --toast-warning-bg: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    --toast-info-bg: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  }

  [data-sonner-toast] {
    background: white !important;
    border: none !important;
    border-radius: 16px !important;
    box-shadow: 
      0 20px 40px -8px rgba(0, 0, 0, 0.12),
      0 0 0 1px rgba(0, 0, 0, 0.05),
      0 0 60px rgba(0, 0, 0, 0.08) !important;
    padding: 0 !important;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    min-height: 64px !important;
    overflow: hidden !important;
    backdrop-filter: blur(20px);
    animation: toastSlideIn 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
  }

  [data-sonner-toast][data-styled="true"] {
    padding: 0 !important;
  }

  [data-sonner-toast]::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 5px;
    background: var(--toast-color, #3b82f6);
    border-radius: 16px 0 0 16px;
  }

  [data-sonner-toast][data-type="success"]::before {
    background: linear-gradient(180deg, #10b981 0%, #059669 100%);
  }

  [data-sonner-toast][data-type="error"]::before {
    background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
  }

  [data-sonner-toast][data-type="warning"]::before {
    background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
  }

  [data-sonner-toast][data-type="info"]::before {
    background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
  }

  [data-sonner-toast][data-mounted="true"] {
    animation: toastSlideIn 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
  }

  [data-sonner-toast][data-removed="true"] {
    animation: toastSlideOut 0.25s ease-in forwards;
  }

  [data-sonner-toast][data-swiping="true"] {
    transform: translateX(var(--swipe-amount)) scale(0.95);
    transition: none;
  }

  /* Toast content container */
  [data-content] {
    display: flex !important;
    align-items: center !important;
    gap: 16px !important;
    padding: 16px 20px 16px 24px !important;
    min-height: 64px !important;
  }

  /* Icon styling */
  [data-icon] {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 40px !important;
    height: 40px !important;
    border-radius: 12px !important;
    flex-shrink: 0 !important;
    position: relative !important;
  }

  [data-icon]::before {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 14px;
    background: inherit;
    opacity: 0.15;
    filter: blur(8px);
  }

  [data-type="success"] [data-icon] {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }

  [data-type="error"] [data-icon] {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  }

  [data-type="warning"] [data-icon] {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }

  [data-type="info"] [data-icon] {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  }

  /* Icon SVG */
  [data-icon] svg {
    width: 20px !important;
    height: 20px !important;
    color: white !important;
    stroke-width: 2.5 !important;
    z-index: 1;
    position: relative;
  }

  /* Text content */
  [data-title] {
    font-size: 14px !important;
    font-weight: 600 !important;
    color: #0f172a !important;
    line-height: 1.4 !important;
    letter-spacing: -0.01em !important;
    margin: 0 !important;
  }

  [data-description] {
    font-size: 13px !important;
    color: #64748b !important;
    line-height: 1.5 !important;
    margin: 4px 0 0 0 !important;
  }

  /* Close button */
  [data-close-button] {
    position: absolute !important;
    right: 12px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    background: transparent !important;
    border: none !important;
    width: 32px !important;
    height: 32px !important;
    border-radius: 8px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    color: #94a3b8 !important;
    transition: all 0.2s ease !important;
    opacity: 0 !important;
  }

  [data-sonner-toast]:hover [data-close-button] {
    opacity: 1 !important;
  }

  [data-close-button]:hover {
    background: #f1f5f9 !important;
    color: #475569 !important;
    transform: translateY(-50%) scale(1.1) !important;
  }

  [data-close-button]:active {
    transform: translateY(-50%) scale(0.95) !important;
  }

  [data-close-button] svg {
    width: 16px !important;
    height: 16px !important;
    stroke-width: 2.5 !important;
  }

  /* Progress bar */
  [data-sonner-toast] [data-visible="true"] + div {
    height: 3px !important;
    background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%) !important;
    border-radius: 0 0 16px 16px !important;
  }

  [data-type="success"] [data-visible="true"] + div {
    background: linear-gradient(90deg, #10b981 0%, #059669 100%) !important;
  }

  [data-type="error"] [data-visible="true"] + div {
    background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%) !important;
  }

  [data-type="warning"] [data-visible="true"] + div {
    background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%) !important;
  }

  /* Animations */
  @keyframes toastSlideIn {
    from {
      transform: translateX(100%) scale(0.9);
      opacity: 0;
    }
    to {
      transform: translateX(0) scale(1);
      opacity: 1;
    }
  }

  @keyframes toastSlideOut {
    from {
      transform: translateX(0) scale(1);
      opacity: 1;
    }
    to {
      transform: translateX(100%) scale(0.9);
      opacity: 0;
    }
  }

  /* Responsive */
  @media (max-width: 640px) {
    [data-sonner-toast] {
      margin: 8px !important;
      width: calc(100% - 16px) !important;
    }
  }

  /* Toaster container positioning */
  [data-sonner-toaster] {
    --width: 420px;
    --offset: 24px;
  }

  [data-sonner-toaster][data-x-position="right"] {
    right: var(--offset);
  }

  [data-sonner-toaster][data-y-position="top"] {
    top: var(--offset);
  }

  [data-sonner-toaster][data-y-position="bottom"] {
    bottom: var(--offset);
  }

  /* Stack effect */
  [data-sonner-toast][data-index="1"] {
    transform: translateY(-8px) scale(0.97);
    filter: brightness(0.98);
  }

  [data-sonner-toast][data-index="2"] {
    transform: translateY(-16px) scale(0.94);
    filter: brightness(0.96);
  }
</style>
`;

// Inject styles into document
if (typeof document !== "undefined") {
  const existingStyle = document.getElementById("custom-toast-styles");
  if (existingStyle) {
    existingStyle.remove();
  }

  const styleElement = document.createElement("style");
  styleElement.id = "custom-toast-styles";
  styleElement.innerHTML = toastStyles;
  document.head.appendChild(styleElement);
}

// Custom toast wrapper with enhanced styling
export const toast = {
  success: (message: string, options?: any) => {
    return sonnerToast.success(message, {
      duration: 4000,
      position: "top-right",
      ...options,
    });
  },

  error: (message: string, options?: any) => {
    return sonnerToast.error(message, {
      duration: 5000,
      position: "top-right",
      ...options,
    });
  },

  warning: (message: string, options?: any) => {
    return sonnerToast.warning(message, {
      duration: 4500,
      position: "top-right",
      ...options,
    });
  },

  info: (message: string, options?: any) => {
    return sonnerToast.info(message, {
      duration: 4000,
      position: "top-right",
      ...options,
    });
  },

  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
      position: "top-right",
    });
  },

  // Custom toast with action button
  withAction: (
    message: string,
    actionLabel: string,
    actionFn: () => void,
    type: "success" | "error" | "warning" | "info" = "info"
  ) => {
    return sonnerToast[type](message, {
      duration: 6000,
      position: "top-right",
      action: {
        label: actionLabel,
        onClick: actionFn,
      },
    });
  },
};

// Usage examples:
/*

// Basic usage
toast.success("Meal created successfully");
toast.error("Please select a valid image file (JPEG, PNG, WebP)");
toast.warning("This action requires confirmation");
toast.info("New features are available");

// With custom options
toast.success("Profile updated", { duration: 3000 });

// Promise toast
toast.promise(
  fetchData(),
  {
    loading: "Loading data...",
    success: "Data loaded successfully",
    error: "Failed to load data"
  }
);

// Toast with action
toast.withAction(
  "Changes saved",
  "Undo",
  () => console.log("Undo clicked"),
  "success"
);

*/
