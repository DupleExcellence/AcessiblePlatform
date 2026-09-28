import Input from "../components/Input/Input";
import Label from "../components/Label/Label";
import Select from "../components/Select/Select";
import Checkbox from "../components/Checkbox/Checkbox";

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
          <div>
            <Label htmlFor="nivel" required>
              Nível
            </Label>

            <Select id="nivel" name="nivel" required>
              <option value="">Selecione uma opção</option>
              <option value="iniciante">Iniciante</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
            </Select>
         </div>
  
      

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

      

   
     
        <Checkbox
          id="termos"
          name="termos"
          required
        >
          Aceito os termos de uso
        </Checkbox>
      






    </div>
  );
}

export default Cadastro;