import React, { useState, useContext, useEffect } from "react";
import { SocketContext } from "../contexts/SocketContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const socket = useContext(SocketContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    socket.on("loginError", (errorMessage) => {
      toast.error(errorMessage);
    });

    // Cleanup the event listener on component unmount
    return () => {
      socket.off("loginError");
    };
  }, [socket]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = () => {
    if (!email.trim()) {
      toast.error("L'email est requis.");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("L'email n'est pas valide.");
      return;
    }
    if (!password.trim()) {
      toast.error("Le mot de passe est requis.");
      return;
    }

    socket.emit("login", { email, password });
  };

  return (
    <>
      <div>
        <h1 className="title">Connexion</h1>
      </div>
      <div>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="floatingInput">Email</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            id="floatingPasswordLogin"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="floatingPasswordLogin">Mot de passe</label>
        </div>
        <button className="btn btn-primary" onClick={handleLogin}>
          Connexion
        </button>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
