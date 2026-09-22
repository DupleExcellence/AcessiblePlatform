import Button from "../components/Button/Button.jsx"


function Home() {
  return (
    <main>
     <h1>O primeiro Botão</h1>

      <Button onClick={() => alert("Funcionou!")}>
        Salvar
      </Button>
    </main>
  );
}




export default Home;