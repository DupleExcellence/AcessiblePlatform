import FormGroup from "../components/Formgroup/Formgroup.jsx";
import Label from "../components/Label/Label"
import Input from "../components/Input/Input.jsx";
import FormMessage from "../components/Form/FormMessage.jsx";


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
    </main>
  );
}




export default Home;