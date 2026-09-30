import FormGroup from "../components/Formgroup/Formgroup.jsx";
import Label from "../components/Label/Label"
import Input from "../components/Input/Input.jsx";
import FormMessage from "../components/Form/FormMessage.jsx";
import Radio from "../components/Radio/Radio.jsx";
import Textarea from "../components/Textarea/Textarea.jsx";



function Home() {
  return (
    <main>
     <FormGroup>
      <Label htmlFor="email">E-mail</Label>

      <Input
        id="email"
        type="email"
        error={true}
      />

      <FormMessage type="error">
        Informe um e-mail válido.
      </FormMessage>
    </FormGroup>

      <Radio
      name="perfil"
      value="aluno"
      error
      >
        Aluno
      </Radio>


      <Radio
        name="perfil"
        value="aluno"
        success
      >
        Aluno
      </Radio>


      <Textarea
        value={""}
        onChange={""}
        error
      />


      <Textarea
        value={""}
        onChange={""}
        success
      />


      

        <div>
          <Radio
            name="perfil"
            value="aluno"
            label="Aluno"
          />
          Aluno 
          <Radio/>
          
          <Radio
            name="perfil"
            value="professor"
            label="Professor"
          />
        </div>
      
        

    </main>
  );
}




export default Home;