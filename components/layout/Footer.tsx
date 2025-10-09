'use client';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Market Precap is your premier destination for advanced technical analysis tools and real-time market insights. We specialize in providing sophisticated trading calculators based on time-tested methodologies like Gann, Fibonacci, and more.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 dark:text-gray-300">Email: marketprecap@gmail.com</li>
              {/* <li className="text-gray-600 dark:text-gray-300">Phone: (123) 456-7890</li> */}
              <li className="text-gray-600 dark:text-gray-300">Made in India 🇮🇳</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://x.com/MarketPrecap" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Twitter
              </a>
              <a href="https://www.linkedin.com/in/market-precap/" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                LinkedIn
              </a>
              <a href="https://www.instagram.com/marketprecap/" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Instagram
              </a>
            </div>
            <div className="pt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Built with ❤️ for Traders
              </span>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-gray-600 dark:text-gray-300">
            © {new Date().getFullYear()} Market Precap. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
