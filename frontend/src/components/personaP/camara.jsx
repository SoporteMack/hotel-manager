import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";

function Camara({ onCapturar }) {
  const webcamRef = useRef(null);
  const [deviceId, setDeviceId] = useState(null);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    async function prepararCamara() {
      // Solicita acceso y obtiene lista de cámaras
      await navigator.mediaDevices.getUserMedia({ video: true });
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = mediaDevices.filter((d) => d.kind === "videoinput");
      setDevices(videoDevices);

      // Prioriza cámara trasera
      const backCamera = videoDevices.find((device) =>
        device.label.toLowerCase().includes("back") ||
        device.label.toLowerCase().includes("rear") ||
        device.label.toLowerCase().includes("environment")
      );
      setDeviceId(backCamera?.deviceId || videoDevices[0]?.deviceId);
    }

    prepararCamara();
  }, []);

  const capturar = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapturar(imageSrc);
  };

  return (
    <div className="space-y-2">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          deviceId: deviceId ? { exact: deviceId } : undefined,
          facingMode: "environment", // esto ayuda en móviles
          width: 900,
          height: 1300,
        }}
        className="w-full rounded shadow"
      />
      <button onClick={capturar} className="bg-green-600 text-white py-1 px-3 rounded">
        Capturar
      </button>
    </div>
  );
}

export default Camara;
