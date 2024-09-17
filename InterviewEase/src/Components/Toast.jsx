import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  hideToast,
  toastShow,
  toastMessage,
  toastStatus,
} from "../Features/toastSlice";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

function Toast() {
  const Show = useSelector(toastShow);
  const Message = useSelector(toastMessage);
  const Status = useSelector(toastStatus);

  const dispatch = useDispatch();
  useEffect(() => {
    if (toastShow) {
      const timeout = setTimeout(() => {
        dispatch(hideToast());
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [toastShow, dispatch]);

  return (
    <>
      {Show && (
        <div className="fixed md:top-24 top-36 left-1/2 transform -translate-x-1/2 w-fit p-4 text-black bg-white border border-gray-400 font-bold rounded-lg shadow-xl z-50 flex items-center">
          <div
            className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${
              Status === "success"
                ? "text-green-500 bg-green-100"
                : "text-red-500 bg-red-100"
            }`}
          >
            {Status === "success" ? <CheckIcon /> : <CloseIcon />}
          </div>
          <div className="ms-3 text-sm font-semibold">{Message}</div>
        </div>
      )}
    </>
  );
}

export default Toast;
