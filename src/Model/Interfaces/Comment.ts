export interface Comment {
    id: number;             // Identificador único del comentario
    reviewId: number;       // ID de la reseña a la que pertenece el comentario
    usuarioId: number;      // ID del usuario que escribió el comentario
    contenido: string;      // Contenido del comentario
    fecha: Date;            // Fecha en la que se escribió el comentario
  }