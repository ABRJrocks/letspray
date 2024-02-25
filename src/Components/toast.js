// toast.js
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Function to show success Toast
export const showSuccessToast = (message) => {
  toast.success(message);
};

// Function to show error Toast
export const showErrorToast = (message) => {
  toast.error(message);
};
