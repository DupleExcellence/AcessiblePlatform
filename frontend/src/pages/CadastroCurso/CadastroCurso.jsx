import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { criarCurso } from "../../services/cursoServices";
import "./CadastroCurso.css";

export default function CadastroCurso() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErro("");
    setSucesso("");

    if (!titulo.trim()) {
      setErro("Informe o título do curso.");
      return;
    }

    try {
      setCarregando(true);

      const curso = await criarCurso({
        titulo,
        descricao,
        ativo,
      });

      setSucesso(
        `Curso "${curso.titulo || titulo.trim()}" cadastrado com sucesso.`
      );

      setTitulo("");
      setDescricao("");
      setAtivo(true);
    } catch (error) {
      setErro(error.message || "Não foi possível cadastrar o curso.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="cadastro-curso">
      <section className="cadastro-curso__container">
        <header className="cadastro-curso__header">
          <h1>Cadastrar curso</h1>
          <p>
            Preencha os dados para adicionar um curso à plataforma Alfabits.
          </p>
        </header>

        {erro && (
          <p className="cadastro-curso__mensagem cadastro-curso__mensagem--erro"
             role="alert">
            {erro}
          </p>
        )}

        {sucesso && (
          <p className="cadastro-curso__mensagem cadastro-curso__mensagem--sucesso"
             role="status">
            {sucesso}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="cadastro-curso__campo">
            <label htmlFor="titulo">Título do curso *</label>
            <input
              id="titulo"
              name="titulo"
              type="text"
              value={titulo}
              onChange={(event) => setTitulo(event.target.value)}
              placeholder="Ex.: Informática Básica"
              maxLength={150}
              required
              disabled={carregando}
            />
          </div>

          <div className="cadastro-curso__campo">
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              name="descricao"
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
              placeholder="Descreva os objetivos do curso."
              rows={5}
              maxLength={2000}
              disabled={carregando}
            />
          </div>

          <div className="cadastro-curso__campo cadastro-curso__campo--status">
            <label htmlFor="ativo">Status do curso</label>
            <select
              id="ativo"
              name="ativo"
              value={String(ativo)}
              onChange={(event) => setAtivo(event.target.value === "true")}
              disabled={carregando}
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>

          <div className="cadastro-curso__acoes">
            <button
              type="button"
              className="cadastro-curso__botao cadastro-curso__botao--secundario"
              onClick={() => navigate("/cursos")}
              disabled={carregando}
            >
              Voltar para cursos
            </button>

            <button
              type="submit"
              className="cadastro-curso__botao cadastro-curso__botao--primario"
              disabled={carregando}
            >
              {carregando ? "Cadastrando..." : "Cadastrar curso"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
