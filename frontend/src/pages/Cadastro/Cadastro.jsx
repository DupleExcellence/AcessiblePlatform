import Form from "../../components/Form/Form";
import Label from "../../components/Label/Label";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Radio from "../../components/Radio/Radio";
import "../Cadastro/Cadastro.css"
import Formgroup from "../../components/Formgroup/Formgroup";

function Cadastro() {
  return (
    <main className="cadastro-page">
      <section className="cadastro-container">

        
       <header className="header-cadastro">
          <h1 className="cadastro-title">Cadastro</h1>
          <p className="cadastro-subtitle">Preencha os dados para criar a conta</p>
        </header>

        {/* Formulário */}
        <Form className="cadastro-form">

          {/* Nome */}
          <Formgroup>
            <Label htmlFor="nome">Nome</Label>
            <Input
              type="text"
              id="nome"
              name="nome"
              placeholder="Insira o nome"
              required
            />
          </Formgroup>

          {/* E-mail */}
          <Formgroup>
            <Label htmlFor="email">E-mail</Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Insira o e-mail"
              required
            />
          </Formgroup>

          {/* Senha */}
          <Formgroup>
            <Label htmlFor="senha">Senha</Label>

            <div className="input-password">
              <Input
                type="password"
                id="senha"
                name="senha"
                placeholder="Insira a senha"
                required
              />

              <Button
                type="button"
                className="toggle-password"
                aria-label="Mostrar senha"
              >
                👁
              </Button>
            </div>
          </Formgroup>

          {/* Data de nascimento */}
          <Formgroup>
            <Label htmlFor="dataNascimento">
              Data de nascimento
            </Label>

            <Input
              type="date"
              id="dataNascimento"
              name="dataNascimento"
              required
            />
          </Formgroup>

          {/* Telefone */}
          <Formgroup>
            <Label htmlFor="telefone">Telefone</Label>

            <Input
              type="tel"
              id="telefone"
              name="telefone"
              placeholder="Insira o telefone"
            />
          </Formgroup>

          <div className="login-perfis">
          <Radio
            id="aluno"
            name="perfil"
            value="aluno"
          >
            Aluno
          </Radio>

          <Radio
            id="professor"
            name="perfil"
            value="professor"
          >
            Professor
          </Radio>

          
        </div>
          

          {/* Botão */}
          <button
            type="submit" variant="sucess"
            className="btn-cadastrar" 
          >
            Cadastrar
          </button>

        </Form>

      

      </section>
    </main>
  );
}

export default Cadastro;