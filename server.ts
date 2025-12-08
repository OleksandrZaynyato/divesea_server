import dotenv from "dotenv";
dotenv.config();
import express from 'express'
import {connectDB} from "./src/config/DB.ts";
import NFT from "./src/NFT.model.ts";

const app = express()

connectDB();
const port = process.env.PORT || 3000

app.get("/api", (req, res)=>{
    res.json({message: "hello!"})
})

app.post("/api/nft", async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        const newNFT = NFT.create(req.body);
        await newNFT.save();
        res.status(201).json(newNFT);
    } catch (error) {
        console.error("Error creating NFT:", error);
        res.status(500).json({message: "Server error", error});
    }
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
