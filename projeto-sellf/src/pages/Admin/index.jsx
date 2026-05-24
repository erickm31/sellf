import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";
import Headerlanding from "../../components/layout/Headerlanding";

export default function Admin() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState("");
  const [editando, setEditando] = useState(null); // usuário sendo editado
  const [form, setForm] = useState({ nome: "", email: "", idtipo_usuario: "", idstatus_usuario: "" });

  useEffect(() => {
    buscarUsuarios();
  }, []);

  async function buscarUsuarios() {
    try {
      const { data } = await axios.get("http://localhost:3000/admin/usuarios", {
        withCredentials: true
      });
      setUsuarios(data);
    } catch (err) {
      if (err.response?.status === 403) {
        navigate("/landing");
      }
      setErro("Erro ao carregar usuários.");
    }
  }

  function abrirEdicao(usuario) {
    setEditando(usuario.id_usuario);
    setForm({
      nome: usuario.nome,
      email: usuario.email,
      idtipo_usuario: usuario.tipo_usuario === "comprador" ? 1 : usuario.tipo_usuario === "vendedor" ? 2 : 3,
      idstatus_usuario: usuario.status_usuario === "ativo" ? 1 : 2
    });
  }

  async function salvarEdicao(id) {
    try {
      await axios.put(`http://localhost:3000/admin/usuarios/${id}`, form, {
        withCredentials: true
      });
      setEditando(null);
      buscarUsuarios();
    } catch (err) {
      setErro("Erro ao atualizar usuário.");
    }
  }

  async function deletarUsuario(id) {
    if (!confirm("Tem certeza que deseja deletar este usuário?")) return;
    try {
      await axios.delete(`http://localhost:3000/admin/usuarios/${id}`, {
        withCredentials: true
      });
      buscarUsuarios();
    } catch (err) {
      setErro("Erro ao deletar usuário.");
    }
  }

  return (
    <div className={styles.container}>
      <Headerlanding />

      <div className={styles.content}>
        <h1 className={styles.titulo}>Gerenciamento de Usuários</h1>

        {erro && <p className={styles.erro}>{erro}</p>}

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id_usuario}>
                {editando === u.id_usuario ? (
                  // Linha em modo edição
                  <>
                    <td>{u.id_usuario}</td>
                    <td>
                      <input
                        className={styles.inputEdit}
                        value={form.nome}
                        onChange={(e) => setForm({ ...form, nome: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className={styles.inputEdit}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </td>
                    <td>
                      <select
                        className={styles.inputEdit}
                        value={form.idtipo_usuario}
                        onChange={(e) => setForm({ ...form, idtipo_usuario: Number(e.target.value) })}
                      >
                        <option value={1}>Comprador</option>
                        <option value={2}>Vendedor</option>
                        <option value={3}>Administrador</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className={styles.inputEdit}
                        value={form.idstatus_usuario}
                        onChange={(e) => setForm({ ...form, idstatus_usuario: Number(e.target.value) })}
                      >
                        <option value={1}>Ativo</option>
                        <option value={2}>Inativo</option>
                      </select>
                    </td>
                    <td>{new Date(u.data_cadastro).toLocaleDateString("pt-BR")}</td>
                    <td className={styles.acoes}>
                      <button className={styles.btnSalvar} onClick={() => salvarEdicao(u.id_usuario)}>Salvar</button>
                      <button className={styles.btnCancelar} onClick={() => setEditando(null)}>Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{u.id_usuario}</td>
                    <td>{u.nome}</td>
                    <td>{u.email}</td>
                    <td>{u.tipo_usuario}</td>
                    <td>
                      <span className={u.status_usuario === "ativo" ? styles.ativo : styles.inativo}>
                        {u.status_usuario}
                      </span>
                    </td>
                    <td>{new Date(u.data_cadastro).toLocaleDateString("pt-BR")}</td>
                    <td className={styles.acoes}>
                      <button className={styles.btnEditar} onClick={() => abrirEdicao(u)}>Editar</button>
                      <button className={styles.btnDeletar} onClick={() => deletarUsuario(u.id_usuario)}>Deletar</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}