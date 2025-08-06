function TarjetaInicio({ titulo, valor }) {
    return (
      <div className="flex w-full sm:min-w-[158px] sm:flex-1 flex-col gap-2 p-6 bg-gray-100 rounded-xl shadow-sm">
        <p className="text-base font-medium">{titulo}</p>
        <p className="text-2xl font-bold">{valor}</p>
      </div>
    );
  }
  
  export default TarjetaInicio;
  