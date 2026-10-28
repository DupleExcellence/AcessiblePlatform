
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./EscutaGlobal.css";

export default function EscutaGlobal() {
  const [status, setStatus] = useState("parado");
  const [mensagem, setMensagem] = useState("");
  const location = useLocation();

  useEffect(() => {
    window.speechSynthesis?.cancel();
    setStatus("parado");
    setMensagem("");

    return () => {
      window.speechSynthesis?.cancel();
    };
  }, [location.pathname, location.search]);

  function obterTextoDaPagina() {
    const principal =
      document.querySelector("main") ||
      document.querySelector("#root");

    if (!principal) return "";

    const copia = principal.cloneNode(true);

    copia
      .querySelectorAll(
        [
          "[data-escuta-ignore]",
          "nav",
          '[role="navigation"]',
          "button",
          "script",
          "style",
          "noscript",
          "input",
          "textarea",
          "select",
          "option",
          "[aria-hidden='true']",
          "[hidden]",
        ].join(",")
      )
      .forEach((elemento) => elemento.remove());

    return (copia.innerText || copia.textContent || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function ouvirPagina() {
    if (!("speechSynthesis" in window)) {
      setMensagem(
        "Seu navegador não oferece suporte à leitura por voz."
      );
      return;
    }

    window.speechSynthesis.cancel();

    const texto = obterTextoDaPagina();

    if (!texto) {
      setMensagem("Não encontrei texto para ler nesta página.");
      return;
    }

    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = "pt-BR";
    fala.rate = 1;
    fala.pitch = 1;

    fala.onstart = () => {
      setStatus("lendo");
      setMensagem("");
    };

    fala.onend = () => {
      setStatus("parado");
    };

    fala.onerror = (evento) => {
      setStatus("parado");

      if (evento.error !== "canceled" &&
          evento.error !== "interrupted") {
        setMensagem("Não foi possível concluir a leitura.");
      }
    };

    window.speechSynthesis.speak(fala);
  }

  function pausarOuContinuar() {
    const sintetizador = window.speechSynthesis;

    if (sintetizador.paused) {
      sintetizador.resume();
      setStatus("lendo");
    } else if (sintetizador.speaking) {
      sintetizador.pause();
      setStatus("pausado");
    }
  }

  function pararLeitura() {
    window.speechSynthesis?.cancel();
    setStatus("parado");
    setMensagem("Leitura interrompida.");
  }

  return (
    <section
      className="escuta-global"
      aria-label="Leitura por voz"
      data-escuta-ignore
    >
      <div className="escuta-global__titulo">
        <span aria-hidden="true">🔊</span>
        <strong>Ouvir página</strong>
      </div>

      <div className="escuta-global__acoes">
        <button
          type="button"
          onClick={ouvirPagina}
          disabled={status === "lendo"}
          aria-label="Ler o conteúdo desta página"
        >
          Ouvir
        </button>

        <button
          type="button"
          onClick={pausarOuContinuar}
          disabled={status === "parado"}
          aria-label={
            status === "pausado"
              ? "Continuar leitura"
              : "Pausar leitura"
          }
        >
          {status === "pausado" ? "Continuar" : "Pausar"}
        </button>

        <button
          type="button"
          onClick={pararLeitura}
          disabled={status === "parado"}
          aria-label="Parar leitura"
        >
          Parar
        </button>
      </div>

      <p className="escuta-global__status" aria-live="polite">
        {mensagem ||
          (status === "lendo"
            ? "Lendo o conteúdo da página."
            : status === "pausado"
              ? "Leitura pausada."
              : "Pronto para ler.")}
      </p>
    </section>
  );
}
