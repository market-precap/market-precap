'use client';

import dynamic from 'next/dynamic';

const GannSquareOf9 = dynamic(() => import('@/components/calculators/GannSquareOf9'), {
  ssr: false
});

export default function CalculatorWrapper() {
  return (
    <>
      <GannSquareOf9 />
      
      {/* Additional Resources Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            How to Use
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-600 dark:text-gray-400">
            <li>Enter the current price of your asset in the input field</li>
            <li>Click the &quot;Calculate Levels&quot; button</li>
            <li>Review the support and resistance levels generated</li>
            <li>Use these levels as potential price targets or reversal points</li>
          </ol>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Trading Tips
          </h2>
          <ul className="list-disc list-inside space-y-3 text-gray-600 dark:text-gray-400">
            <li>Look for price convergence near Gann angles</li>
            <li>Combine with other technical indicators for confirmation</li>
            <li>Use multiple timeframes for better accuracy</li>
            <li>Consider market context and trend direction</li>
          </ul>
        </div>
      </div>
    </>
  );
}
