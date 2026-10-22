
import React, { useEffect, useState } from "react";

import Input from "../../components/Input/Input.jsx";
import Button from "../../components/Button/Button.jsx";
import Label from "../../components/Label/Label.jsx";
import Textarea from "../../components/Textarea/Textarea.jsx";
import Form from "../../components/Form/Form.jsx";
import Select from "../../components/Select/Select.jsx";

import { buscarLicoes } from "../../services/licaoServices.js";
import { criarAtividade } from "../../services/atividadeServices.js";

const criarFormularioInicial = () => ({
  licaoId: "",
  titulo: "",
  descricao: "",
  valorTotal: "10",
  enunciado: "",
  alternativas: [
    { id: "A", texto: "" },
    { id: "B", texto: "" },
    { id: "C", texto: "" },
    { id: "D", texto: "" },
  ],
  respostaCorreta: "A",
});

function AtividadeProfessor() {
  const [formData, setFormData] = useState(criarFormularioInicial);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [licoes, setLicoes] = useState([]);
  const [carregandoLicoes, setCarregandoLicoes] = useState(true);
  const [erroLicoes, setErroLicoes] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregarLicoes() {
      try {
        const resultado = await buscarLicoes();

        if (!Array.isArray(resultado)) {
          throw new Error(
            "A API não retornou uma lista válida de lições."
          );
        }

        if (ativo) {
          setLicoes(resultado);
        }
      } catch (error) {
        console.error("Erro ao carregar lições:", error);

        if (ativo) {
          setErroLicoes(
            error instanceof Error
              ? error.message
              : "Ocorreu um erro ao carregar as lições."
          );
        }
      } finally {
        if (ativo) {
          setCarregandoLicoes(false);
        }
      }
    }

    carregarLicoes();

    return () => {
      ativo = false;
    };
  }, []);

  function limparMensagens() {
    setErro("");
    setMensagem("");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    limparMensagens();
  }

  function atualizarAlternativa(alternativaId, texto) {
    setFormData((anterior) => ({
      ...anterior,
      alternativas: anterior.alternativas.map((alternativa) =>
        alternativa.id === alternativaId
          ? { ...alternativa, texto }
          : alternativa
      ),
    }));

    limparMensagens();
  }

  function validarFormulario() {
    if (carregandoLicoes) {
      return "Aguarde o carregamento das lições.";
    }

    if (erroLicoes) {
      return "Não foi possível carregar as lições. Tente novamente.";
    }

    if (!formData.licaoId) {
      return "Selecione a lição relacionada à atividade.";
    }

    const licaoExiste = licoes.some(
      (licao) => String(licao.id) === String(formData.licaoId)
    );

    if (!licaoExiste) {
      return "A lição selecionada não está disponível. Selecione outra.";
    }

    if (!formData.titulo.trim()) {
      return "Preencha o título da atividade.";
    }

    if (!formData.descricao.trim()) {
      return "Preencha as instruções da atividade.";
    }

    if (!formData.enunciado.trim()) {
      return "Preencha o enunciado da pergunta.";
    }

    const valorTotal = Number(formData.valorTotal);

    if (
      formData.valorTotal.trim() === "" ||
      !Number.isInteger(valorTotal) ||
      valorTotal <= 0
    ) {
      return "Informe uma pontuação total inteira maior que zero.";
    }

    if (
      formData.alternativas.length < 2 ||
      formData.alternativas.some(
        (alternativa) => !alternativa.texto.trim()
      )
    ) {
      return "Preencha pelo menos duas alternativas.";
    }

    const respostaExiste = formData.alternativas.some(
      (alternativa) => alternativa.id === formData.respostaCorreta
    );

    if (!respostaExiste) {
      return "Selecione a resposta correta.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (enviando) {
      return;
    }

    setErro("");
    setMensagem("");

    const erroValidacao = validarFormulario();

    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    const dadosAtividade = {
      licaoId: formData.licaoId,
      titulo: formData.titulo.trim(),
      descricao: formData.descricao.trim(),
      tipo: "multipla_escolha",
      alternativas: formData.alternativas.map((alternativa) => ({
        id: alternativa.id,
        texto: alternativa.texto.trim(),
        correta: alternativa.id === formData.respostaCorreta,
      })),
      pontuacaoMaxima: Number(formData.valorTotal),
    };

    try {
      setEnviando(true);

      await criarAtividade(dadosAtividade);

      setMensagem("Atividade criada com sucesso!");
      setFormData(criarFormularioInicial());
    } catch (error) {
      console.error("Erro ao criar atividade:", error);

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível criar a atividade. Tente novamente."
      );
    } finally {
      setEnviando(false);
    }
  }

  function handleLimpar() {
    const confirmou = window.confirm(
      "Deseja limpar o formulário? Todas as informações preenchidas serão apagadas."
    );

    if (!confirmou) {
      return;
    }

    setFormData(criarFormularioInicial());
    limparMensagens();
  }

  return (
    <main className="criar-licao-container">
      <h1>Criar atividade</h1>

      <p>
        Monte uma pergunta de múltipla escolha para os alunos responderem.
      </p>

      {erro && (
        <p role="alert" aria-live="assertive">
          {erro}
        </p>
      )}

      {mensagem && (
        <p role="status" aria-live="polite">
          {mensagem}
        </p>
      )}

      <Form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <Label htmlFor="licaoId">Lição relacionada</Label>

            <Select
              id="licaoId"
              name="licaoId"
              value={formData.licaoId}
              onChange={handleChange}
              disabled={carregandoLicoes || Boolean(erroLicoes)}
            >
              <option value="">Selecione uma lição</option>

              {licoes.map((licao) => (
                <option key={licao.id} value={licao.id}>
                  {licao.titulo || licao.id}
                </option>
              ))}
            </Select>

            {carregandoLicoes && (
              <p role="status">Carregando lições...</p>
            )}

            {erroLicoes && (
              <p role="alert">
                Não foi possível carregar as lições: {erroLicoes}
              </p>
            )}

            {!carregandoLicoes &&
              !erroLicoes &&
              licoes.length === 0 && (
                <p>Nenhuma lição disponível.</p>
              )}
          </div>

          <div className="form-group">
            <Label htmlFor="titulo">Título da atividade</Label>

            <Input
              id="titulo"
              name="titulo"
              type="text"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ex.: Questionário de informática básica"
            />
          </div>

          <div className="form-group">
            <Label htmlFor="descricao">Instruções</Label>

            <Textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Explique como o aluno deve responder."
            />
          </div>

          <div className="form-group">
            <Label htmlFor="valorTotal">
              Valor total em pontos
            </Label>

            <Input
              id="valorTotal"
              name="valorTotal"
              type="number"
              min="1"
              step="1"
              value={formData.valorTotal}
              onChange={handleChange}
            />
          </div>
        </div>

        <section aria-labelledby="pergunta-titulo">
          <h2 id="pergunta-titulo">Pergunta</h2>

          <div className="form-group">
            <Label htmlFor="enunciado">Enunciado</Label>

            <Textarea
              id="enunciado"
              value={formData.enunciado}
              onChange={(event) => {
                setFormData((anterior) => ({
                  ...anterior,
                  enunciado: event.target.value,
                }));

                limparMensagens();
              }}
              placeholder="Digite a pergunta."
            />
          </div>

          <p>Alternativas</p>

          {formData.alternativas.map((alternativa) => (
            <div className="form-group" key={alternativa.id}>
              <Label htmlFor={`alt-${alternativa.id}`}>
                Alternativa {alternativa.id}
              </Label>

              <Input
                id={`alt-${alternativa.id}`}
                type="text"
                value={alternativa.texto}
                onChange={(event) =>
                  atualizarAlternativa(
                    alternativa.id,
                    event.target.value
                  )
                }
                placeholder={`Digite a alternativa ${alternativa.id}`}
              />
            </div>
          ))}

          <div className="form-group">
            <Label htmlFor="respostaCorreta">
              Resposta correta (gabarito)
            </Label>

            <Select
              id="respostaCorreta"
              value={formData.respostaCorreta}
              onChange={(event) => {
                setFormData((anterior) => ({
                  ...anterior,
                  respostaCorreta: event.target.value,
                }));

                limparMensagens();
              }}
            >
              {formData.alternativas.map((alternativa) => (
                <option key={alternativa.id} value={alternativa.id}>
                  Alternativa {alternativa.id}
                </option>
              ))}
            </Select>
          </div>
        </section>

        <div className="form-actions">
          <Button
            type="button"
            variant="danger"
            onClick={handleLimpar}
            disabled={enviando}
          >
            Limpar formulário
          </Button>

          <Button type="submit" disabled={enviando}>
            {enviando ? "Criando atividade..." : "Criar atividade"}
          </Button>
        </div>
      </Form>
    </main>
  );
}

export default AtividadeProfessor;
