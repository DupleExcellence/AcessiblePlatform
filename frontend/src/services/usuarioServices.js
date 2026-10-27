
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function buscarNomeUsuario(usuarioId) {
  if (!usuarioId) return null;

  const referencia = doc(db, "usuarios", usuarioId);
  const resultado = await getDoc(referencia);

  if (!resultado.exists()) {
    return null;
  }

  const usuario = resultado.data();

  return (
    usuario.nomeCompleto ??
    usuario.nome ??
    usuario.displayName ??
    usuario.name ??
    null
  );
}
