import Input from "../components/Input/Input";
import Label from "../components/Label/Label";
import Form from "../components/Form/Form";
import Button from "../components/Button/Button";

function Cadastro() {
  function handleSubmit(event) {
    event.preventDefault();
    console.log("Formulário enviado");
  }

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Label>Nome</Label>
        <Input type="text" />

        <Label>E-mail</Label>
        <Input type="email" />

        <Button type="submit">
          Enviar
        </Button>
      </Form>
    </div>
  );
}

export default Cadastro;