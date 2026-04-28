import "../styles/login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="container">

      <div className="left">
        <h2>Já tem uma conta?</h2>

        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Senha" />

        <p className="forgot">Esqueceu sua senha?</p>

        <button className="primary-btn">Entrar</button>
      </div>

      <div className="right">
        <div className="right-content">
          <h1>Bem-vindo!</h1>

          <button 
            className="outline-btn"
            onClick={() => navigate("/register")}
          >
            Criar uma conta →
          </button>
        </div>
      </div>

    </div>
  );
}