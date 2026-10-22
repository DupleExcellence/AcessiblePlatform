
import React, { useEffect, useState } from "react";

import Input from "../../components/Input/Input.jsx";
import Button from "../../components/Button/Button.jsx";
import Label from "../../components/Label/Label.jsx";
import Textarea from "../../components/Textarea/Textarea.jsx";
import Form from "../../components/Form/Form.jsx";
import Select from "../../components/Select/Select.jsx";
import { buscarLicoes } from "../../services/licaoServices.js";
import { criarAtividade } from "../../services/atividadeServices.js";

const criarQuestao = () => ({
  id: crypto.randomUUID(),
  enunciado: "",
  alternativas: [
    { id: "A", texto: "" },
    { id: "B", texto: "" },
    { id: "C", texto: "" },
    { id: "D", texto: "" },
  ],
  respostaCorreta: "A",
});

const criarFormularioInicial = () => ({
  licaoId: "",
  titulo: "",
  descricao: "",
  valorTotal: "10",
  questoes: [criarQuestao()],
});

function AtividadeProfessor() {
  const [formData, setFormData] = useState(criarFormularioInicial);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [licoes, setLicoes] = useState([]);
  const [carregandoLicoes, setCarregandoLicoes] = useState(true);
  const [erroLicoes, setErroLicoes] = useState("");

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

  function atualizarQuestao(id, campo, valor) {
    setFormData((anterior) => ({
      ...anterior,
      questoes: anterior.questoes.map((questao) =>
        questao.id === id
          ? { ...questao, [campo]: valor }
          : questao
      ),
    }));

    limparMensagens();
  }

  function atualizarAlternativa(questaoId, alternativaId, texto) {
    setFormData((anterior) => ({
      ...anterior,
      questoes: anterior.questoes.map((questao) =>
        questao.id === questaoId
          ? {
              ...questao,
              alternativas: questao.alternativas.map(
                (alternativa) =>
                  alternativa.id === alternativaId
                    ? { ...alternativa, texto }
                    : alternativa
              ),
            }
          : questao
      ),
    }));

    limparMensagens();
  }

  function adicionarQuestao() {
    setFormData((anterior) => ({
      ...anterior,
      questoes: [...anterior.questoes, criarQuestao()],
    }));

    limparMensagens();
  }

  function removerQuestao(id) {
    setFormData((anterior) => ({
      ...anterior,
      questoes: anterior.questoes.filter(
        (questao) => questao.id !== id
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

    const valorTotal = Number(formData.valorTotal);

    if (
      formData.valorTotal.trim() === "" ||
      !Number.isFinite(valorTotal) ||
      valorTotal <= 0
    ) {
      return "Informe uma pontuação total maior que zero.";
    }

    if (formData.questoes.length === 0) {
      return "Adicione pelo menos uma questão.";
    }

    for (let i = 0; i < formData.questoes.length; i += 1) {
      const questao = formData.questoes[i];
      const numero = i + 1;

      if (!questao.enunciado.trim()) {
        return `Preencha o enunciado da questão ${numero}.`;
      }

      if (
        questao.alternativas.some(
          (alternativa) => !alternativa.texto.trim()
        )
      ) {
        return `Preencha todas as alternativas da questão ${numero}.`;
      }

      const respostaExiste = questao.alternativas.some(
        (alternativa) =>
          alternativa.id === questao.respostaCorreta
      );

      if (!respostaExiste) {
        return `Selecione a resposta correta da questão ${numero}.`;
      }
    }

    return "";
  }

  
    async function handleSubmit(event) {
    event.preventDefault();
    limparMensagens();

    const erroValidacao = validarFormulario();

    if (erroValidacao) {
        setErro(erroValidacao);
        return;
    }

    const dadosAtividade = {
        tipo: "multipla_escolha",
        licaoId: formData.licaoId,
        titulo: formData.titulo.trim(),
        descricao: formData.descricao.trim(),
        valorTotal: Number(formData.valorTotal),
        pontuacaoMaxima: Number(formData.valorTotal),
        questoes: formData.questoes.map((questao) => ({
        enunciado: questao.enunciado.trim(),
        alternativas: questao.alternativas.map((alternativa) => ({
            id: alternativa.id,
            texto: alternativa.texto.trim(),
        })),
        respostaCorreta: questao.respostaCorreta,
        })),
    };
       

        console.log(
        "Payload enviado para criar atividade:",
        JSON.stringify(dadosAtividade, null, 2)
        );

    try {
        const resultado = await criarAtividade(dadosAtividade);

        console.log("Resposta da API ao criar atividade:", resultado);

        setMensagem(
        "A API recebeu a solicitação de criação da atividade."
        );
    } catch (error) {
        console.error("Erro ao criar atividade:", error);

        setErro(
        error instanceof Error
            ? `Não foi possível salvar a atividade: ${error.message}`
            : "Não foi possível salvar a atividade. Tente novamente."
        );
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
        <p>Monte um questionário para os alunos responderem.</p>
        

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
              min="0.01"
              step="0.01"
              value={formData.valorTotal}
              onChange={handleChange}
            />
          </div>
        </div>

        <section aria-labelledby="questoes-titulo">
          <h2 id="questoes-titulo">Questões</h2>

          {formData.questoes.map((questao, indice) => (
            <fieldset key={questao.id}>
              <legend>Questão {indice + 1}</legend>

              <div className="form-group">
                <Label htmlFor={`enunciado-${questao.id}`}>
                  Enunciado
                </Label>
                <Textarea
                  id={`enunciado-${questao.id}`}
                  value={questao.enunciado}
                  onChange={(event) =>
                    atualizarQuestao(
                      questao.id,
                      "enunciado",
                      event.target.value
                    )
                  }
                  placeholder="Digite a pergunta."
                />
              </div>

              <p>Alternativas</p>

              {questao.alternativas.map((alternativa) => (
                <div className="form-group" key={alternativa.id}>
                  <Label
                    htmlFor={`alt-${questao.id}-${alternativa.id}`}
                  >
                    Alternativa {alternativa.id}
                  </Label>
                  <Input
                    id={`alt-${questao.id}-${alternativa.id}`}
                    type="text"
                    value={alternativa.texto}
                    onChange={(event) =>
                      atualizarAlternativa(
                        questao.id,
                        alternativa.id,
                        event.target.value
                      )
                    }
                    placeholder={`Digite a alternativa ${alternativa.id}`}
                  />
                </div>
              ))}

              <div className="form-group">
                <Label htmlFor={`correta-${questao.id}`}>
                  Resposta correta (gabarito)
                </Label>
                <Select
                  id={`correta-${questao.id}`}
                  value={questao.respostaCorreta}
                  onChange={(event) =>
                    atualizarQuestao(
                      questao.id,
                      "respostaCorreta",
                      event.target.value
                    )
                  }
                >
                  {questao.alternativas.map((alternativa) => (
                    <option
                      key={alternativa.id}
                      value={alternativa.id}
                    >
                      Alternativa {alternativa.id}
                    </option>
                  ))}
                </Select>
              </div>

              <Button
                type="button"
                variant="danger"
                disabled={formData.questoes.length === 1}
                onClick={() => removerQuestao(questao.id)}
              >
                Remover questão
              </Button>
            </fieldset>
          ))}

          <Button type="button" onClick={adicionarQuestao}>
            Adicionar questão
          </Button>
        </section>

        <div className="form-actions">
          <Button
            type="button"
            variant="danger"
            onClick={handleLimpar}
          >
            Limpar formulário
          </Button>

          <Button type="submit">
            Validar atividade
          </Button>
        </div>
      </Form>
    </main>
  );
}

export default AtividadeProfessor;
