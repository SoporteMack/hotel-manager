// src/components/UpdatePrompt.jsx
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function UpdatePrompt() {
  const { needRefresh, updateServiceWorker } = useRegisterSW();

  return needRefresh ? (
    <div className="p-2 bg-yellow-200 text-black fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      Nueva versión disponible 🚀
      <button onClick={() => updateServiceWorker(true)}>Actualizar</button>
    </div>
  ) : null;
}
