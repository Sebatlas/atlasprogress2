export default function Dashboard() {
  const mrr = 48900;
  const arr = mrr * 12;
  const targetArr = 1000000;
  const progress = (arr / targetArr) * 100;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-8">Atlas AI Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl text-gray-600 mb-2">Monthly Recurring Revenue</h2>
            <div className="text-4xl font-bold">${mrr.toLocaleString()}</div>
          </div>
          
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl text-gray-600 mb-2">Annual Recurring Revenue</h2>
            <div className="text-4xl font-bold">${arr.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="bg-white border rounded-lg p-6">
          <div className="flex justify-between mb-2">
            <h2 className="text-xl font-bold">Progress to $1M ARR</h2>
            <span className="text-xl font-bold">{progress.toFixed(1)}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className="bg-blue-500 rounded-full h-4" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-gray-600">Current</div>
              <div className="text-2xl font-bold">${arr.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-600">Remaining</div>
              <div className="text-2xl font-bold">${(targetArr - arr).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-600">Goal</div>
              <div className="text-2xl font-bold">${targetArr.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
