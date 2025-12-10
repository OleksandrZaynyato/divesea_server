import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./src/config/DB";
import nftRoutes from "./src/NFT.routes";
import nftCollectionRoutes from "./src/NFTcollection.routes.ts";

const app = express();
app.use(express.json({ limit: "10mb" })); // allow large base64 images

// Connect to DB
connectDB();

// Cloudinary config
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });
//
// console.log("Cloudinary Config:", {
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// })


// Test route
app.get("/api", (req, res) => {
    res.json({ message: "hello!" });
});


app.use("/api/nft", nftRoutes)
app.use("/api/nftCollections", nftCollectionRoutes)

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
