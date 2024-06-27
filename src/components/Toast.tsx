import clsx from "clsx";
import { FunctionComponent } from "react";

import { useAppDispatch, useAppSelector } from "@/store/index";
import { deleteToast } from "@/store/toast.slice";

const Toast: FunctionComponent = () => {
  const toasts = useAppSelector((state) => state.toast.toasts);
  const dispatch = useAppDispatch();

  return (
    <div className="toast toast-center toast-bottom w-1/2 max-w-72">
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
