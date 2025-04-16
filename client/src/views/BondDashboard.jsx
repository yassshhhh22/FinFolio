import React, { useState, useEffect } from 'react';
import { AxiosInstance } from '../Utils/AxiosInstance';
import { Loader, PieChart, BarChart3, TrendingUp, Newspaper, AlertCircle } from 'lucide-react';

const BondsDashboard = () => {
  const [bonds, setBonds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('all');

  // Mock function to fetch bonds data
  const fetchBondsData = async () => {
    try {
      setLoading(true);
      // Replace with actual API call when available
      // const response = await AxiosInstance.get("/v1/api/bonds-portfolio");
      // setBonds(response.data.data?.bonds || []);
      
      // Mock data for demonstration
      setTimeout(() => {
        setBonds([
          {
            name: "5.85% GOI 2030",
            type: "Government",
            faceValue: 100000,
            marketValue: 97500,
            couponRate: 5.85,
            yieldToMaturity: 6.12,
            maturityDate: "2030-12-01",
            lastPrice: 97.50,
            change: -0.25,
            rating: "AAA"
          },
          {
            name: "7.26% HDFC 2027",
            type: "Corporate",
            faceValue: 50000,
            marketValue: 51250,
            couponRate: 7.26,
            yieldToMaturity: 6.85,
            maturityDate: "2027-09-15",
            lastPrice: 102.50,
            change: 0.35,
            rating: "AAA"
          },
          {
            name: "6.75% NHAI 2031",
            type: "PSU",
            faceValue: 75000,
            marketValue: 76125,
            couponRate: 6.75,
            yieldToMaturity: 6.58,
            maturityDate: "2031-03-20",
            lastPrice: 101.50,
            change: 0.15,
            rating: "AAA"
          },
          {
            name: "8.20% RIL 2026",
            type: "Corporate",
            faceValue: 60000,
            marketValue: 63600,
            couponRate: 8.20,
            yieldToMaturity: 7.24,
            maturityDate: "2026-04-10",
            lastPrice: 106.00,
            change: 0.40,
            rating: "AA+"
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to fetch bonds data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBondsData();
  }, []);
  
  // Calculate summary statistics
  const totalInvested = bonds.reduce((sum, bond) => sum + bond.faceValue, 0);
  const totalMarketValue = bonds.reduce((sum, bond) => sum + bond.marketValue, 0);
  const totalGainLoss = totalMarketValue - totalInvested;
  const percentGainLoss = totalInvested > 0 ? (totalGainLoss / totalInvested * 100).toFixed(2) : 0;
  const todayChange = bonds.reduce((sum, bond) => sum + (bond.change / 100 * bond.marketValue), 0);

  return (
    <div className="min-h-full">
      {/* Bond Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 text-center transition-all hover:shadow-md">
          <div className="text-sm text-slate-500 dark:text-slate-400">Face Value</div>
          <div className="text-xl font-semibold mt-1">₹{totalInvested.toLocaleString()}</div>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 text-center transition-all hover:shadow-md">
          <div className="text-sm text-slate-500 dark:text-slate-400">Market Value</div>
          <div className="text-xl font-semibold mt-1">₹{totalMarketValue.toLocaleString()}</div>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 text-center transition-all hover:shadow-md">
          <div className="text-sm text-slate-500 dark:text-slate-400">Overall {totalGainLoss >= 0 ? 'Gain' : 'Loss'}</div>
          <div className={`text-xl font-semibold mt-1 ${totalGainLoss >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            ₹{Math.abs(totalGainLoss).toLocaleString()}
          </div>
          <div className={`text-sm ${totalGainLoss >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {totalGainLoss >= 0 ? '+' : ''}{percentGainLoss}%
          </div>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 text-center transition-all hover:shadow-md">
          <div className="text-sm text-slate-500 dark:text-slate-400">Today's {todayChange >= 0 ? 'Gain' : 'Loss'}</div>
          <div className={`text-xl font-semibold mt-1 ${todayChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            ₹{Math.abs(todayChange).toLocaleString()}
          </div>
          <div className={`text-sm ${todayChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {todayChange >= 0 ? '+' : ''}{(todayChange / totalMarketValue * 100).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Bond Holdings Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
        <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-lg">Bond Holdings</h2>
          <div className="flex space-x-2">
            <button 
              className={`text-sm px-3 py-1 rounded-full transition-colors ${
                activeView === 'all' 
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
              onClick={() => setActiveView('all')}
            >
              All Bonds
            </button>
            <button 
              className={`text-sm px-3 py-1 rounded-full transition-colors ${
                activeView === 'government' 
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
              onClick={() => setActiveView('government')}
            >
              Government
            </button>
            <button 
              className={`text-sm px-3 py-1 rounded-full transition-colors ${
                activeView === 'corporate' 
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
              onClick={() => setActiveView('corporate')}
            >
              Corporate
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="w-full p-16 flex justify-center">
              <Loader className="animate-spin text-emerald-500" />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bond Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Coupon</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">YTM</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Maturity</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Face Value</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mkt. Value</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last Price</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rating</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                {bonds
                  .filter(bond => activeView === 'all' || bond.type.toLowerCase() === activeView.toLowerCase())
                  .map((bond, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{bond.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{bond.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">{bond.couponRate}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">{bond.yieldToMaturity}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {new Date(bond.maturityDate).toLocaleDateString('en-IN', { 
                          year: 'numeric', 
                          month: 'short'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">₹{bond.faceValue.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">₹{bond.marketValue.toLocaleString()}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right font-medium ${
                        bond.change > 0 ? 'text-emerald-500' : bond.change < 0 ? 'text-red-500' : ''
                      }`}>
                        {bond.lastPrice} ({bond.change > 0 ? '+' : ''}{bond.change}%)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-medium">{bond.rating}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Analytical Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Bond Portfolio Allocation */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-5">
          <h3 className="font-semibold mb-4 flex items-center">
            <PieChart className="h-4 w-4 mr-2 text-emerald-500" />
            Bond Portfolio Allocation
          </h3>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm font-medium mb-1.5">
              <span>Government</span>
              <span>35.1%</span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-700 h-2 w-full rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-2"
                style={{ width: "35.1%" }}
              ></div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm font-medium mb-1.5">
              <span>Corporate</span>
              <span>42.7%</span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-700 h-2 w-full rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-2"
                style={{ width: "42.7%" }}
              ></div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm font-medium mb-1.5">
              <span>PSU</span>
              <span>22.2%</span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-700 h-2 w-full rounded-full overflow-hidden">
              <div
                className="bg-orange-500 h-2"
                style={{ width: "22.2%" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Maturity Profile */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-5">
          <h3 className="font-semibold mb-4 flex items-center">
            <BarChart3 className="h-4 w-4 mr-2 text-emerald-500" />
            Maturity Profile
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Distribution by maturity period
          </p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-emerald-500 rounded-full mr-2"></span>
                <span>0-3 years</span>
              </div>
              <span className="font-medium">25.4%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                <span>3-5 years</span>
              </div>
              <span className="font-medium">32.1%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                <span>5-10 years</span>
              </div>
              <span className="font-medium">42.5%</span>
            </div>
          </div>
          <button className="w-full mt-6 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors">
            View Detailed Analysis
          </button>
        </div>

        {/* Top Bonds */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-5">
          <h3 className="font-semibold mb-4 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-emerald-500" />
            Top Performing Bonds
          </h3>
          <div className="flex space-x-4 text-sm mb-4">
            <button className="border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-500 pb-1 font-medium">
              Highest YTM
            </button>
            <button className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 pb-1 transition-colors">
              Best Returns
            </button>
          </div>
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Bond</th>
                <th className="px-4 py-2 text-right font-medium">Coupon</th>
                <th className="px-4 py-2 text-right font-medium">YTM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <td className="px-4 py-3 font-medium">8.20% RIL 2026</td>
                <td className="px-4 py-3 text-right">8.20%</td>
                <td className="px-4 py-3 text-right text-emerald-500">7.24%</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <td className="px-4 py-3 font-medium">7.26% HDFC 2027</td>
                <td className="px-4 py-3 text-right">7.26%</td>
                <td className="px-4 py-3 text-right text-emerald-500">6.85%</td>
              </tr>
            </tbody>
          </table>
          <button className="w-full mt-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            View All Bonds
          </button>
        </div>
      </div>

      {/* Interest Income Projection */}
      <div className="mt-6 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-emerald-500" />
            Upcoming Interest Payments
          </h3>
          <button className="text-xs text-emerald-600 dark:text-emerald-500 hover:underline">View Calendar</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bond</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Payment Date</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-medium">7.26% HDFC 2027</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">Mar 31, 2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-emerald-500">₹1,815</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-medium">5.85% GOI 2030</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">Apr 15, 2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-emerald-500">₹2,925</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-medium">8.20% RIL 2026</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">Apr 30, 2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-emerald-500">₹2,460</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Market News Section */}
      <div className="mt-6 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold flex items-center">
            <Newspaper className="h-4 w-4 mr-2 text-emerald-500" />
            Bond Market News
          </h3>
          <button className="text-xs text-emerald-600 dark:text-emerald-500 hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 border border-slate-100 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <p className="text-sm font-medium">RBI Holds Rates Steady, Signals Extended Pause</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">March 15, 2025 • 11:45 AM</p>
          </div>
          <div className="p-3 border border-slate-100 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <p className="text-sm font-medium">Government Announces New Bond Issuance Calendar</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">March 14, 2025 • 2:30 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BondsDashboard;