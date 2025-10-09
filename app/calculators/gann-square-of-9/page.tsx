import type { Metadata } from 'next';
import Link from 'next/link';
import CalculatorClientWrapper from './calculator';

export const metadata: Metadata = {
  title: 'Gann Square of 9 Calculator | Market Precap',
  description: 'Use our free Gann Square of 9 calculator to find potential support and resistance levels in the market.',
};

export default function Page() {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">
                Home
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link href="/calculators" className="hover:text-gray-700 dark:hover:text-gray-300">
                Calculators
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-700 dark:text-gray-300">
              Gann Square of 9
            </li>
          </ol>
        </nav>
        
        {/* Client Component */}
        <div>
          <div className="mb-12">
            <CalculatorClientWrapper />
          </div>

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
        </div>
      </div>
    </div>
  );
}
