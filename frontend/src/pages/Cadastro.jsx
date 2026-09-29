import Input from "../components/Input/Input";
import Label from "../components/Label/Label";
import Form from "../components/Form/Form";
import Button from "../components/Button/Button";
import Formgroup from "../components/Formgroup/Formgroup";
import Select from "../components/Select/Select";

function Cadastro() {
  function handleSubmit(event) {
    event.preventDefault();
    console.log("Formulário enviado");
  }

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Label>Nome</Label>
        <Input
          label="Nome"
          name="nome"
          placeholder="Digite seu nome"
        />

        <Input
          label="Campo com erro"
          name="erro"
          error="Este campo é obrigatório."
        />

        <Input
          label="Campo válido"
          name="sucesso"
          success
        />

        <Input
          label="Campo desabilitado"
          name="disabled"
          disabled
        />
        <Label>E-mail</Label>
        <Input type="email" />

        <Button type="submit">
          Enviar
        </Button>

        <Formgroup label="Nome">
            <Input />
        </Formgroup>

       
        


      </Form>

      <Select
        label="Perfil"
        name="perfil"
        value=""
         onChange={() => {}}
         options={[
          { value: "aluno", label: "Aluno" },
          { value: "professor", label: "Professor" },
          { value: "admin", label: "Administrador" },
        ]}
        />
        <Select
          label="Campo com erro"
          name="erro"
          error="Selecione uma opção."
          options={[
            { value: "1", label: "Opção 1" },
            { value: "2", label: "Opção 2" },
          ]}
        />
          <Select
            label="Campo válido"
            name="sucesso"
            success
            options={[
              { value: "1", label: "Opção 1" },
              { value: "2", label: "Opção 2" },
            ]}
          />
          <Select
            label="Campo desabilitado"
            name="disabled"
            disabled
            options={[
              { value: "1", label: "Opção 1" },
            ]}
          />
    </div>
  );
}

export default Cadastro;