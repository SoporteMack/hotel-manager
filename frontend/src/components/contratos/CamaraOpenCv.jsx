import React, { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import { useOpenCv } from "../../hooks/useOpenCv";

function CamaraOpenCv({ onCapturar }) {
  const webcamRef = useRef(null);
  const cvReady = useOpenCv();
  const [procesando, setProcesando] = useState(false);
  const [preview, setPreview] = useState(null);
  const [camaraLista, setCamaraLista] = useState(false);

  const detectarYRecortar = useCallback(() => {
    if (!cvReady) {
      alert("OpenCV aún no está listo");
      return;
    }

    if (!camaraLista || !webcamRef.current) {
      alert("La cámara no está lista.");
      return;
    }

    setProcesando(true);
    const imageSrc = webcamRef.current.getScreenshot();
    console.log("imageSrc:", imageSrc);

    if (!imageSrc) {
      console.error("No se pudo capturar imagen");
      alert("No se pudo capturar imagen desde la cámara.");
      setProcesando(false);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = () => {
      console.log("Imagen cargada");
      console.log("OpenCV:", window.cv);

      try {
        const cv = window.cv;
        const src = cv.imread(img);
        const gray = new cv.Mat();
        const blurred = new cv.Mat();
        const edged = new cv.Mat();

        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
        cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
        cv.Canny(blurred, edged, 75, 200);

        const contours = new cv.MatVector();
        const hierarchy = new cv.Mat();
        cv.findContours(edged, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

        let maxArea = 0;
        let maxContour = null;

        for (let i = 0; i < contours.size(); i++) {
          const contour = contours.get(i);
          const peri = cv.arcLength(contour, true);
          const approx = new cv.Mat();
          cv.approxPolyDP(contour, approx, 0.02 * peri, true);

          if (approx.rows === 4) {
            const area = cv.contourArea(approx);
            if (area > maxArea) {
              maxArea = area;
              if (maxContour) maxContour.delete();
              maxContour = approx;
            } else {
              approx.delete();
            }
          } else {
            approx.delete();
          }
          contour.delete();
        }

        console.log("Contorno encontrado:", !!maxContour);

        if (maxContour) {
          const dstMat = recortarDocumento(src, maxContour);
          cv.imshow("canvasOutput", dstMat);
          const canvas = document.getElementById("canvasOutput");
          const croppedBase64 = canvas.toDataURL("image/jpeg");
          setPreview(croppedBase64);
          onCapturar(croppedBase64);
          dstMat.delete();
          maxContour.delete();
        } else {
          console.warn("No se detectó documento, se usará imagen original");
          setPreview(imageSrc);
          onCapturar(imageSrc);
        }

        src.delete();
        gray.delete();
        blurred.delete();
        edged.delete();
        contours.delete();
        hierarchy.delete();
      } catch (err) {
        console.error("Error al procesar con OpenCV:", err);
        alert("Ocurrió un error procesando la imagen.");
      } finally {
        setProcesando(false);
      }
    };

    img.onerror = () => {
      console.error("Error cargando imagen");
      alert("No se pudo cargar la imagen capturada.");
      setProcesando(false);
    };
  }, [cvReady, camaraLista, onCapturar]);

  function recortarDocumento(src, contour) {
    const cv = window.cv;
    const pts = [];

    for (let i = 0; i < 4; i++) {
      const point = contour.intPtr(i, 0);
      pts.push({ x: point[0], y: point[1] });
    }

    pts.sort((a, b) => a.y - b.y);
    const topPts = pts.slice(0, 2).sort((a, b) => a.x - b.x);
    const bottomPts = pts.slice(2, 4).sort((a, b) => a.x - b.x);
    const orderedPts = [topPts[0], topPts[1], bottomPts[1], bottomPts[0]];

    const widthA = Math.hypot(orderedPts[2].x - orderedPts[3].x, orderedPts[2].y - orderedPts[3].y);
    const widthB = Math.hypot(orderedPts[1].x - orderedPts[0].x, orderedPts[1].y - orderedPts[0].y);
    const maxWidth = Math.max(widthA, widthB);

    const heightA = Math.hypot(orderedPts[1].x - orderedPts[2].x, orderedPts[1].y - orderedPts[2].y);
    const heightB = Math.hypot(orderedPts[0].x - orderedPts[3].x, orderedPts[0].y - orderedPts[3].y);
    const maxHeight = Math.max(heightA, heightB);

    const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
      orderedPts[0].x, orderedPts[0].y,
      orderedPts[1].x, orderedPts[1].y,
      orderedPts[2].x, orderedPts[2].y,
      orderedPts[3].x, orderedPts[3].y,
    ]);

    const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
      0, 0,
      maxWidth - 1, 0,
      maxWidth - 1, maxHeight - 1,
      0, maxHeight - 1,
    ]);

    const M = cv.getPerspectiveTransform(srcTri, dstTri);
    const dsize = new cv.Size(maxWidth, maxHeight);
    const dstMat = new cv.Mat();

    cv.warpPerspective(src, dstMat, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

    srcTri.delete();
    dstTri.delete();
    M.delete();

    return dstMat;
  }

  return (
    <div className="space-y-2">
      {!cvReady && <p className="text-center text-gray-500">Cargando OpenCV...</p>}

      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        onUserMedia={() => setCamaraLista(true)}
        videoConstraints={{
          facingMode: "environment",
          width: 900,
          height: 1300,
        }}
        className="w-full rounded shadow"
      />

      <button
        onClick={detectarYRecortar}
        disabled={!cvReady || procesando}
        className="bg-green-600 text-white py-1 px-3 rounded w-full"
      >
        {procesando ? "Procesando..." : "Detectar y Capturar Documento"}
      </button>

      {preview && (
        <>
          <canvas id="canvasOutput" style={{ display: "none" }}></canvas>
          <p className="mt-2 font-semibold">Preview recortado:</p>
          <img src={preview} alt="Documento recortado" className="rounded shadow max-w-full" />
        </>
      )}
    </div>
  );
}

export default CamaraOpenCv;
