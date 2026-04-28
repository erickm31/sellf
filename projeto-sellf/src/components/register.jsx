import "./../styles/register.css";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="container">
      
      {/* ESQUERDA */}
      <div className="left">
        <h1>Bem-vindo!</h1>

        <button 
          className="login-btn"
          onClick={() => navigate("/")}
        >
          Já tenho uma conta →
        </button>
      </div>

      {/* DIREITA */}
      <div className="right">
        <h2>Criar Conta</h2>

        <input type="text" placeholder="Nome" />
        <input type="text" placeholder="CPF" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Senha" />

        <div className="row">
          <input type="text" placeholder="Cidade" />
          <input type="text" placeholder="Estado" />
        </div>

        <button className="register-btn">
          Cadastrar-se
        </button>
      </div>

    </div>
  );
}