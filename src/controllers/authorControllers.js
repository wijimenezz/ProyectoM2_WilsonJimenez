
import { createAuthorService, deleteauthorService, getAllAuthorsService, updateAuthorService, } from "../Services/autorServices.js";

export const getAuthors =  async (req , res) =>{
    try{
        const authors = await getAllAuthorsService ();
        res.json(authors);
    
    }
    catch (error){
        console.error(error);
        res.status(500).json({error: "Error al obtener autores"});
    }

    
};

export const getAuthorById =async (req , res, next) =>{
    
    try{
        
        res.json(req.author);      
        
       
    }
   catch(error){
    next(error);
   }
};

export const createAuthor =async (req , res, next) =>{
    
    try{
        const newAuthor =  await createAuthorService(req.body);
        res.status(201).json({mensaje: "Autor Creado con exito",
            newAuthor
        } )
    }
            catch(error){
         next(error)
    }
};

export const updateAuthor = async (req , res, next) =>{
   
  try{
   const updated = await updateAuthorService(req.params.id, req.body);
   res.json({mensaje: "Autor Actualizado con Exito",
    updated
   })
    
  }

  catch(error){
    next(error)
  }

};

export const deleteAuthor = async (req , res, next) =>{
    
    try{
        await deleteauthorService(req.params.id);
        res.json({mensaje:"autor eliminado existosamente"})
                

    }
    catch(error){
        next(error)
        
    }
    
};