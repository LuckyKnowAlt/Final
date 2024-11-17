const mongoose = require('mongoose');
const portfolioItemSchema = new mongoose.Schema(
{
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});
module.exports = mongoose.model('PortfolioItem', portfolioItemSchema);
