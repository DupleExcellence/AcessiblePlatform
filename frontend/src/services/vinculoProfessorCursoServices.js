
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import { db } from "./firebase";
import { buscarCursos } from "./cursoServices";

/**
 * Busca os professores cadastrados no Firestore
 * e consulta seus respectivos dados na coleção usuarios.
 */
export async function buscarProfessores() {
  const snapshot = await getDocs(
    collection(db, "professores")
  );

  const professores = await Promise.all(
    snapshot.docs.map(async (documento) => {
      const dados = documento.data();

      let nome = dados.nome || "";
      let email = dados.email || "";

      const usuarioRef = dados.usuarioId;

      if (usuarioRef && typeof usuarioRef.path === "string") {
        const usuarioSnapshot = await getDoc(usuarioRef);

        if (usuarioSnapshot.exists()) {
          const usuario = usuarioSnapshot.data();

          nome =
            usuario.nome ||
            usuario.nomeCompleto ||
            nome;

          email = usuario.email || email;
        }
      } else if (typeof usuarioRef === "string" && usuarioRef) {
        // Compatibilidade caso usuarioId esteja salvo como string.
        const usuarioSnapshot = await getDoc(
          doc(db, "usuarios", usuarioRef)
        );

        if (usuarioSnapshot.exists()) {
          const usuario = usuarioSnapshot.data();

          nome =
            usuario.nome ||
            usuario.nomeCompleto ||
            nome;

          email = usuario.email || email;
        }
      }

      return {
        id: documento.id,
        nome: nome || "Professor sem nome",
        email,
        disciplina: dados.disciplina || "",
      };
    })
  );

  return professores.sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR")
  );
}

/**
 * Busca os cursos e acrescenta os professores vinculados
 * pelo campo professorIds.
 */
export async function buscarVinculosProfessorCurso() {
  const [cursos, professores] = await Promise.all([
    buscarCursos(),
    buscarProfessores(),
  ]);

  return cursos.map((curso) => {
    const professorIds = Array.isArray(curso.professorIds)
      ? curso.professorIds
      : [];

    const professoresVinculados = professores.filter(
      (professor) => professorIds.includes(professor.id)
    );

    return {
      ...curso,
      professorIds,
      professores: professoresVinculados,
    };
  });
}

/**
 * Vincula um professor a um curso.
 * arrayUnion evita adicionar o mesmo ID duas vezes
 * e preserva os demais professores associados.
 */
export async function vincularProfessorCurso(
  cursoId,
  professorId
) {
  if (!cursoId || !professorId) {
    throw new Error(
      "Selecione um curso e um professor."
    );
  }

  // Confirma que o curso existe.
  const cursoRef = doc(db, "cursos", cursoId);
  const cursoSnapshot = await getDoc(cursoRef);

  if (!cursoSnapshot.exists()) {
    throw new Error("O curso selecionado não foi encontrado.");
  }

  // Confirma que o professor existe.
  const professorRef = doc(
    db,
    "professores",
    professorId
  );

  const professorSnapshot = await getDoc(professorRef);

  if (!professorSnapshot.exists()) {
    throw new Error(
      "O professor selecionado não foi encontrado."
    );
  }

  const curso = cursoSnapshot.data();
  const professorIds = Array.isArray(curso.professorIds)
    ? curso.professorIds
    : [];

  if (professorIds.includes(professorId)) {
    throw new Error(
      "Este professor já está vinculado ao curso."
    );
  }

  await updateDoc(cursoRef, {
    professorIds: arrayUnion(professorId),
  });

  return {
    cursoId,
    professorId,
    vinculado: true,
  };
}

/**
 * Remove um professor de um curso sem afetar
 * os outros professores vinculados.
 */
export async function desvincularProfessorCurso(
  cursoId,
  professorId
) {
  if (!cursoId || !professorId) {
    throw new Error(
      "Curso e professor são obrigatórios."
    );
  }

  const cursoRef = doc(db, "cursos", cursoId);
  const cursoSnapshot = await getDoc(cursoRef);

  if (!cursoSnapshot.exists()) {
    throw new Error("O curso não foi encontrado.");
  }

  const curso = cursoSnapshot.data();
  const professorIds = Array.isArray(curso.professorIds)
    ? curso.professorIds
    : [];

  if (!professorIds.includes(professorId)) {
    throw new Error(
      "Este professor não está vinculado ao curso."
    );
  }

  await updateDoc(cursoRef, {
    professorIds: arrayRemove(professorId),
  });

  return {
    cursoId,
    professorId,
    desvinculado: true,
  };
}
