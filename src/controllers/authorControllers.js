import { pool } from "../db.js";

export const getAuthors =  async (req , res) =>{
    try{
    const { rows }= await pool.query("SELECT * FROM authors");
    res.json(rows)
    }
    catch (error){
        console.error(error);
        res.status(500).json({error: "Error al obtener autores"});
    }

    
};

export const getAuthorById =async (req , res) =>{
    const {id} = req.params;
    try{
        const { rows } = await pool.query('SELECT * FROM authors WHERE id= $1',[id]);
        
        if (rows.length === 0){
            return res.status(404).json({mensaje: "Autor no encontrado"});
        }
        res.json(rows[0]);
    }
   catch(error){
    console.error(error);
    res.status(500).json({error: "Error al obtener un usuario"})
   }
};

export const createAuthor =async (req , res) =>{
    const datos = req.body;
    try{
         const { rows } = await pool.query("INSERT INTO authors (name, email, bio) VALUES ($1,$2,$3) RETURNING *", 
            [datos.name, datos.email, datos.bio]
         );
         res.status(201).json({
            mensaje: "Autor creado con exito",
            data: rows[0]
         
         })
            
    }
    catch(error){
         console.error(error);
        res.status(500).json({mensaje: "Error al Agregar un autor"});
    }
};

export const updateAuthor = async (req , res) =>{
   const {id} = req.params;
   const datos = req.body;
  try{
   const { rows } = await pool.query("UPDATE authors SET name = $1, email = $2, bio = $3 WHERE id = $4 RETURNING *", [datos.name, datos.email, datos.bio, id])

   if (rows.length === 0) {
    return res.status(404).json({mensaje: "autor no encontrado"});
    
   };
    res.json(rows[0]);

  }
  catch(error){
    console.error(error);
    res.status(500).json({mensaje: "error al actualizar author"})
  }

};

export const deleteAuthor = async (req , res) =>{
    const {id} = req.params;
    try{
       const result = await pool.query('DELETE FROM authors WHERE id = $1',[id]);
       
        if (result.rowCount === 0){
            return res.status(404).json({mensaje: "autor no encontrado"});
         }
         res.json({mensaje:"autor eliminado existosamente"})
                

    }
    catch(error){
        res.status(500).json({mensaje: "error al eliminar un autor"})
    }
    
};