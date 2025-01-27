"use client";

import { useEffect } from "react";
import BaseError from "./CustomError";
import { useHandleError } from "./useHandleError";

// The global listener in case some error occurs that we have not considered
export const useGlobalErrorHandling = () => {
  const handle = useHandleError();

  useEffect(() => {
    const handleWindowError = (event) => {
      // alert("error catched in the global listener");
      event.preventDefault();
      handle(event.error);
    };
    const handleUnhandledRejection = (event) => {
      // alert("REJECTION catched in the global listener");
      event.preventDefault();
      handle(
        new BaseError(event.reason?.message || "Unhandled promise rejection"),
      );
    };

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, [handle]);
};

// This component is just to be able to use client code in the layout file
// TODO: if it's as simple as this, why can't we just add the code to server side?
export function GlobalErrorHandler({}) {
  useGlobalErrorHandling();
}
