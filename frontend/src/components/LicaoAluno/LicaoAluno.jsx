import React, { useState } from "react";
import Select from "../Select/Select.jsx";
import Input from "../Input/Input.jsx";
import Button from "../Button/Button.jsx";
import Label from "../Label/Label.jsx";
import Textarea from "../Textarea/Textarea.jsx"
import Form from "../Form/Form.jsx"
import "../LicaoAluno/LicaoAluno.css"

function LicaoAluno() {
  const [formData, setFormData] = useState({
    curso: "",
    ordem: "1",
    titulo: "",
    videoUrl: "",
    conteudo: "",
    duracao: "",
    gabarito: "",
    arquivo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      arquivo: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Dados da lição:", formData);

    // Aqui depois você pode conectar com o backend
  };

  const handleCancel = () => {
    setFormData({
      curso: "",
      ordem: "1",
      titulo: "",
      videoUrl: "",
      conteudo: "",
      duracao: "",
      gabarito: "",
      arquivo: null,
    });
  };

  return (
    <div className="criar-licao-page">

      {/* Cabeçalho */}
      <header className="criar-licao-header">

        <div className="logo-area">
          <div className="logo-icon">◆</div>
          <span>Aprender</span>
        </div>

        <div className="header-icons">
          <Button className="header-button" aria-label="Notificações">
            🔔
          </Button>

          <Button className="profile-button" aria-label="Perfil">
            👤
          </Button>
        </div>

      </header>

      {/* Conteúdo */}
      <main className="criar-licao-container">

        <h1>Criar Lição</h1>

        <Form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* Curso */}
            <div className="form-group curso">
              <Label htmlFor="curso">Curso</Label>

              <Select
                id="curso"
                name="curso"
                value={formData.curso}
                onChange={handleChange}
              >
                <option value="">Selecione o curso</option>
                <option value="informatica">Informática Básica</option>
                <option value="word">Microsoft Word</option>
                <option value="excel">Microsoft Excel</option>
                <option value="internet">Internet</option>
              </Select>
            </div>

            {/* Ordem */}
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

            {/* Título */}
            <div className="form-group titulo">
              <Label htmlFor="titulo">Título da lição</Label>

              <Input
                type="text"
                id="titulo"
                name="titulo"
                placeholder="Ex.: Introdução ao HTML"
                value={formData.titulo}
                onChange={handleChange}
              />
            </div>

            {/* Vídeo */}
            <div className="form-group video">
              <Label htmlFor="videoUrl">Vídeo URL</Label>

              <Input
                type="url"
                id="videoUrl"
                name="videoUrl"
                placeholder="https://..."
                value={formData.videoUrl}
                onChange={handleChange}
              />
            </div>

            {/* Conteúdo */}
            <div className="form-group conteudo">
              <Label htmlFor="conteudo">Conteúdo</Label>

              <Textarea
                id="conteudo"
                name="conteudo"
                placeholder="Descreva o conteúdo da lição..."
                value={formData.conteudo}
                onChange={handleChange}
              />
            </div>

            {/* Duração */}
            <div className="form-group duracao">
              <Label htmlFor="duracao">Duração</Label>

              <Input
                type="text"
                id="duracao"
                name="duracao"
                placeholder="Ex.: 10 min"
                value={formData.duracao}
                onChange={handleChange}
              />
            </div>

            {/* Material de apoio */}
            <div className="form-group material">
              <Label>Material de apoio</Label>

              <Label htmlFor="arquivo" className="upload-box">

                <span className="upload-icon">📁</span>

                <span>
                  {formData.arquivo
                    ? formData.arquivo.name
                    : "Adicionar arquivo"}
                </span>

              </Label>

              <Input
                type="file"
                id="arquivo"
                onChange={handleFileChange}
                hidden
                accept=".pdf,.doc,.docx,.ppt,.pptx"
              />

              <small>Formatos: PDF, DOC, PPT, etc.</small>
            </div>

            {/* Gabarito */}
            <div className="form-group gabarito">
              <Label htmlFor="gabarito">Gabarito</Label>

              <Textarea
                id="gabarito"
                name="gabarito"
                placeholder="Digite o gabarito da lição..."
                value={formData.gabarito}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* Botões */}
          <div className="form-actions">

            <Button
              type="button"
              variant="danger"
              onClick={handleCancel}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              className="btn-salvar"
            >
              Salvar
            </Button>

          </div>

        </Form>

      </main>

    </div>
  );
}

export default LicaoAluno;