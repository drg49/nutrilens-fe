import React, { createContext, useContext, useRef, useCallback } from "react";

const CameraContext = createContext(null);

export const CameraProvider = ({ children }) => {
  const handlerRef = useRef(null);

  const registerSnapHandler = useCallback((fn) => {
    handlerRef.current = fn;
    return () => {
      if (handlerRef.current === fn) handlerRef.current = null;
    };
  }, []);

  const snap = useCallback(() => {
    if (handlerRef.current) handlerRef.current();
  }, []);

  return (
    <CameraContext.Provider value={{ registerSnapHandler, snap }}>
      {children}
    </CameraContext.Provider>
  );
};

export const useCamera = () => {
  const ctx = useContext(CameraContext);
  if (!ctx) {
    throw new Error("useCamera must be used within a CameraProvider");
  }
  return ctx;
};

export default CameraContext;
