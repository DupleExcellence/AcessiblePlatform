
const suporteDisponivel =
  typeof window !== "undefined" &&
  "speechSynthesis" in window &&
  "SpeechSynthesisUtterance" in window;

let leituraAtual = null;

export function verificarSuporteEscuta() {
  return suporteDisponivel;
}

export function falarTexto(texto, callbacks = {}) {
  if (!suporteDisponivel) {
    callbacks.onError?.(
      "Este navegador não oferece suporte à leitura em voz alta."
    );
    return;
  }

  const textoLimpo = String(texto ?? "").trim();

  if (!textoLimpo) {
    callbacks.onError?.("Não há texto disponível para leitura.");
    return;
  }

  window.speechSynthesis.cancel();

  const leitura = new SpeechSynthesisUtterance(textoLimpo);

  leitura.lang = "pt-BR";
  leitura.rate = 1;
  leitura.pitch = 1;

  leitura.onstart = () => {
    leituraAtual = leitura;
    callbacks.onStart?.();
  };

  leitura.onend = () => {
    if (leituraAtual === leitura) {
      leituraAtual = null;
    }

    callbacks.onEnd?.();
  };

  leitura.onerror = (event) => {
    if (leituraAtual === leitura) {
      leituraAtual = null;
    }

    // Cancelamentos intencionais não precisam virar erros
    // apresentados ao aluno.
    if (event.error !== "canceled" && event.error !== "interrupted") {
      callbacks.onError?.(
        "Não foi possível reproduzir a leitura. Tente novamente."
      );
    }
  };

  leituraAtual = leitura;
  window.speechSynthesis.speak(leitura);
}

export function pausarLeitura() {
  if (suporteDisponivel && window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
  }
}

export function continuarLeitura() {
  if (suporteDisponivel && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
}

export function pararLeitura() {
  if (suporteDisponivel) {
    window.speechSynthesis.cancel();
  }

  leituraAtual = null;
}
