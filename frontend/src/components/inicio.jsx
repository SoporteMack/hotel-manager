import { useEffect, useState } from "react";
import TarjetaInicio from "./inicio/tarjetainicio";
import { pagosdeldia as pagos, ocupacion as totalocupacion } from "../api/inicio";


function dashboard() {
    const [pagosdeldia, setpagosdeldia] = useState(0);
    const [ocupacion, setocupacion] = useState({})
    const obtenerpagosdeldia = async () => {
        try {
            const fecha = new Date();
            const anio = fecha.getFullYear();
            const mes = String(fecha.getMonth()+1).padStart(2,'0');
            const dia = String(fecha.getDay()).padStart(2,'0');
            const fechaFormateada =  anio+'-'+mes+'-'+dia
            const res = await pagos(fechaFormateada);
            setpagosdeldia(res.data.monto)
        } catch (error) {
            console.log(error)
        }
    }
    const obtenerocupacion = async () => {
        try {
            const res = await totalocupacion();
            setocupacion(res.data);
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        obtenerpagosdeldia();
        obtenerocupacion();
    }, [])

    return (
        <div>
            <div className="flex flex-wrap justify-between gap-3 p-4">
                <p className="text-2xl sm:text-3xl font-bold min-w-72">Inicio</p>
            </div>
            <div className="flex flex-wrap gap-4 p-4">

                <TarjetaInicio titulo="Ingresos Recientes" valor={`$${pagosdeldia}`} />
                <TarjetaInicio titulo={"Departamentos Libres"} valor={ `${ocupacion.libres}`} />
                <TarjetaInicio titulo={"Porcentaje Ocupados"} valor={ `${ocupacion.porcentaje}`} />
            </div>

            <h2 className="text-[22px] font-bold px-4 pb-3 pt-5">Recent Activity</h2>

        </div>
    );
}
export default dashboard;