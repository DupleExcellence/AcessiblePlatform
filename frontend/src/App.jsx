

import Feedback from "./components/Feedback/Feedback";

function App() {
  return (
    <div>
     <h2>Exemplo de Feedback</h2>

      <Feedback
        type="success"
        title="Sucesso"
        message="A lição foi salva com sucesso!"
        onClose={() => console.log("Fechar sucesso")}
      />

      <Feedback
        type="warning"
        title="Atenção"
        message="Verifique todos os campos foram preenchidos corretamente."
        onClose={() => console.log("Fechar atenção")}
      />

      <Feedback
        type="error"
        title="Erro"
        message="Ocorreu um erro ao salvar a lição. Tente novamente."
        onClose={() => console.log("Fechar erro")}
      />
    </div>  
  )
}

export default App;