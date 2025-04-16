import asynchandler from "express-async-handler";
import { AxiosInstance } from "../utils/AxiosInstance.js";
import { ApiResponse } from "../utils/apiResponse.js";


export const MarketTrendsApi = asynchandler(async (req, res) => {
  const { trend_type } = req.query;
  console.log(trend_type);
  const response = await AxiosInstance.get(
    `https://real-time-finance-data.p.rapidapi.com/market-trends?trend_type=${trend_type}&country=in&language=en`,
    {
      headers: {
        "x-rapidapi-key": "513b5a468fmsh4cde958b8fa5d06p120bfajsnbd5c09689329",
        "x-rapidapi-host": "real-time-finance-data.p.rapidapi.com",
      },
    }
  );
  console.log(response
  );

  if (response.data.status !== "OK") {
    throw new ApiError(401, "Failed to fetch market trends");
  }

  return res.json(
    new ApiResponse(
      200,
      response.data.data,
      `Market Trends : ${trend_type} Fetched Successfully`
    )
  );
});

export const BuyStockApi = asynchandler(async (req, res) => {
  const { stockSymbol, quantity, price } = req.body;

  if (!stockSymbol || !quantity || !price) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          null,
          "Missing required fields: stockSymbol, quantity, or price"
        )
      );
  }

  const purchaseDetails = {
    stockSymbol,
    quantity,
    price,
    totalCost: quantity * price,
    message: `Successfully purchased ${quantity} shares of ${stockSymbol} at ${price} each.`,
  };

  return res.json(
    new ApiResponse(200, purchaseDetails, "Stock purchase successful")
  );
});

export const RealTimeStockApi = asynchandler(async (req, res) => {
  const { stockSymbol } = req.query;

  if (!stockSymbol) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Missing required field: stockSymbol"));
  }

  const response = await AxiosInstance.get(
    `https://finnhub.io/api/v1/quote?symbol=${stockSymbol}`,
    {
      headers: {
        "X-Finnhub-Token": "cvallfhr01qsapma1q40cvallfhr01qsapma1q4g", // Replace with your actual API key
      },
    }
  );

  if (!response.data || Object.keys(response.data).length === 0) {
    throw new ApiError(404, "Failed to fetch real-time stock data");
  }

  return res.json(
    new ApiResponse(
      200,
      response.data,
      `Real-time stock data for ${stockSymbol} fetched successfully`
    )
  );
});
