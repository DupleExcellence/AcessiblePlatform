import React from "react";
import { useEffect, useState } from "react";
import "./Ranking.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export default function Ranking() {
  const [alunos, setAlunos] = useState([]);
  const [minhaPosicao, setMinhaPosicao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarRanking() {
      try {
        setCarregando(true);
        setErro("");

        // Ajuste a chave caso seu login use outro nome.
        const token = localStorage.getItem("token");

        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        const resposta = await fetch(`${API_URL}/ranking`, {
          headers,
        });

        if (!resposta.ok) {
          throw new Error(
            resposta.status === 401
              ? "Faça login para consultar o ranking."
              : "Não foi possível carregar o ranking."
          );
        }

        const dados = await resposta.json();
        setAlunos(Array.isArray(dados) ? dados : []);

        // A posição pessoal só está disponível para alunos.
        if (token) {
          const respostaEu = await fetch(`${API_URL}/ranking/eu`, {
            headers,
          });

          if (respostaEu.ok) {
            setMinhaPosicao(await respostaEu.json());
          }
        }
      } catch (error) {
        setErro(error.message || "Erro ao conectar com o servidor.");
      } finally {
        setCarregando(false);
      }
    }

    carregarRanking();
  }, []);

  const primeiros = alunos.slice(0, 3);
  const demais = alunos.slice(3);

  if (carregando) {
    return (
      <main className="ranking-page">
        <p className="ranking-status">Carregando ranking...</p>
      </main>
    );
  }

  if (erro) {
    return (
      <main className="ranking-page">
        <section className="ranking-mensagem" role="alert">
          <h2>Não foi possível carregar o ranking</h2>
          <p>{erro}</p>
          <button
            className="ranking-botao"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="ranking-page">
      <header className="ranking-header">
        <div>
          <span className="ranking-etiqueta">GAMIFICAÇÃO</span>
          <h1>Ranking de alunos</h1>
          <p>Aprenda, conquiste XP e avance na classificação!</p>
        </div>

        <div className="ranking-total">
          <span>Participantes</span>
          <strong>{alunos.length}</strong>
        </div>
      </header>

      {minhaPosicao && (
        <section className="ranking-minha-posicao">
          <div>
            <span className="ranking-etiqueta">SUA CLASSIFICAÇÃO</span>
            <h2>
              Você está em {minhaPosicao.posicao}º lugar!
            </h2>
          </div>

          <div className="ranking-meus-xp">
            <strong>{minhaPosicao.xpTotal} XP</strong>
            <span>de experiência</span>
          </div>
        </section>
      )}

      {alunos.length === 0 ? (
        <section className="ranking-vazio">
          <h2>A classificação está começando!</h2>
          <p>Conclua atividades para conquistar seus primeiros pontos.</p>
        </section>
      ) : (
        <>
          <section className="ranking-podio">
            <div className="ranking-secao-titulo">
              <h2>🏆 Os destaques</h2>
              <p>Quem está liderando a jornada?</p>
            </div>

            <div className="ranking-podio-grid">
              {primeiros.map((aluno, indice) => {
                const posicao = indice + 1;
                const medalhas = ["🥇", "🥈", "🥉"];

                return (
                  <article
                    key={aluno.id}
                    className={`ranking-card ranking-card-${posicao}`}
                  >
                    <span className="ranking-medalha">
                      {medalhas[indice]}
                    </span>

                    <div className="ranking-avatar">
                      {(
                        aluno.nome?.trim()?.charAt(0) || "A"
                      ).toUpperCase()}
                    </div>

                    <span className="ranking-colocacao">
                      {posicao}º lugar
                    </span>

                    <h3>{aluno.nome || "Aluno"}</h3>

                    {aluno.turma && (
                      <span className="ranking-turma">
                        Turma {aluno.turma}
                      </span>
                    )}

                    <strong className="ranking-xp">
                      {aluno.xpTotal ?? 0} XP
                    </strong>

                    <span className="ranking-pontos">
                      {aluno.pontuacaoTotal ?? 0} pontos
                    </span>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="ranking-lista">
            <div className="ranking-secao-titulo">
              <h2>Classificação geral</h2>
              <p>Confira o desempenho dos participantes.</p>
            </div>

            <div className="ranking-tabela">
              <div className="ranking-linha ranking-cabecalho">
                <span>Posição</span>
                <span>Aluno</span>
                <span>Pontos</span>
                <span>Experiência</span>
              </div>

              {alunos.map((aluno, indice) => {
                const posicao = aluno.posicao ?? indice + 1;
                const ehDestaque =
                  minhaPosicao?.alunoId === aluno.id;

                return (
                  <div
                    key={aluno.id}
                    className={`ranking-linha ${
                      ehDestaque ? "ranking-linha-atual" : ""
                    }`}
                  >
                    <span className="ranking-numero">
                      {posicao <= 3
                        ? ["🥇", "🥈", "🥉"][posicao - 1]
                        : `${posicao}º`}
                    </span>

                    <div className="ranking-aluno">
                      <div className="ranking-avatar ranking-avatar-pequeno">
                        {(
                          aluno.nome?.trim()?.charAt(0) || "A"
                        ).toUpperCase()}
                      </div>

                      <div>
                        <strong>{aluno.nome || "Aluno"}</strong>
                        {aluno.turma && (
                          <span>Turma {aluno.turma}</span>
                        )}
                        {ehDestaque && (
                          <span className="ranking-voce">Você</span>
                        )}
                      </div>
                    </div>

                    <span>
                      {aluno.pontuacaoTotal ?? 0}
                    </span>

                    <strong className="ranking-xp-lista">
                      {aluno.xpTotal ?? 0} XP
                    </strong>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
