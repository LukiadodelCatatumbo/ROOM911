import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/authService";

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [mensaje, setMensaje] = useState("");

    const navigate = useNavigate();


    const handleLogin = async (e) => {
        e.preventDefault();

        try {

            const data = await loginAdmin(
                username,
                password
            );


            if(data.loginCorrecto){

                localStorage.setItem(
                    "admin",
                    JSON.stringify(data)
                );

                navigate("/dashboard");

            }else{

                setMensaje(
                    "Usuario o contraseña incorrectos"
                );

            }


        } catch(error){

            setMensaje(
                "Error conectando con el servidor"
            );

        }

    };


    return (
        <div className="login-page">

            <h2 className="login-title">
                ROOM 911 - Login
            </h2>


            <form
                onSubmit={handleLogin}
                className="login-form"
            >

                <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                />


                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />


                <button
                    type="submit"
                    className="btn-primary"
                >
                    Ingresar
                </button>


            </form>


            {
                mensaje &&
                <p className="login-error">{mensaje}</p>
            }


        </div>
    );
}


export default Login;