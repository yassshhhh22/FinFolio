import React, { useState, useEffect } from "react";
import { AxiosInstance } from "../Utils/AxiosInstance";
import {
  ArrowUp,
  ArrowDown,
  PieChart,
  BarChart3,
  TrendingUp,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const EquityDashboard = () => {
  // State management for data
  const [equityData, setEquityData] = useState({
    performance: [],
    sectorAllocation: [],
    topHoldings: [],
    marketStats: {},
    historicalReturns: [],
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState("3M");

  // Fetch equity data from your API
  const fetchEquityData = async () => {
    try {
      setLoading(true);
      // Using the same AxiosInstance as your overview dashboard
      const response = await AxiosInstance.get("/v1/api/equity-portfolio");

      setEquityData({
        performance: response.data.data?.performance || [],
        sectorAllocation: response.data.data?.sectorAllocation || [],
        topHoldings: response.data.data?.topHoldings || [],
        marketStats: response.data.data?.marketStats || {},
        historicalReturns: response.data.data?.historicalReturns || [],
      });
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to fetch equity portfolio data");

      setEquityData({
        performance: [
          { name: "Jan", value: 4000 },
          { name: "Feb", value: 3000 },
          { name: "Mar", value: 5000 },
          { name: "Apr", value: 2780 },
          { name: "May", value: 1890 },
          { name: "Jun", value: 2390 },
          { name: "Jul", value: 3490 },
          { name: "Aug", value: 4200 },
          { name: "Sep", value: 5100 },
          { name: "Oct", value: 4300 },
          { name: "Nov", value: 6300 },
          { name: "Dec", value: 7100 },
        ],
        sectorAllocation: [
          { name: "Technology", value: 35 },
          { name: "Healthcare", value: 20 },
          { name: "Financials", value: 15 },
          { name: "Consumer", value: 10 },
          { name: "Energy", value: 8 },
          { name: "Other", value: 12 },
        ],
        topHoldings: [
          {
            name: "Apple Inc.",
            ticker: "AAPL",
            allocation: 8.2,
            change: 2.4,
            price: 234.56,
          },
          {
            name: "Microsoft Corp",
            ticker: "MSFT",
            allocation: 7.5,
            change: 1.8,
            price: 421.78,
          },
          {
            name: "Amazon.com Inc",
            ticker: "AMZN",
            allocation: 6.3,
            change: -0.7,
            price: 187.43,
          },
          {
            name: "Nvidia Corp",
            ticker: "NVDA",
            allocation: 5.8,
            change: 3.5,
            price: 678.92,
          },
          {
            name: "Alphabet Inc",
            ticker: "GOOGL",
            allocation: 4.9,
            change: 0.5,
            price: 167.34,
          },
        ],
        marketStats: {
          totalValue: 1245678,
          unrealizedGain: 234567,
          dividendYield: 2.3,
          beta: 0.94,
          sharpeRatio: 1.72,
        },
        historicalReturns: [
          { name: "Jan", value: 4000 },
          { name: "Feb", value: 3000 },
          { name: "Mar", value: 5000 },
          { name: "Apr", value: 2780 },
          { name: "May", value: 1890 },
          { name: "Jun", value: 2390 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquityData();

    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      console.log("WebSocket message:", event.data);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  // Helper function to format numbers with commas
  const formatCurrency = (value) => {
    return value.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      style: "currency",
      currency: "INR",
    });
  };

  // Function to get color based on value for heatmap style in charts
  const getColor = (value) => {
    const intensity = Math.floor((value / 100) * 255);
    return `rgb(${255 - intensity}, ${255 - intensity}, 255)`;
  };

  const COLORS = [
    "#10b981",
    "#8884d8",
    "#ff8042",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
  ];

  // Custom dark mode tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded shadow-lg text-slate-800 dark:text-slate-200 text-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
      <div className="h-72 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
      <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
    </div>
  );

  return (
    <div className="w-full text-slate-800 dark:text-slate-200 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
      {/* Main content */}
      {error ? (
        <div className="text-center text-red-500 dark:text-red-400 font-medium p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30">
          {error}
        </div>
      ) : loading ? (
        <SkeletonLoader />
      ) : (
        <div className="animate-fadeIn">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-slate-800 dark:text-white">
              Equity Portfolio
            </h1>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md transition-colors text-sm dark:text-slate-200">
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md transition-colors text-sm dark:text-slate-200">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md transition-colors text-sm dark:text-slate-200">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Summary Cards - Similar to your overview dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="p-5  rounded-lg shadow-sm border p-3 border border-slate-100 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-center  transition-all hover:shadow-md">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Total Market Value
              </div>
              <div className="text-xl font-semibold mt-1 dark:text-white">
                {formatCurrency(equityData.marketStats.totalValue / 100000)}L
              </div>
            </div>
            <div className="p-5  rounded-lg shadow-sm border p-3 border border-slate-100 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-center  transition-all hover:shadow-md">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Unrealized Gain/Loss
              </div>
              <div className="text-xl font-semibold text-emerald-500 dark:text-emerald-400 mt-1">
                ₹{(equityData.marketStats.unrealizedGain / 100000).toFixed(2)}L
              </div>
            </div>
            <div className="p-5  rounded-lg shadow-sm border p-3 border border-slate-100 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-center  transition-all hover:shadow-md">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Dividend Yield
              </div>
              <div className="text-xl font-semibold mt-1 dark:text-white">
                {equityData.marketStats.dividendYield}%
              </div>
            </div>
            <div className="p-5  rounded-lg shadow-sm border p-3 border border-slate-100 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-center  transition-all hover:shadow-md">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Sharpe Ratio
              </div>
              <div className="text-xl font-semibold mt-1 dark:text-white">
                {equityData.marketStats.sharpeRatio}
              </div>
            </div>
          </div>

          {/* Top Holdings */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="font-semibold text-lg dark:text-white">
                Top Holdings
              </h2>
              <button className="text-sm px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors">
                View All
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
                      Company
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Ticker
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Allocation
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Daily Change
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                  {equityData.topHoldings.map((holding, index) => (
                    <tr
                      key={index}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium dark:text-white">
                        {holding.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap dark:text-slate-300">
                        {holding.ticker}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right dark:text-slate-300">
                        {holding.allocation}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right dark:text-slate-300">
                        {formatCurrency(holding.price)}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-right font-medium ${
                          holding.change >= 0
                            ? "text-emerald-500 dark:text-emerald-400"
                            : "text-red-500 dark:text-red-400"
                        }`}
                      >
                        <div className="flex items-center justify-end space-x-1">
                          {holding.change >= 0 ? (
                            <ArrowUp className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5" />
                          )}
                          <span>{Math.abs(holding.change).toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Portfolio Analysis Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Portfolio Performance */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-5">
              <h3 className="font-semibold mb-4 flex items-center dark:text-white">
                <TrendingUp className="h-4 w-4 mr-2 text-emerald-500 dark:text-emerald-400" />
                Performance
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={equityData.performance}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                      strokeOpacity={0.4}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      tick={{ fill: "#94a3b8" }}
                    />
                    <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, fill: "#10b981", stroke: "#fff" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sector Allocation */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-5">
              <h3 className="font-semibold mb-4 flex items-center dark:text-white">
                <PieChart className="h-4 w-4 mr-2 text-emerald-500 dark:text-emerald-400" />
                Sector Allocation
              </h3>
              <div className="mt-4 space-y-3">
                {equityData.sectorAllocation.map((sector, index) => (
                  <div key={index} className="mt-4">
                    <div className="flex justify-between text-sm font-medium mb-1.5 dark:text-slate-300">
                      <span>{sector.name}</span>
                      <span>{sector.value}%</span>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-700 h-2 w-full rounded-full overflow-hidden">
                      <div
                        className="h-2"
                        style={{
                          width: `${sector.value}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Metrics */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-5">
              <h3 className="font-semibold mb-4 flex items-center dark:text-white">
                <BarChart3 className="h-4 w-4 mr-2 text-emerald-500 dark:text-emerald-400" />
                Risk Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Alpha (3Y)
                  </span>
                  <span className="font-medium text-emerald-500 dark:text-emerald-400">
                    +2.34
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Beta
                  </span>
                  <span className="font-medium dark:text-white">
                    {equityData.marketStats.beta}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Standard Deviation
                  </span>
                  <span className="font-medium dark:text-white">19.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Tracking Error
                  </span>
                  <span className="font-medium dark:text-white">4.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Information Ratio
                  </span>
                  <span className="font-medium dark:text-white">0.62</span>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Returns */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
                Historical Returns
              </h2>
              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    activeTimeframe === "1M"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200"
                  }`}
                  onClick={() => setActiveTimeframe("1M")}
                >
                  1M
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    activeTimeframe === "3M"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200"
                  }`}
                  onClick={() => setActiveTimeframe("3M")}
                >
                  3M
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    activeTimeframe === "6M"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200"
                  }`}
                  onClick={() => setActiveTimeframe("6M")}
                >
                  6M
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    activeTimeframe === "1Y"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200"
                  }`}
                  onClick={() => setActiveTimeframe("1Y")}
                >
                  1Y
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    activeTimeframe === "5Y"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200"
                  }`}
                  onClick={() => setActiveTimeframe("5Y")}
                >
                  5Y
                </button>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 transition-shadow hover:shadow-md">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={equityData.historicalReturns}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                      strokeOpacity={0.4}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      tick={{ fill: "#94a3b8" }}
                    />
                    <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{
                        color: "#94a3b8",
                      }}
                    />
                    <Bar dataKey="value" name="Return" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Equity Comparison */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-5 mb-6">
            <h3 className="font-semibold mb-4 dark:text-white">
              Performance vs Benchmark
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-3 border border-slate-100 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  YTD Return
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-medium dark:text-white">
                    Your Portfolio
                  </span>
                  <span className="font-medium text-emerald-500 dark:text-emerald-400">
                    +12.4%
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-medium dark:text-white">NIFTY 50</span>
                  <span className="font-medium text-emerald-500 dark:text-emerald-400">
                    +8.7%
                  </span>
                </div>
              </div>
              <div className="p-3 border border-slate-100 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  1 Year Return
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-medium dark:text-white">
                    Your Portfolio
                  </span>
                  <span className="font-medium text-emerald-500 dark:text-emerald-400">
                    +18.7%
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-medium dark:text-white">NIFTY 50</span>
                  <span className="font-medium text-emerald-500 dark:text-emerald-400">
                    +15.2%
                  </span>
                </div>
              </div>
              <div className="p-3 border border-slate-100 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  3 Year Return
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-medium dark:text-white">
                    Your Portfolio
                  </span>
                  <span className="font-medium text-emerald-500 dark:text-emerald-400">
                    +64.3%
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-medium dark:text-white">NIFTY 50</span>
                  <span className="font-medium text-emerald-500 dark:text-emerald-400">
                    +48.6%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for animation effect */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EquityDashboard;
