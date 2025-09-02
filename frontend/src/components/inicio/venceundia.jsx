import { useEffect, useState } from "react";
import { obtenerundia } from "../../api/inicio";
import TarjetaRentaProximoVencimiento from "./tarjetaRentaProximoVencimiento";

function VenceUnDia() {
    const [pVencer, setPVencer] = useState([]);
    useEffect(() => {
        getdata()
    }, [])
    const getdata = async () => {
        try {
            const dia = formatfecha(new Date());
            console.log(dia)
            const res = await obtenerundia(dia).then(res => { return res.data });
            setPVencer(res)
        } catch (error) {
            console.log(error)
        }
    }

    const formatfecha = (fecha) => {
        const hoy = new Date(fecha);
        return hoy.getFullYear() + "-" + String(hoy.getMonth()).padStart(2, "0") + "-" + String(hoy.getDate() + 1).padStart(2, "0");
    }
    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
          {/* Encabezado */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">
              Rentas que Vencen Hoy
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              Visualiza rápidamente las rentas cuyo pago vence en el día de hoy.
            </p>
          </div>
    
          {/* Grid de tarjetas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {pVencer.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center text-base sm:text-lg">
                No hay rentas por vencer hoy
              </p>
            ) : (
              pVencer.map((renta) => (
                <div
                  key={renta.idcontrato}
                  className="bg-gradient-to-tr from-blue-50 via-purple-50 to-pink-50
                             rounded-2xl shadow-md p-4 sm:p-6 hover:shadow-xl
                             transition transform hover:scale-105 duration-200"
                >
                  <TarjetaRentaProximoVencimiento renta={renta} />
                </div>
              ))
            )}
          </div>
        </div>
      );    
}
export default VenceUnDia;