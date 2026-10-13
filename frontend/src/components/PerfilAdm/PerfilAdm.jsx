import { useState } from "react";
import "./PerfilAdm.css";

export default function PerfilAdm() {
  const [editando, setEditando] = useState(false);

  const [aluno, setAluno] = useState({
    nome: "João Silva",
    email: "joao@email.com",
    nascimento: "2008-05-15",
    telefone: "(11) 98765-4321",
  });

  const atualizarCampo = (e) => {
    setAluno({
      ...aluno,
      [e.target.name]: e.target.value,
    });
  };

  const menu = [
    { icone: "⌂", texto: "Home" },
    { icone: "▣", texto: "Cadastro" },
    { icone: "▤", texto: "Cursos" },,
    { icone: "●", texto: "Perfil" },
  ];

  return (
    <main className="perfil-aluno">

      {/* Menu lateral */}
      <aside className="perfil-sidebar">
        <div className="perfil-logo">
          <span className="logo-icone">◈</span>
          <span>Aprender</span>
        </div>

        <nav className="perfil-menu">
          {menu.map((item) => (
            <button
              type="button"
              key={item.texto}
              className={`perfil-menu-item ${
                item.texto === "Perfil" ? "ativo" : ""
              }`}
              onClick={() => {
                if (item.texto !== "Perfil") {
                  console.log(`Menu selecionado: ${item.texto}`);
                }
              }}
            >
              <span className="menu-icone">{item.icone}</span>
              <span>{item.texto}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Área principal */}
      <section className="perfil-conteudo">

        {/* Cabeçalho */}
        <header className="perfil-topbar">
          <span className="perfil-notificacao" aria-label="Notificações">
            🔔
          </span>

          <div className="perfil-avatar-mini" aria-label="Avatar do aluno">
           👤
          </div>
        </header>

        {/* Cartão do perfil */}
        <div className="perfil-card">
          <h1>Perfil</h1>

          <div className="perfil-foto-container">
            <div className="perfil-foto" aria-label="Foto do aluno">
              👤
            </div>

            <button
              type="button"
              className="perfil-camera"
              aria-label="Alterar foto do perfil"
              title="Alterar foto do perfil"
              onClick={() =>
                document.getElementById("foto-aluno").click()
              }
            >
              📷
            </button>

            <input
              id="foto-aluno"
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const arquivo = e.target.files?.[0];
                if (arquivo) {
                  alert(`Foto selecionada: ${arquivo.name}`);
                }
              }}
            />
          </div>

          <h2>Dados pessoais</h2>

          <form
            className="perfil-formulario"
            onSubmit={(e) => {
              e.preventDefault();
              setEditando(false);
              alert("Dados do perfil atualizados!");
            }}
          >
            <div className="perfil-campo">
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                name="nome"
                type="text"
                value={aluno.nome}
                onChange={atualizarCampo}
                readOnly={!editando}
                required
              />
            </div>

            <div className="perfil-campo">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                value={aluno.email}
                onChange={atualizarCampo}
                readOnly={!editando}
                required
              />
            </div>

            <div className="perfil-campo">
              <label htmlFor="nascimento">Data de nascimento</label>
              <input
                id="nascimento"
                name="nascimento"
                type={editando ? "date" : "text"}
                value={
                  editando
                    ? aluno.nascimento
                    : aluno.nascimento.split("-").reverse().join("/")
                }
                onChange={atualizarCampo}
                readOnly={!editando}
                required
              />
            </div>

            <div className="perfil-campo">
              <label htmlFor="telefone">Telefone</label>
              <input
                id="telefone"
                name="telefone"
                type="tel"
                value={aluno.telefone}
                onChange={atualizarCampo}
                readOnly={!editando}
                required
              />
            </div>

            <div className="perfil-acoes">
              {editando && (
                <button
                  type="button"
                  className="perfil-botao cancelar"
                  onClick={() => {
                    setAluno({
                      nome: "João Silva",
                      email: "joao@email.com",
                      nascimento: "2008-05-15",
                      telefone: "(11) 98765-4321",
                    });
                    setEditando(false);
                  }}
                >
                  Cancelar
                </button>
              )}

              <button
                type={editando ? "submit" : "button"}
                className="perfil-botao"
                onClick={() => {
                  if (!editando) setEditando(true);
                }}
              >
                {editando ? "Salvar alterações" : "Editar perfil"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
