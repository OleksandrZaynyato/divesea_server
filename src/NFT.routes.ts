import {Router} from "express";
import type { Request, Response } from "express";
import cloudinary from "./config/cloudinary.ts"
import NFT from "./NFT.model.ts";

const nftRoutes = Router();


nftRoutes.post("/", async (req: Request, res: Response) => {
    try {
        const {
            name,
            description,
            imageBase64,
            createdBy,
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
            createdBy,
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

nftRoutes.get("/", async (req: Request, res: Response) => {
    try {
        const nfts = await NFT.find();
        res.json(nfts);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
})

nftRoutes.get("/:id", async (req: Request, res: Response) => {
    try {
        const nft = await NFT.findById(req.params.id);
        if (!nft) return res.status(404).json({ error: "NFT not found" });
        res.json(nft);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
})

nftRoutes.delete("/:id", async (req: Request, res: Response) => {
    try {
        const nft = await NFT.findByIdAndDelete(req.params.id);
        if (!nft) return res.status(404).json({ error: "NFT not found" });
        res.json({ message: "NFT deleted successfully" });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
})

export default nftRoutes;