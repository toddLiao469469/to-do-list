import { useAppSelector, useAppDispatch } from "@store/index";
import { deleteToast } from "@store/slices/toastSlice";
import clsx from "clsx";
import { FunctionComponent } from "react";

const Toast: FunctionComponent = () => {
  const toasts = useAppSelector((state) => state.toast.toasts);
  const dispatch = useAppDispatch();

  return (
    <div className="toast toast-bottom toast-center">
      {toasts.map(({ toastId, type, message }) => (
        <div
          key={toastId}
          onClick={() => dispatch(deleteToast(toastId))}
          className={clsx("alert", {
            "alert-success": type === "success",
            "alert-danger": type === "error",
            "alert-warning": type === "warning",
            "alert-info": type === "info",
          })}
        >
          <span>{message}</span>
        </div>
      ))}
    </div>
  );
};

export default Toast;
