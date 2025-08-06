// hooks/useOpenCv.js
import { useEffect, useState } from "react";

export function useOpenCv() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const checkIfReady = () => {
      if (window.cv && window.cv.imread) {
        setReady(true);
      }
    };

    // Ya cargado
    if (window.cv && window.cv.imread) {
      setReady(true);
      return;
    }

    // Ya se está cargando
    if (document.getElementById("opencv-script")) {
      const interval = setInterval(checkIfReady, 300);
      return () => clearInterval(interval);
    }

    // Cargar OpenCV
    const script = document.createElement("script");
    script.id = "opencv-script";
    script.src = "https://docs.opencv.org/4.x/opencv.js";
    script.async = true;
    script.onload = () => {
      const interval = setInterval(() => {
        if (window.cv && window.cv.imread) {
          clearInterval(interval);
          setReady(true);
        }
      }, 300);
    };
    script.onerror = () => {
      console.error("No se pudo cargar OpenCV.js");
    };
    document.body.appendChild(script);
  }, []);

  return ready;
}


export default useOpenCv