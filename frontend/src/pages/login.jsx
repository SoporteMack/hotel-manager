import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

function Login() {
  const { login } = useAuth();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Aplica clases al body al montar, las limpia al desmontar
  useEffect(() => {
    const root = document.getElementById('root');
    root.className = "bg-primary min-h-screen flex items-center justify-center px-4";
  
    return () => {
      root.className = "";
    };
  }, []);


  // Función para manejar submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ usuario:usuario, password:password }).then(res => {return res});
      if (res)
        navigate('/inicio');
      else
        alert(res.data.msg);
    } catch (error) {
      console.log(error);  // <-- aquí
      alert('Error al iniciar sesión');
    }
  };
  
  return (
    <main className="w-full max-w-lg ">
      <form
        className="w-full bg-form-primary p-6 sm:p-8 rounded-2xl shadow-lg shadow-shadow-primary"
        onSubmit={handleSubmit}
      >
        <h2 className="text-text-secondary text-2xl sm:text-3xl font-bold leading-tight text-center pb-6">
          Pensión Monet
        </h2>

        <div className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Email"
            className="rounded-xl w-full text-text-black bg-input-primary p-4 text-base placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-focus-form shadow-sm"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
            autoComplete="off"
          />

          <input
            type="password"
            placeholder="Password"
            className="rounded-xl w-full text-text-black bg-input-primary p-4 text-base placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-focus-form shadow-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="off"
          />

          <button
            type="submit"
            className="pt-3 bg-btn-primary text-text-black font-bold rounded-full h-12 w-full mt-2 hover:shadow-md hover:bg-btn-hover-primary transition"
          >
            Log in
          </button>
        </div>
      </form>
    </main>
  );
}

export default Login;
