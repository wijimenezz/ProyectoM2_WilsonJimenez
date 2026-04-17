import { getPostByIdService } from "../Services/postsServices.js";


export const validatePost =async (req , res, next) =>{

        const post= await getPostByIdService(req.params.id);
        if (!post) {
    return res.status(404).json({ mensaje: "Post no encontrado" });
  }

  req.post = post;
  next();
};

export const validateDataPost = (req, res, next) => {
  const { title, content, author_id } = req.body;

  if (!title || title.trim().length < 3) {
    return res.status(400).json({
      mensaje: "El Titulo es obligatorio y debe tener al menos 3 caracteres"
    });
  }

  if (!content || content.trim().length < 10) {
    return res.status(400).json({
      mensaje: "El contenido del Post debe tener al menos 10 caracteres"
    });
  }
  if (!author_id || isNaN(Number(author_id))) {
    return res.status(400).json({
      mensaje: "author_id debe ser un número válido"
    });
}


  next();
};

export const validatePostsbyAuthorId = (req, res, next) => {

    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ 
        
            mensaje: "El ID del autor es requerido y debe ser un número válido." 
        });
    }

    
    next();
}