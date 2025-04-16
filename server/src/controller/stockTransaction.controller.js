import StockTransaction from "../model/stockTransaction.model.js";
import { User } from "../model/user.model.js"
import mongoose from "mongoose";
export const buySellStock = async (req, res) => {
  try {
    const { stockSymbol, stockname, quantity, price, transactionType, transactionDate, totalAmount } = req.body;
    console.log( stockSymbol, stockname, quantity, price, transactionType, transactionDate, totalAmount)

    const user = await User.findById(req.user?.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.amount < totalAmount) return res.status(400).json({ message: "Insufficient funds" });
    // Deduct the amount from the user's account
    user.amount = user.amount - totalAmount;
    await user.save();

    const transaction = await StockTransaction.create({
      userId: req.user?.id,
      stockSymbol,
      stockname,
      transactionType,
      quantity,
      price,
      totalAmount,
      transactionDate,

    });

    res.status(201).json({transaction , message: "Transaction successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Basic pipeline to get all stock transactions for a specific user
const getUserTransactions = (userId) => [
  {
    $match: {
      userId: new mongoose.Types.ObjectId(userId)
    }
  },
  {
    $sort: { transactionDate: -1 }
  }
];

// Get current portfolio (holdings) for a user
const getUserPortfolio = (userId) => [
  {
    $match: {
      userId: new mongoose.Types.ObjectId(userId)
    }
  },
  {
    $group: {
      _id: {
        stockSymbol: "$stockSymbol",
        stockname: "$stockname"
      },
      totalShares: {
        $sum: {
          $cond: [
            { $eq: ["$transactionType", "buy"] },
            "$quantity",
            { $multiply: ["$quantity", -1] }
          ]
        }
      },
      totalInvested: {
        $sum: {
          $cond: [
            { $eq: ["$transactionType", "buy"] },
            { $toDouble: "$totalAmount" },
            { $multiply: [{ $toDouble: "$totalAmount" }, -1] }
          ]
        }
      },
      buyTransactions: {
        $sum: { $cond: [{ $eq: ["$transactionType", "buy"] }, 1, 0] }
      },
      sellTransactions: {
        $sum: { $cond: [{ $eq: ["$transactionType", "sell"] }, 1, 0] }
      },
      lastTransaction: { $max: "$transactionDate" }
    }
  },
  {
    $match: {
      totalShares: { $gt: 0 }
    }
  },
  {
    $project: {
      _id: 0,
      stockSymbol: "$_id.stockSymbol",
      stockname: "$_id.stockname",
      totalShares: 1,
      totalInvested: 1,
      averageCost: { $divide: ["$totalInvested", "$totalShares"] },
      buyTransactions: 1,
      sellTransactions: 1,
      lastTransaction: 1
    }
  },
  {
    $sort: { totalInvested: -1 }
  }
];

// Get investment summary with performance metrics by stock
const getInvestmentSummary = (userId) => [
  {
    $match: {
      userId: new mongoose.Types.ObjectId(userId)
    }
  },
  {
    $group: {
      _id: {
        stockSymbol: "$stockSymbol",
        stockname: "$stockname"
      },
      buyQuantity: {
        $sum: { $cond: [{ $eq: ["$transactionType", "buy"] }, "$quantity", 0] }
      },
      sellQuantity: {
        $sum: { $cond: [{ $eq: ["$transactionType", "sell"] }, "$quantity", 0] }
      },
      buyAmount: {
        $sum: { $cond: [{ $eq: ["$transactionType", "buy"] }, { $toDouble: "$totalAmount" }, 0] }
      },
      sellAmount: {
        $sum: { $cond: [{ $eq: ["$transactionType", "sell"] }, { $toDouble: "$totalAmount" }, 0] }
      },
      firstTransaction: { $min: "$transactionDate" },
      lastTransaction: { $max: "$transactionDate" }
    }
  },
  {
    $project: {
      _id: 0,
      stockSymbol: "$_id.stockSymbol",
      stockname: "$_id.stockname",
      totalShares: { $subtract: ["$buyQuantity", "$sellQuantity"] },
      totalInvested: { $subtract: ["$buyAmount", "$sellAmount"] },
      buyQuantity: 1,
      sellQuantity: 1,
      buyAmount: 1,
      sellAmount: 1,
      realizedProfit: {
        $cond: [
          { $gt: ["$sellQuantity", 0] },
          "$sellAmount",
          0
        ]
      },
      firstTransaction: 1,
      lastTransaction: 1,
      investmentDuration: {
        $divide: [
          { $subtract: ["$lastTransaction", "$firstTransaction"] },
          86400000 // Convert milliseconds to days
        ]
      }
    }
  },
  {
    $sort: { totalInvested: -1 }
  }
];

// Monthly investment breakdown
const getMonthlyInvestments = (userId) => [
  {
    $match: {
      userId: new mongoose.Types.ObjectId(userId),
      transactionType: "buy"
    }
  },
  {
    $group: {
      _id: {
        year: { $year: "$transactionDate" },
        month: { $month: "$transactionDate" }
      },
      totalInvested: { $sum: { $toDouble: "$totalAmount" } },
      transactionCount: { $sum: 1 },
      stocks: { $addToSet: "$stockSymbol" }
    }
  },
  {
    $sort: {
      "_id.year": 1,
      "_id.month": 1
    }
  },
  {
    $project: {
      _id: 0,
      year: "$_id.year",
      month: "$_id.month",
      period: {
        $concat: [
          { $toString: "$_id.year" },
          "-",
          {
            $cond: [
              { $lt: ["$_id.month", 10] },
              { $concat: ["0", { $toString: "$_id.month" }] },
              { $toString: "$_id.month" }
            ]
          }
        ]
      },
      totalInvested: 1,
      transactionCount: 1,
      uniqueStocks: { $size: "$stocks" }
    }
  }
];

// Usage examples:
async function fetchUserInvestments(req,res) {

  const userId = req.user?.id;
  console.log(userId)
  try {
    // Get current portfolio
    const portfolio = await mongoose.model("StockTransaction").aggregate(getUserPortfolio(userId));
    
    // Get investment summary
    const summary = await mongoose.model("StockTransaction").aggregate(getInvestmentSummary(userId));
    
    // Get monthly breakdown
    const monthlyData = await mongoose.model("StockTransaction").aggregate(getMonthlyInvestments(userId));
    
    return res.status(200).json({ portfolio, summary, monthlyData }); 
  } catch (error) {
    console.error("Error fetching user investments:", error);
    throw error;
  }
}

export default fetchUserInvestments;

