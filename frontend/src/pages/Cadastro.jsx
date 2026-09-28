import Input from "../components/Input/Input";
import Label from "../components/Label/Label";

function Cadastro() {
  return (
    <div>
        <Label htmlFor="nome" required>
          Nome
        </Label>

          <input
            id="nome"
            type="text"
            placeholder="Digite seu nome"
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