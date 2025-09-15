function Loader({msg}) {
    return (<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-md flex flex-col items-center gap-3">
            <div className="loader border-4 border-t-4 border-gray-200 border-t-green-500 rounded-full w-12 h-12 animate-spin"></div>
            <span className="text-gray-700 font-medium">{msg}</span>
        </div>
    </div>);
}

export default Loader;