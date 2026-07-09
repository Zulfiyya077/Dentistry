import { toast, type ToastOptions } from "react-toastify";

export type ToastType = "success" | "error" | "info" | "warning";

const defaultOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export function showToast(message: string, type: ToastType = "success") {
  switch (type) {
    case "error":
      toast.error(message, defaultOptions);
      break;
    case "info":
      toast.info(message, defaultOptions);
      break;
    case "warning":
      toast.warning(message, defaultOptions);
      break;
    default:
      toast.success(message, defaultOptions);
  }
}

export { toast };
