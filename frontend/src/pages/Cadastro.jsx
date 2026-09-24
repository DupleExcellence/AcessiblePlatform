import Input from "../components/Input/Input";

function Cadastro() {
  return (
    <div>
      <Input
        label="Nome completo"
        placeholder="Digite seu nome"
        required
      />

      <Input
        label="E-mail"
        type="email"
        placeholder="Digite seu e-mail"
        required
      />

      <Input
        label="Senha"
        type="password"
        placeholder="Digite sua senha"
        required
      />

      <Input
        label="Usuário"
        placeholder="Digite seu usuário"
        error="Este usuário já está cadastrado."
      />
    </div>
  );
}

export default Cadastro;