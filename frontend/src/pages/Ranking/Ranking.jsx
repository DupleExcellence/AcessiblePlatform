

import "../Ranking/Ranking.css";
import React from "react";
import { auth } from "../../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

import { useEffect, useState } from "react";
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
  console.log(
    "UsuÃ¡rio autenticado:",
    auth.currentUser?.uid ?? null
  );
}, []);



  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        setCarregando(true);
        setErro("");

        const [dadosRanking, dadosPosicao] =
          await Promise.all([
            buscarRanking(),
            buscarMinhaPosicao(),
          ]);

        if (!ativo) return;

        // Ajuste ao formato real retornado pelo backend.
        setRanking(
          Array.isArray(dadosRanking)
            ? dadosRanking
            : dadosRanking?.ranking ?? []
        );

        setPosicao(dadosPosicao);
      } catch (erro) {
        if (ativo) {
          setErro(erro.message);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, []);

  if (carregando) {
    return <p>Carregando ranking...</p>;
  }

  if (erro) {
    return <p role="alert">Erro ao carregar: {erro}</p>;
  }

  return (
    <section>
      <h1>Ranking</h1>

      <h2>Minha posiÃ§Ã£o</h2>
      <pre>{JSON.stringify(posicao, null, 2)}</pre>

      <h2>Melhores alunos</h2>

      {ranking.length === 0 ? (
        <p>Nenhum resultado retornado.</p>
      ) : (
        <ol>
          {ranking.map((aluno, indice) => (
            <li key={aluno.uid ?? aluno.id ?? indice}>
              {aluno.nome ?? aluno.name ?? "Aluno"} â€”{" "}
              {aluno.xp ?? 0} XP
            </li>
          ))}
        </ol>
      )}
    </section>



  );

}
