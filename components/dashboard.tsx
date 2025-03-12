'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

// MRR data interface
interface MRRData {
  mrr: number;
  growthRate?: number;
  lastUpdated: string;
}

export default function Dashboard() {
  const [data, setData] = useState<MRRData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(300); // 5 minutes in seconds

  // Function to fetch MRR data
  const fetchData = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/mrr');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch MRR data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setTimeUntilRefresh(300); // Reset countdown
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilRefresh((prev) => {
        if (prev <= 1) {
          fetchData();
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate metrics
  const currentMRR = data?.mrr || 0;
  const currentARR = currentMRR * 12;
  const targetARR = 1000000;
  const progressPercentage = Math.min(100, (currentARR / targetARR) * 100);
  const remainingToGoal = targetARR - currentARR;
  const growthRate = data?.growthRate || 0;

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto text-center py-12">
        <h1 className="text-3xl font-bold mb-8">Atlas AI Dashboard</h1>
        <div className="flex justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
        <p className="mt-4 text-gray-500">Loading your MRR data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-5xl mx-auto text-center py-12">
        <h1 className="text-3xl font-bold mb-8">Atlas AI Dashboard</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchData}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Atlas AI Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Refreshes in {formatTime(timeUntilRefresh)}</span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={fetchData}
            disabled={refreshing}
            className="h-10 w-10"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <div className="w-full space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-medium text-gray-500 dark:text-gray-400">Current MRR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <span className="text-5xl font-bold">{formatCurrency(currentMRR)}</span>
                {growthRate > 0 && (
                  <span className="ml-2 flex items-center text-green-500">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    {growthRate}%
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-medium text-gray-500 dark:text-gray-400">Current ARR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold">{formatCurrency(currentARR)}</div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row justify-between gap-2">
              <span>Progress to $1M ARR</span>
              <span className="text-xl font-bold">{progressPercentage.toFixed(1)}%</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={progressPercentage} className="h-4" />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div>
                <div className="font-medium">Current</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(currentARR)}</div>
              </div>
              <div>
                <div className="font-medium">Remaining</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(remainingToGoal)}</div>
              </div>
              <div>
                <div className="font-medium">Goal</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(targetARR)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
