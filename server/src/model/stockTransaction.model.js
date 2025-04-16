import mongoose from "mongoose";

const stockTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  stockSymbol: {
    type: String,
    required: true,
  },
  stockname: {
    type: String,
    required: true,
  },
  transactionType: {
    type: String,
    enum: ["buy", "sell"],
    default: "",
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: String,
    required: true,
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("StockTransaction", stockTransactionSchema);
