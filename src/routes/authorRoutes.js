import { Router } from "express";
import {pool} from "../db.js"
const router = Router();


router.get ("/", async (req , res) =>{
    try{
    const { rows }= await pool.query("SELECT * FROM authors");
    res.json(rows)
    }
    catch (error){
        console.error(error);
        res.status(500).json({error: "Error al obtener autores"});
    }

    
});

router.get ("/:id", async (req , res) =>{
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
});


router.post ("/", async (req , res) =>{
    const datos = req.body;
    try{
         const { rows } = await pool.query("INSERT INTO authors (name, email, bio) VALUES ($1,$2,$3) RETURNING *", 
            [datos.name, datos.email, datos.bio]
         );
         res.json(rows[0])
    }
    catch(error){
         console.error(error);
        res.status(500).json({mensaje: "Error al Agregar un autor"});
    }
});


router.put ("/:id", async (req , res) =>{
   const {id} = req.params;
   const datos = req.body;
  try{
   const { rows } = await pool.query("UPDATE authors SET name = $1, email = $2, bio = $3 WHERE id = $4 RETURNING *", [datos.name, datos.email, datos.bio, id])

   if (rows.length === 0) {
    return res.status(404).json({mensaje: "error al actualizar el author"});
    
   };
    res.json(rows[0]);

  }
  catch(error){
    console.error(error);
    res.status(500).json({mensaje: "error al actualizar author"})
  }

});


router.delete ("/:id", async (req , res) =>{
    const {id} = req.params;
    try{
        await pool.query('DELETE FROM authors WHERE id = $1',[id]);
        res.json({mensaje:"autor eliminado existosamente"});
        res.json(rows);
        if (rows.length === 0){
            return res.status(404).json({mensaje: "autor no encontrado"});

        }

    }
    catch(error){
        res.status(500).json({mensaje: "error al eliminar un autor"})
    }
    
});

export default router;

