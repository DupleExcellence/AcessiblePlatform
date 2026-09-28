import Input from "../components/Input/Input";
import Label from "../components/Label/Label";
import Select from "../components/Select/Select";
import Checkbox from "../components/Checkbox/Checkbox";
import Radio from "../components/Radio/Radio";
import Textarea from "../components/Textarea/Textarea";

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

          <Radio
        id="facil"
        name="dificuldade"
        value="facil"
      >
        Fácil
      </Radio>

      <Radio
        id="medio"
        name="dificuldade"
        value="medio"
      >
        Médio
      </Radio>

      <Radio
        id="dificil"
        name="dificuldade"
        value="dificil"
      >
        Difícil
      </Radio>

   
     
        <Checkbox
          id="termos"
          name="termos"
          required
        >
          Aceito os termos de uso
        </Checkbox>
      

    <div>
      <Label htmlFor="resposta" required>
        Sua resposta
      </Label>

      <Textarea
        id="resposta"
        name="resposta"
        placeholder="Digite sua resposta..."
        rows={5}
        required
      />
    </div>




    </div>
  );
}

export default Cadastro;