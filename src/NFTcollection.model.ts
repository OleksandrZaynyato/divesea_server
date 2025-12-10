import mongoose from "mongoose";

const NFTSchema = new mongoose.Schema({
        name: {type: String, required: true},
        description: String,
        imageUrl: String,
        createdBy: {type: String, required: true},
        tags: [String],
        volume: Number,
        floorPrice: Number,
        totalSales: Number,
        ownersCount: Number,
        itemsCount: Number,
        change24hPercentage: Number,
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},
    },
    {
        timestamps: true,
        collection: "nft_collections"
    }
);

export default mongoose.model("NFTCollection", NFTSchema);
