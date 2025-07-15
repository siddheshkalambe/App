import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favoritesTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";

const app = express();
const PORT = ENV.PORT || 5001; 

app.use(express.json())

app.get("/api/health",(req,res)=>{
    res.status(200).json({success:true});

});

app.post("/api/favorites", async (req, res)=>{
 try {
    let {userId,recipeId,title,image,cookTime,servings} = req.body;

    userId = Number(userId);
    recipeId = Number(recipeId);
    servings = Number(servings);
     const cookTimeMinutes = parseInt(cookTime);

    if(!userId || !recipeId || !title){
        return res.status(400).json({error:"Missing required fields"});
    }

    const result =  await db.insert(favoritesTable).values({
        userId,
        recipeId,
        title,
        image,
        cookTime:cookTimeMinutes,
        servings,
    })

    res.status(201).json(result[0]);

   
 } catch (error) {
    console.log("Error adding favorite",error)
    res.status(500).json({error:"Something went wrong"});
 }
});

app.get("/api/favorites/:userId",async(req,res)=>{
    try {
        const {userId} = req.params;

       const userFavorites = await db.select().from(favoritesTable).where(eq(favoritesTable.userId,userId))

       res.status(200).json(userFavorites);
        
    } catch (error) {
        console.log("Error fetching the  favorite",error)
    res.status(500).json({error:"Something went wrong"});
    }
})

app.delete("/api/favorites/:userId/:recipeId",async(req,res)=>{
    try {
       const {userId,recipeId} = req.params

       await db.delete(favoritesTable).where(
        and(eq(favoritesTable.userId,userId),eq(favoritesTable.recipeId,parseInt(recipeId)))
       )
       res.status(200).json({messsage:"Favorite removed successsfully"});

    } catch (error) {
        console.log("Error removing a  favorite",error)
    res.status(500).json({error:"Something went wrong"});
    }
})

app.listen(PORT,()=>{
    console.log("server is running on PORT:",PORT);

});