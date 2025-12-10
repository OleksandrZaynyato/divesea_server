import dotenv from "dotenv";
dotenv.config();

import type { Request, Response } from "express";
import express from "express";
import { connectDB } from "./src/config/DB";
import NFT from "./src/NFT.model";
import { v2 as cloudinary } from "cloudinary";
import * as fs from "node:fs";

const app = express();
app.use(express.json({ limit: "10mb" })); // allow large base64 images

// Connect to DB
connectDB();

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary Config:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Test route
app.get("/api", (req, res) => {
    res.json({ message: "hello!" });
});

// Upload NFT route
app.post("/api/nft", async (req: Request, res: Response) => {
    try {
        const {
            name,
            description,
            imageBase64,
            owner,
            royaltyPercentage,
            size,
            tags,
            price,
            inStock,
            isOnSale,
            isOnDirectSale
        } = req.body;

        if (!imageBase64) return res.status(400).json({ error: "No image" });

        // Upload Base64 to Cloudinary (server-side, signed)
        const uploaded = await cloudinary.uploader.upload(imageBase64, {
            folder: "nfts",
            overwrite: false,
            resource_type: "image",
        });

        // Save NFT document in MongoDB
        const newNFT = new NFT({
            name,
            description,
            imageUrl: uploaded.secure_url, // use Cloudinary URL
            owner,
            royaltyPercentage,
            size,
            tags,
            price,
            inStock,
            isOnSale,
            isOnDirectSale,
        });

        await newNFT.save();
        res.status(201).json(newNFT);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
