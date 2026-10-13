
import React from "react";
import "./PerfilProfessor.css";

export default function PerfilProfessor() {
  return (
    <div className="perfil-professor">

      {/* Menu lateral */}
      <aside className="menu-professor">
        <div className="logo-professor">
          <span className="logo-icone">◈</span>
          <span>Aprender</span>
        </div>

        <nav className="menu-links">
          <a href="#" className="menu-link">
            <span>⌂</span> Início
          </a>

          <a href="#" className="menu-link">
            <span>▣</span> Lições a corrigir
          </a>

          <a href="#" className="menu-link">
            <span>▤</span> Cursos lecionando
          </a>

          <a href="#" className="menu-link">
            <span>♧</span> Alunos
          </a>

          <a href="#" className="menu-link">
            <span>🏆</span> Ranking de alunos
          </a>

          <a href="#" className="menu-link ativo">
            <span>◉</span> Perfil
          </a>

          <a href="#" className="menu-link">
            <span>⚙</span> Configurações
          </a>
        </nav>
      </aside>

      {/* Área principal */}
      <main className="conteudo-professor">

        {/* Barra superior */}
        <header className="topbar-professor">
          <div className="topbar-acoes">
            <button
              type="button"
              className="icone-topbar"
              aria-label="Notificações"
            >
              🔔
            </button>

            <button
              type="button"
              className="avatar-pequeno"
              aria-label="Minha conta"
            >
              👤
            </button>
          </div>
        </header>

        {/* Conteúdo do perfil */}
        <section className="cartao-perfil">
          <h1>Perfil</h1>

          <div className="avatar-container">
            <div className="avatar-professor" aria-label="Foto da professora">
              👤
            </div>

            <button
              type="button"
              className="botao-foto"
              aria-label="Alterar foto"
              title="Alterar foto"
            >
              📷
            </button>
          </div>

          <h2>Dados pessoais</h2>

          <form className="formulario-perfil">
            <div className="campo-perfil">
              <label htmlFor="nome-professor">Nome</label>
              <input
                id="nome-professor"
                type="text"
                defaultValue="Maria Souza"
              />
            </div>

            <div className="campo-perfil">
              <label htmlFor="email-professor">E-mail</label>
              <input
                id="email-professor"
                type="email"
                defaultValue="maria@email.com"
              />
            </div>

            <div className="campo-perfil">
              <label htmlFor="nascimento-professor">
                Data de nascimento
              </label>
              <input
                id="nascimento-professor"
                type="text"
                defaultValue="10/03/1985"
              />
            </div>

            <div className="campo-perfil">
              <label htmlFor="telefone-professor">Telefone</label>
              <input
                id="telefone-professor"
                type="tel"
                defaultValue="(11) 91234-5678"
              />
            </div>

            <button
              type="button"
              className="botao-editar-perfil"
              onClick={() => {
                document
                  .querySelectorAll(".formulario-perfil input")
                  .forEach((campo) => {
                    campo.disabled = false;
                  });
              }}
            >
              Editar perfil
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
