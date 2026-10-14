import React from "react";
import "./Login.css";

import Input from "../../components/Input/Input";
import Label from "../../components/Label/Label";
import Radio from "../../components/Radio/Radio";
import Button from "../../components/Button/Button";
import Formgroup from "../../components/Formgroup/Formgroup";

function Login() {
  return (
    <main className="login">
      <section className="login-card">
        <div className="header-login">
         <h1 className="login-title">Bem vindo(a) de volta</h1>
         <h2 className="login-subtitle">Faça login para continuar</h2>

        </div>
        
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

          <Radio
            id="administrador"
            name="perfil"
            value="administrador"
          >
            Administrador
          </Radio>
        </div>

    <form className="login-form">
        <Formgroup>
            <Label htmlFor="email">E-mail</Label>
            <Input
            id="email"
            type="email"
            />
        </Formgroup>

        <Formgroup>
            <Label htmlFor="senha">Senha</Label>
            <Input
            id="senha"
            type="password"
            />
        </Formgroup>

        <Button
            type="button"
            variant="success"
        >
            Entrar
        </Button>

        <button
            type="button"
            className="login-recover"
        >
            Recuperar acesso
        </button>
    </form>
    
      </section>
    </main>
  );
}

export default Login;