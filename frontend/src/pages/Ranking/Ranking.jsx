
import React, { useEffect, useState } from "react";
import "../Ranking/Ranking.css";

import {
  buscarRanking,
  buscarMinhaPosicao,
} from "../../services/rankingServices";

export default function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [posicao, setPosicao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarRanking() {
      try {
        setCarregando(true);
        setErro("");

        const [dadosRanking, dadosPosicao] = await Promise.all([
          buscarRanking(),
          buscarMinhaPosicao(),
        ]);

        if (!ativo) return;

        const lista = Array.isArray(dadosRanking)
          ? dadosRanking
          : dadosRanking?.ranking ??
            dadosRanking?.alunos ??
            [];

        setRanking(lista);
        setPosicao(dadosPosicao);
      } catch (error) {
        if (ativo) {
          setErro(
            error?.message || "Não foi possível carregar o ranking."
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarRanking();

    return () => {
      ativo = false;
    };
  }, []);

  if (carregando) {
    return (
      <main className="ranking-page">
        <h1>Ranking</h1>
        <p>Carregando ranking...</p>
      </main>
    );
  }

  if (erro) {
    return (
      <main className="ranking-page">
        <h1>Ranking</h1>
        <p role="alert">Erro ao carregar o ranking: {erro}</p>
        <button type="button" onClick={() => window.location.reload()}>
          Tentar novamente
        </button>
      </main>
    );
  }

  const minhaPosicao = posicao?.posicao;
  const meuXp = posicao?.xpTotal;

  return (
    <main className="ranking-page">
      <h1>Ranking de alunos</h1>

      <section className="ranking-card" aria-labelledby="minha-posicao">
        <h2 id="minha-posicao">Minha posição</h2>

        <p>
          Posição:{" "}
          <strong>
            {minhaPosicao != null ? `${minhaPosicao}º lugar` : "Não disponível"}
          </strong>
        </p>

        <p>
          XP total:{" "}
          <strong>
            {meuXp != null ? meuXp : "Não disponível"}
          </strong>
        </p>

        {posicao?.totalAlunos != null && (
          <p>Total de alunos: {posicao.totalAlunos}</p>
        )}
      </section>

      <section aria-labelledby="melhores-alunos">
        <h2 id="melhores-alunos">Classificação geral</h2>

        {ranking.length === 0 ? (
          <p>Nenhum aluno encontrado no ranking.</p>
        ) : (
          <ol className="ranking-list">
            {ranking.map((aluno, indice) => {
              const id =
                aluno.alunoId ??
                aluno.uid ??
                aluno.id ??
                indice;

              const nome =
                aluno.nome ??
                aluno.name ??
                aluno.displayName ??
                "Aluno";

              const xp = aluno.xpTotal ?? aluno.xp;
              const pontuacao = aluno.pontuacaoTotal;

              return (
                <li key={id} className="ranking-item">
                  <span className="ranking-student">
                    <strong>{indice + 1}º</strong> {nome}
                  </span>

                  <span className="ranking-score">
                    {xp != null ? `${xp} XP` : "XP indisponível"}

                    {pontuacao != null && (
                      <> · {pontuacao} pontos</>
                    )}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </main>
  );
}
