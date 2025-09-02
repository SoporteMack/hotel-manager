import { useEffect, useState } from "react"
import { obtenerrentasvencidas } from "../../api/inicio";
import TarjetaRentaVencida from "./tarjetarentasvencidos";


function RentasVencidas() {
    const [rentasVencidas, setRentasVencidas] = useState([]);
    useEffect(() => {
        getRentasVencidas();
    }, [])
    const getRentasVencidas = async () => {
        const res = await obtenerrentasvencidas().then(res => { return res.data });
        setRentasVencidas(res);
    }
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rentasVencidas.map((renta) => (
                    <TarjetaRentaVencida key={renta.idContrato} renta={renta} />
                ))}
            </div>

        </>
    )
}
export default RentasVencidas