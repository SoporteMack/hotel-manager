import { useEffect, useState } from "react";
import { registerSW } from "virtual:pwa-register";

export default function UpdatePrompt() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [updateSW, setUpdateSW] = useState(null);

  useEffect(() => {
    const update = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true);   // activa el aviso
      },
      onOfflineReady() {
        console.log("La app está lista para usar offline 🚀");
      },
    });
    setUpdateSW(() => update);
  }, []);

  if (!needRefresh) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
        <h2 className="text-lg font-semibold mb-3">
          🔄 Nueva versión disponible
        </h2>
        <p className="text-gray-600 mb-4">
          Por favor actualiza para obtener las últimas mejoras.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
            onClick={() => setNeedRefresh(false)}
          >
            Más tarde
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            onClick={async () => {
              if (updateSW) {
                await updateSW(true); // instala el nuevo SW
                window.location.reload(); // refresca con nueva versión
              }
            }}
          >
            Actualizar ahora
          </button>
        </div>
      </div>
    </div>
  );
}
