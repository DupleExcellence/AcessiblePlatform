import { useEffect } from "react";
import React from "react";
import Select from "../Select/Select.jsx";
import Input from "../Input/Input.jsx";
import Button from "../Button/Button.jsx";
import Label from "../Label/Label.jsx";
import Textarea from "../Textarea/Textarea.jsx"
import Form from "../Form/Form.jsx"
import "../LicaoProfessor/LicaoProfessor.css"
import { useState } from "react";
import { enviarArquivo } from "../../services/arquivoServices";
import { buscarCursos } from "../../services/cursoServices";
import {
  buscarLicoes,
  criarLicao,
} from "../../services/licaoServices";
import { Link } from "react-router-dom";

function LicaoProfessor() {
  
const formularioInicial = {
  cursoId: "",
  ordem: "1",
  titulo: "",
  descricao: "",
  conteudo: "",
  videoUrl: "",
  duracao: "",
  gabarito: "",
  arquivo: null,
 };


  const [formData, setFormData] = useState(formularioInicial);
  const [cursos, setCursos] = useState([]);
  const [licoes, setLicoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  

 async function carregarDados() {
  setCarregando(true);
  setErro("");

  try {
    const listaCursos = await buscarCursos();
    console.log("Cursos retornados pela API:", listaCursos);

    if (!Array.isArray(listaCursos)) {
      throw new Error("A API não retornou uma lista válida de cursos.");
    }

    setCursos(listaCursos);
  } catch (error) {
    console.error("Erro ao carregar cursos:", error);
    setCursos([]);
    setErro(`Erro ao carregar cursos: ${error.message}`);
  }

  try {
    const listaLicoes = await buscarLicoes();
    setLicoes(listaLicoes);
  } catch (error) {
    console.error("Erro ao carregar lições:", error);
    setLicoes([]);

    setErro((anterior) =>
      [anterior, `Erro ao carregar lições: ${error.message}`]
        .filter(Boolean)
        .join(" | ")
    );
  } finally {
    setCarregando(false);
  }
 }

 


  useEffect(() => {
    carregarDados();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

 
  async function handleSubmit(event) {
    event.preventDefault();
    setErro("");
    setMensagem("");

    if (
      !formData.cursoId ||
      !formData.titulo.trim() ||
      !formData.conteudo.trim()
    ) {
      setErro("Selecione um curso e preencha título e conteúdo.");
      return;
    }

    const ordem = Number(formData.ordem);

    if (!Number.isInteger(ordem) || ordem < 1) {
      setErro("A ordem deve ser um número inteiro maior que zero.");
      return;
    }

    setSalvando(true);

    try {
      await criarLicao({
        cursoId: formData.cursoId,
        titulo: formData.titulo.trim(),
        descricao: formData.descricao.trim(),
        conteudo: formData.conteudo.trim(),
        ordem,
      });

      setMensagem("Lição cadastrada com sucesso!");
      setFormData(formularioInicial);

      const listaLicoes = await buscarLicoes();
      setLicoes(listaLicoes);
    } catch (error) {
      console.error("Erro ao criar lição:", error);
      setErro(error.message || "Não foi possível cadastrar a lição.");
    } finally {
      setSalvando(false);
    }
  }


 

  function handleCancel() {
    setFormData(formularioInicial);
    setErro("");
    setMensagem("");
  }
 return (
    <div className="criar-licao-page">
      <header className="criar-licao-header">
        <div className="logo-area">
          <div className="logo-icon">◆</div>
        </div>
      </header>

      <main className="criar-licao-container">
        <h1>Criar lição</h1>

        {erro && <p role="alert">{erro}</p>}
        {mensagem && <p role="status">{mensagem}</p>}

        <Form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group curso">
              <Label htmlFor="cursoId">Curso</Label>
              {!carregando && cursos.length === 0 && (
                <p role="status">
                  Nenhum curso carregado. Confira a mensagem de erro acima.
                </p>
              )}

             <Select
                id="cursoId"
                name="cursoId"
                value={formData.cursoId}
                onChange={handleChange}
              >
                <option value="">Selecione o curso</option>

                {cursos.map((curso) => (
                  <option key={curso.id} value={curso.id}>
                    {curso.titulo || curso.nome || curso.id}
                  </option>
                ))}
              </Select>
            </div>

            <div className="form-group ordem">
              <Label htmlFor="ordem">Ordem</Label>
              <Input
                type="number"
                id="ordem"
                name="ordem"
                min="1"
                value={formData.ordem}
                onChange={handleChange}
              />
            </div>

            <div className="form-group titulo">
              <Label htmlFor="titulo">Título da lição</Label>
              <Input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ex.: Introdução ao HTML"
              />
            </div>

            <div className="form-group descricao">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Resumo da lição..."
              />
            </div>

            <div className="form-group conteudo">
              <Label htmlFor="conteudo">Conteúdo</Label>
              <Textarea
                id="conteudo"
                name="conteudo"
                value={formData.conteudo}
                onChange={handleChange}
                placeholder="Digite o conteúdo da lição..."
              />
            </div>
            
          <div className="form-group">
            <Label htmlFor="videoUrl">URL do vídeo</Label>
            <Input
              type="url"
              id="videoUrl"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <Label htmlFor="duracao">Duração</Label>
            <Input
              type="number"
              id="duracao"
              name="duracao"
              min="0"
              value={formData.duracao}
              onChange={handleChange}
              placeholder="Duração conforme o formato da API"
            />
          </div>

          <div className="form-group">
            <Label htmlFor="gabarito">Gabarito</Label>
            <Textarea
              id="gabarito"
              name="gabarito"
              value={formData.gabarito}
              onChange={handleChange}
              placeholder="Informe o gabarito, se aplicável..."
            />
          </div>

          
            
          <div className="form-group">
            <Label htmlFor="arquivo">Arquivo da lição</Label>
            <Input
              type="file"
              id="arquivo"
              name="arquivo"
              onChange={(event) => {
                const arquivoSelecionado = event.target.files?.[0] || null;

                setFormData((anterior) => ({
                  ...anterior,
                  arquivo: arquivoSelecionado,
                }));
              }}
            />
          </div>

        </div>

          

          <div className="form-actions">
            <Button
              type="button"
              variant="danger"
              onClick={handleCancel}
              disabled={salvando}
            >
              Limpar
            </Button>

            <Button type="submit" disabled={salvando || carregando}>
              {salvando ? "Salvando..." : "Salvar lição"}
            </Button>
          </div>
        </Form>

      
         
      
    {/* MENU INFERIOR */}
    <nav className="bottom-menu" aria-label="Menu principal">
      <Link to="/homeProfessor" className="menu-item">
        <span aria-hidden="true">⌂</span>
        <small>Início</small>
      </Link>

      <Link
        to="/licaoProfessor"
        className="menu-item active"
        aria-current="page"
      >
        <span aria-hidden="true">▣</span>
        <small>Lições</small>
      </Link>

      <Link to="/cursos" className="menu-item">
        <span aria-hidden="true">▤</span>
        <small>Cursos</small>
      </Link>

     

      <Link to="/perfilProfessor" className="menu-item">
        <span aria-hidden="true">♙</span>
        <small>Perfil</small>
      </Link>
    </nav>

    
    

    </main>

  </div>
  );

}
  export default LicaoProfessor;