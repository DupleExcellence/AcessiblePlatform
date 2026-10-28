
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
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

export async function atualizarPerfilUsuario(usuarioId, dados) {
  if (!usuarioId) {
    throw new Error("Usuário não autenticado.");
  }

  const atualizacao = {};

  if (typeof dados.nome === "string") {
    if (!dados.nome.trim()) {
      throw new Error("Informe o nome.");
    }

    atualizacao.nome = dados.nome.trim();
  }

  if (typeof dados.telefone === "string") {
    atualizacao.telefone = dados.telefone.trim();
  }

  if (typeof dados.dataNascimento === "string") {
    atualizacao.dataNascimento = dados.dataNascimento.trim();
  }

  if (Object.keys(atualizacao).length === 0) {
    throw new Error("Nenhum dado para atualizar.");
  }

  atualizacao.atualizadoEm = serverTimestamp();

  const referencia = doc(db, "usuarios", usuarioId);

  await updateDoc(referencia, atualizacao);

  const resultado = await getDoc(referencia);

  return resultado.data();
}




export async function buscarPerfilUsuario(usuarioId) {
  if (!usuarioId) {
    throw new Error("O ID do usuário é obrigatório.");
  }

  const referencia = doc(db, "usuarios", usuarioId);
  const resultado = await getDoc(referencia);

  if (!resultado.exists()) {
    throw new Error(
      "Perfil não encontrado no cadastro do usuário."
    );
  }

  return {
    id: resultado.id,
    ...resultado.data(),
  };
}
