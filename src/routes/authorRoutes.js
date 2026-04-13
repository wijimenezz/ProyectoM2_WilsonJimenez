import { Router } from "express";
const router = Router();


router.get ("/", (req , res) =>{
    res.send("obeniendo autores")
});

router.get ("/:id", (req , res) =>{
    const {id} = req.params;
    res.send("obeniendo autor" + id)
});

router.post ("/", (req , res) =>{
    res.send("creando autor")
});

router.put ("/:id", (req , res) =>{
   const {id} = req.params;
    res.send("actualizando autor" +id)
});

router.delete ("/:id", (req , res) =>{
    const {id} = req.params;
    res.send("eliminado autor" +id)
});

export default router;