import mongoose from "mongoose";

const NFTSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: String,
    imageUrl: String,
    owner: {
        username : String,
        userId: mongoose.Types.ObjectId
    },
    royaltyPercentage: Number,
    size: String,
    tags: [String],
    price: Number,
    inStock: Number,
    isOnSale: Boolean,
    isOnDirectSale: Boolean,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
},
    {
    timestamps: true,
    collection: "nfts"
})

export default mongoose.model("NFT", NFTSchema);