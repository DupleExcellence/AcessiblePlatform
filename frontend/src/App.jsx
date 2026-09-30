import { useState } from "react";
import Textarea from "./components/Textarea/Textarea";

function App() {
  const [texto, setTexto] = useState("");

  return (
    <div style={{ padding: "40px", maxWidth: "600px" }}>
      <h2>Teste do Textarea</h2>

      <h3>Normal / Focus / Hover</h3>
      <Textarea
        id="normal"
        name="normal"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Digite alguma coisa..."
      />

      <h3>Disabled</h3>
      <Textarea
        id="disabled"
        name="disabled"
        value="Campo desabilitado"
        disabled
      />

      <h3>Error</h3>
      <Textarea
        id="error"
        name="error"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Campo com erro"
        error
      />

      <h3>Success</h3>
      <Textarea
        id="success"
        name="success"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Campo com sucesso"
        success
      />
    </div>
  );
}

export default App;