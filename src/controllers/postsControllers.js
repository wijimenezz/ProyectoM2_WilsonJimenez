import { createPostService, deletePostService, getAllPostsService, getPostByAuthorIdService } from "../Services/postsServices.js";

export const getPosts =  async (req , res, next) =>{
    try{
        const posts = await getAllPostsService ();
        res.json(posts);
    
    }
    catch (error){
        next(error);
    }

    
};

export const getPostById =async (req , res, next) =>{
    
    try{
        
        res.json(req.post);      
        
       
    }
   catch(error){
    next(error);
   }
};

export const getPostByAuthorID = async (req, res, next) =>{
    try{
        const {authorId} = req.params;
    const posts = await getPostByAuthorIdService(authorId);
    if (posts.length === 0){
        return res.status(404).json({
            mensaje: "No se encontraron posts para ese autor"
        })
    }
    res.status(200).json({
        mensaje:"Los posts se encontraron exitosamente",
        posts
    })
    }
    catch(error){
        next(error)

    }
}

export const createPost =async (req , res, next) =>{
    
    try{
        const newPost =  await createPostService(req.body);
        res.status(201).json({mensaje: "Post Creado con exito",
            newPost
        } )
    }
            catch(error){
         next(error)
    }
};

export const updatePost = async (req , res, next) =>{
   
  try{
   const updated = await updatePostService(req.params.id, req.body);
   res.json({mensaje: "Post Actualizado con Exito",
    updated
   })
    
  }

  catch(error){
    next(error)
  }

};

export const deletePost = async (req , res, next) =>{
    
    try{
        await deletePostService(req.params.id);
        res.json({mensaje:"Post eliminado existosamente"})
                

    }
    catch(error){
        next(error)
        
    }
    
};