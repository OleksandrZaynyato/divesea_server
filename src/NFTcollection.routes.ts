import {Router} from "express";
import type { Request, Response } from "express";
import cloudinary from "./config/cloudinary.ts"
import NFTCollection from "./NFTcollection.model.ts";

const nftCollectionRoutes = Router();


nftCollectionRoutes.post("/", async (req: Request, res: Response) => {
    try {
        const {
            name,
            description,
            imageBase64,
            createdBy,
            tags,
            volume,
            floorPrice,
            totalSales,
            ownersCount,
            itemsCount
        } = req.body;

        if (!imageBase64) return res.status(400).json({ error: "No image" });

        // Upload Base64 to Cloudinary (server-side, signed)
        const uploaded = await cloudinary.uploader.upload(imageBase64, {
            folder: "nfts",
            overwrite: false,
            resource_type: "image",
        });

        // Save NFT document in MongoDB
        const newNFT = new NFTCollection({
            name,
            description,
            imageUrl: uploaded.secure_url, // use Cloudinary URL
            createdBy,
            tags,
            volume,
            floorPrice,
            totalSales,
            ownersCount,
            itemsCount
        });

        await newNFT.save();
        res.status(201).json(newNFT);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

nftCollectionRoutes.get("/", async (req: Request, res: Response) => {
    try {
        const nfts = await NFTCollection.find();
        res.json(nfts);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
})

nftCollectionRoutes.get("/:id", async (req: Request, res: Response) => {
    try {
        const nft = await NFTCollection.findById(req.params.id);
        if (!nft) return res.status(404).json({ error: "NFT not found" });
        res.json(nft);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
})

export default nftCollectionRoutes;