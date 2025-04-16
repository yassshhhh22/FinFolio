import React, { useState, useEffect } from "react";
import { AxiosInstance } from "../Utils/AxiosInstance";
import { ApiError } from "../../../server/src/utils/apiError";
import { Loader } from "lucide-react";
import EquityDashboard from "./EquityDashboard"; // Import the new component
import {
  Search,
  Plus,
  PieChart,
  BarChart3,
  TrendingUp,
  Newspaper,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

import { GetCurrentUser } from "../Store/userSlice";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'buy' or 'sell'
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const userData = useSelector((state) => state.user.userData);
  const fetchPortfolioData = async () => {
    try {
      const response = await AxiosInstance.get("/v1/api/equity-portfolio");
      console.log("Portfolio data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
      return null;
    }
  };
  const [userInvestments, setUserInvestments] = useState({
    monthlyData: [], // Initialize with empty array
    portfolio: [],
    summary: [],
  });
  const { handleSubmit } = useForm();
  const fetchStocks = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get("/v1/api/market-trends", {
        params: { trend_type: "MOST_ACTIVE" },
      });
      setStocks(response.data.data?.trends || []);
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to fetch market trends");
    } finally {
      setLoading(false);
    }
  };

  const BuySellStocks = async () => {
    try {
      const response = await AxiosInstance.post("/v1/stocks/trade", {
        stockname: selectedStock.name,
        quantity,
        stockSymbol: selectedStock.symbol,
        price,
        totalAmount,
        transactionType: modalType,
        transactionDate: new Date().toISOString(),
      });
      if (response.status !== 201) {
        throw new ApiError(response.data.error);
      }
      toast.success(response.data.message, {
        position: "bottom-right",
      });
      dispatch(GetCurrentUser()).unwrap();
      console.log(response.data);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const getUserInvestments = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get("/v1/stocks/investments");
      console.log(response.data);
      setUserInvestments(response.data);
      console.log(userInvestments?.monthlyData[0]?.totalInvested);
    } catch (error) {
      console.error("API Error:", error);
      setError("Failed to fetch user investments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
    getUserInvestments();
    const ws = new WebSocket("ws://localhost:8080");
  }, [Object.keys(userInvestments).length]);

  useEffect(() => {
    setTotalAmount(quantity * price);
  }, [quantity, price]);

  const handleOpenModal = (type, stock) => {
    setModalType(type);
    setSelectedStock(stock);
    // Set initial price based on stock's current price (removing currency symbol)
    const numericPrice = parseFloat(stock.price);
    setPrice(numericPrice);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStock(null);
    setQuantity(1);
    setPrice(0);
  };

  if (typeof userData === "object" && Object.keys(userData).length === 0) {
    navigate("/signin");
    return;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col transition-colors duration-200">
      <div className="flex flex-1">
        <aside className="w-1/4 lg:w-1/5 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 overflow-y-auto h-[calc(100vh-57px)]">
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Stocks, Futures & Options"
                className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 transition-all"
              />
            </div>
          </div>
          {loading ? (
            <div className="w-full p-4 flex justify-center">
              <Loader className="animate-spin text-emerald-500" />
            </div>
          ) : (
            <ul className="space-y-0.5 text-sm">
              {stocks.map((stock, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="font-medium">{stock.name}</div>
                  <div className="text-right">
                    {hoveredIndex !== idx ? (
                      <>
                        <div className="font-semibold">{stock.price}</div>
                        <div
                          className={
                            stock.price > stock.previous_close
                              ? "text-emerald-600 text-xs"
                              : "text-red-500 text-xs"
                          }
                        >
                          {stock.change}
                        </div>
                      </>
                    ) : (
                      <div className="space-x-2">
                        <button
                          className="px-2 py-1 bg-emerald-500 text-white rounded text-xs hover:bg-emerald-600 transition-colors"
                          onClick={() => handleOpenModal("buy", stock)}
                        >
                          Buy
                        </button>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                          onClick={() => handleOpenModal("sell", stock)}
                        >
                          Sell
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <main className="flex-1 p-6 overflow-y-auto bg-slate-50 dark:bg-slate-800">
          {/* Tabs */}
          <div className="flex space-x-8 border-b border-slate-200 dark:border-slate-700 mb-6">
            <button
              className={`pb-3 ${
                activeTab === "overview"
                  ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-500 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`pb-3 ${
                activeTab === "equity"
                  ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-500 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              }`}
              onClick={() => {
                setActiveTab("equity");
                navigate("/equity-dashboard");
              }}
            >
              Equity
            </button>
            <button
              className={`pb-3 ${
                activeTab === "bonds"
                  ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-500 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              }`}
              onClick={() => {
                setActiveTab("bonds");
                navigate("/bonds-dashboard");
              }}
            >
              Bonds
            </button>
          </div>

          {/* Top cards: Invested Amount, Current Value, etc. */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="p-5 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 text-center transition-all hover:shadow-md">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Invested Amount
              </div>
              <div className="text-xl font-semibold mt-1">
                ₹{userInvestments?.monthlyData[0]?.totalInvested || 0.00}
              </div>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 text-center transition-all hover:shadow-md">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Current Value
              </div>
              <div className="text-xl font-semibold mt-1">₹0.00</div>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 text-center transition-all hover:shadow-md">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Overall Loss
              </div>
              <div className="text-xl font-semibold text-red-500 mt-1">
                ₹0.00
              </div>
              <div className="text-sm text-red-500">-23.34%</div>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 text-center transition-all hover:shadow-md">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Today's Gain
              </div>
              <div className="text-xl font-semibold text-emerald-500 mt-1">
                ₹0.00
              </div>
              <div className="text-sm text-emerald-500">0.00%</div>
            </div>
          </div>

          {/* Rest of the existing dashboard content remains the same */}
          {/* Holdings Table */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="font-semibold text-lg">Holdings</h2>
              <button className="text-sm px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors">
                <Plus className="h-3.5 w-3.5 inline mr-1" />
                Add Stock
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Stock Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Buy Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Sell Quantity
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Inv. Amt
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                  {userInvestments?.summary?.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {item.stockname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {item.buyQuantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {item.sellQuantity}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {item.totalInvested}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {item.mktVal}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-right font-medium ${
                          item.overallGL < 0
                            ? "text-red-500"
                            : "text-emerald-500"
                        }`}
                      >
                        {item.overallGL}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-right font-medium ${
                          item.dayGL < 0 ? "text-red-500" : "text-emerald-500"
                        }`}
                      >
                        {item.dayGL}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Portfolio Allocation + Analyse Returns + Top Drivers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Portfolio Allocation */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-5">
              <h3 className="font-semibold mb-4 flex items-center">
                <PieChart className="h-4 w-4 mr-2 text-emerald-500" />
                Portfolio Allocation
              </h3>
              {/* Example of bar or chart placeholder */}
              <div className="mt-4">
                <div className="flex justify-between text-sm font-medium mb-1.5">
                  <span>Trading</span>
                  <span>54.8%</span>
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 h-2 w-full rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-2"
                    style={{ width: "54.8%" }}
                  ></div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm font-medium mb-1.5">
                  <span>Finance/NBFC</span>
                  <span>39.1%</span>
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 h-2 w-full rounded-full overflow-hidden">
                  <div
                    className="bg-pink-500 h-2"
                    style={{ width: "39.1%" }}
                  ></div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm font-medium mb-1.5">
                  <span>Other</span>
                  <span>8.1%</span>
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 h-2 w-full rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-2"
                    style={{ width: "8.1%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Analyse Returns */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-5">
              <h3 className="font-semibold mb-4 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-emerald-500" />
                Analyse Returns
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Check out sectorwise returns
              </p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
                    <span>Chemicals</span>
                  </div>
                  <span className="text-red-500 font-medium">-18.60%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 bg-pink-500 rounded-full mr-2"></span>
                    <span>Finance/NBFC</span>
                  </div>
                  <span className="text-red-500 font-medium">-20.00%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    <span>Trading</span>
                  </div>
                  <span className="text-red-500 font-medium">-20.45%</span>
                </div>
              </div>
              <button className="w-full mt-6 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors">
                View Detailed Analysis
              </button>
            </div>

            {/* Top Drivers */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-5">
              <h3 className="font-semibold mb-4 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-emerald-500" />
                Top Drivers
              </h3>
              <div className="flex space-x-4 text-sm mb-4">
                <button className="border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-500 pb-1 font-medium">
                  Top Gainers
                </button>
                <button className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 pb-1 transition-colors">
                  Top Losers
                </button>
              </div>
              <table className="w-full text-sm">
                <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Stock</th>
                    <th className="px-4 py-2 text-right font-medium">
                      LTP (%)
                    </th>
                    <th className="px-4 py-2 text-right font-medium">
                      Today's Gain
                    </th>
                    <th className="px-4 py-2 text-right font-medium">
                      52W High
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <td className="px-4 py-3 font-medium">AVANCE</td>
                    <td className="px-4 py-3 text-right text-emerald-500">
                      0.63 (+1.61%)
                    </td>
                    <td className="px-4 py-3 text-right">0.00</td>
                    <td className="px-4 py-3 text-right">1.62</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <td className="px-4 py-3 font-medium">ALSTONE</td>
                    <td className="px-4 py-3 text-right text-emerald-500">
                      0.60 (+0.84%)
                    </td>
                    <td className="px-4 py-3 text-right">0.00</td>
                    <td className="px-4 py-3 text-right">1.10</td>
                  </tr>
                </tbody>
              </table>
              <button className="w-full mt-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                View All Stocks
              </button>
            </div>
          </div>

          {/* Market News Section */}
          <div className="mt-6 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold flex items-center">
                <Newspaper className="h-4 w-4 mr-2 text-emerald-500" />
                Market News
              </h3>
              <button className="text-xs text-emerald-600 dark:text-emerald-500 hover:underline">
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border border-slate-100 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <p className="text-sm font-medium">
                  RBI Announces New Liquidity Management Framework
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  March 16, 2025 • 10:30 AM
                </p>
              </div>
              <div className="p-3 border border-slate-100 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <p className="text-sm font-medium">
                  Global Markets Rally on Positive Economic Data
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  March 16, 2025 • 9:15 AM
                </p>
              </div>
            </div>
          </div>
          {activeTab === "equity" && <EquityDashboard />}

          {activeTab === "bonds" && (
            <div className="text-center p-10">
              <h2 className="text-xl font-semibold mb-4">Bonds Dashboard</h2>
              <p>Bonds dashboard is coming soon.</p>
            </div>
          )}
        </main>
      </div>

      {/* Buy/Sell Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={handleCloseModal}
          ></div>
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg w-full max-w-md z-10 p-6 relative">
            <button
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              onClick={handleCloseModal}
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-semibold mb-4">
              {modalType === "buy" ? "Buy" : "Sell"} {selectedStock?.name}
            </h3>

            <form onSubmit={handleSubmit(BuySellStocks)}>
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    Current Price
                  </span>
                  <span className="font-medium">{selectedStock?.price}</span>
                </div>

                {/* Quantity Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quantity
                  </label>
                  <div className="flex rounded-md overflow-hidden">
                    <button
                      type="button"
                      className="bg-slate-100 dark:bg-slate-700 px-3 text-slate-600 dark:text-slate-300"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="flex-1 text-center border-y border-slate-200 dark:border-slate-700 py-2 bg-white dark:bg-slate-900"
                    />
                    <button
                      type="button"
                      className="bg-slate-100 dark:bg-slate-700 px-3 text-slate-600 dark:text-slate-300"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 bg-white dark:bg-slate-900"
                  />
                </div>

                {/* Order Type Selector */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Order Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="text-center py-2 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                    >
                      Market
                    </button>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex justify-between">
                  <span className="font-medium">Total Amount</span>
                  <span className="font-bold">₹{totalAmount.toFixed(2)}</span>
                </div>

                {/* Advanced Options */}

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`w-full py-3 font-medium text-white rounded-lg ${
                    modalType === "buy"
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : "bg-red-500 hover:bg-red-600"
                  } transition-colors`}
                >
                  {modalType === "buy" ? "Buy" : "Sell"} {selectedStock?.name}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
