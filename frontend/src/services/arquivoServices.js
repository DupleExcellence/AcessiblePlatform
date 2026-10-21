
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { storage, auth } from "./firebase";

export async function enviarArquivo(arquivo) {
  if (!arquivo) {
    throw new Error("Selecione um arquivo para enviar.");
  }

  if (!auth.currentUser) {
    throw new Error("Faça login antes de enviar um arquivo.");
  }

  const nomeSeguro = arquivo.name.replace(
    /[^a-zA-Z0-9._-]/g,
    "_"
  );

  const caminho = `licoes/${auth.currentUser.uid}/${Date.now()}_${nomeSeguro}`;
  const referencia = ref(storage, caminho);

  const resultado = await uploadBytes(referencia, arquivo, {
    contentType: arquivo.type || "application/octet-stream",
  });

  return getDownloadURL(resultado.ref);
}
