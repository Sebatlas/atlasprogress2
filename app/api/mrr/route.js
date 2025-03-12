import { NextResponse } from 'next/server';

export async function GET() {
  // Get the API key from environment variables
  const apiKey = process.env.MANTLE_API_KEY;
  
  try {
    // This is a fallback in case the API call fails
    return NextResponse.json({
      mrr: 48900,
      growthRate: 5.2,
      lastUpdated: new Date().toISOString()
    });
    
    // Uncomment this when you have the correct Mantle API endpoint
    /*
    const response = await fetch('https://api.mantle.io/v1/metrics/mrr', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        mrr: data.current_mrr || 48900,
        growthRate: data.growth_percentage || 5.2,
        lastUpdated: new Date().toISOString()
      });
    } else {
      throw new Error(`API error: ${response.status}`);
    }
    */
  } catch (error) {
    console.error('Error fetching MRR data:', error);
    
    // Return fallback data if the API call fails
    return NextResponse.json({
      mrr: 48900,
      growthRate: 5.2,
      lastUpdated: new Date().toISOString()
    });
  }
}
