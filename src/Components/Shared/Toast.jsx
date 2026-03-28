import React from "react";
import { CheckCircle, XCircle } from "lucide-react";
import "./Toast.css";

const Toast = ({ message, type = "success" }) => {
  if (!message) return null;

  return (
    <div className={`toast toast-${type}`}>
      {type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
      <span>{message}</span>
    </div>
  );
};

export default Toast;