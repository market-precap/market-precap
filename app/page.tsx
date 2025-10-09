import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Market Precap Tools
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Professional-grade market analysis tools to help you make better trading decisions.
        </p>
      </section>

      {/* Calculators Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Trading Calculators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Gann Square Calculator Card */}
          <Link
            href="/calculators/gann-square-of-9"
            className="group block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                Gann Square of 9 Calculator
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Calculate support and resistance levels using W.D. Gann&apos;s Square of 9 technique.
              </p>
              <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400">
                <span>Try Calculator</span>
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>

          {/* Placeholder for future calculators */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-400 dark:text-gray-500 mb-2">
                More Calculators Coming Soon
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                We&apos;re working on adding more trading calculators and tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Why Choose Our Tools?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Professional Grade
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Built with precision and accuracy for professional traders.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Easy to Use
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Intuitive interface designed for both beginners and experts.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Always Free
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Access all our tools without any cost or subscription.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
