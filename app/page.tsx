'use client';

import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [mrr, setMrr] = useState(48900);
  const [growthRate, setGrowthRate] = useState(5.2);
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(300);
  const [loading, setLoading] = useState(false);
  
  // Calculate metrics
  const arr = mrr * 12;
  const targetArr = 1000000;
  const progressPercentage = Math.min(100, (arr / targetArr) * 100);
  const remainingToGoal = targetArr - arr;
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Auto-refresh countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilRefresh((prev) => {
        if (prev <= 1) {
          // Simulate API refresh with small random change
          setMrr(prev => {
            const change = prev * (1 + (Math.random() * 0.02 - 0.01));
            return Math.round(change);
          });
          return 300;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Try to fetch from API on initial load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/mrr');
        if (response.ok) {
          const data = await response.json();
          setMrr(data.mrr);
          setGrowthRate(data.growthRate || 5.2);
        }
      } catch (error) {
        console.error('Error fetching MRR data:', error);
        // Fallback to default values if API fails
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Manual refresh function
  const refreshData = () => {
    setLoading(true);
    // Simulate API refresh with small random change
    setTimeout(() => {
      setMrr(prev => {
        const change = prev * (1 + (Math.random() * 0.02 - 0.01));
        return Math.round(change);
      });
      setLoading(false);
      setTimeUntilRefresh(300);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Atlas AI Dashboard</h1>
          <div className="flex items-center mt-4 md:mt-0">
            <span className="text-sm text-gray-500 mr-2">Refreshes in {formatTime(timeUntilRefresh)}</span>
            <button 
              onClick={refreshData}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              )}
              Refresh
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-medium text-gray-500 mb-2">Current MRR</h2>
            <div className="flex items-baseline">
              <span className="text-5xl font-bold text-gray-800">{formatCurrency(mrr)}</span>
              {growthRate > 0 && (
                <span className="ml-2 flex items-center text-green-500">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                  </svg>
                  {growthRate}%
                </span>
              )}
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-medium text-gray-500 mb-2">Current ARR</h2>
            <div className="text-5xl font-bold text-gray-800">{formatCurrency(arr)}</div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between mb-4">
            <h2 className="text-xl font-medium text-gray-800">Progress to $1M ARR</h2>
            <span className="text-xl font-bold text-gray-800">{progressPercentage.toFixed(1)}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div 
              className="bg-blue-500 h-4 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-500">
            <div>
              <div className="font-medium">Current</div>
              <div className="text-2xl font-bold text-gray-800">{formatCurrency(arr)}</div>
            </div>
            <div>
              <div className="font-medium">Remaining</div>
              <div className="text-2xl font-bold text-gray-800">{formatCurrency(remainingToGoal)}</div>
            </div>
            <div>
              <div className="font-medium">Goal</div>
              <div className="text-2xl font-bold text-gray-800">{formatCurrency(targetArr)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
