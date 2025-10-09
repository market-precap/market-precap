'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';

// Type definitions
interface GannLevel {
  price: number;
  angle: number;
  type: 'support' | 'resistance' | 'angular' | 'current';
  timeFrame?: number;
  significance?: number;
  expectedTime?: string;
  volumeThreshold?: number;
  pattern?: string;
}

interface GannRecommendation {
  buyEntry: number;
  buyTargets: number[];
  buyStoploss: number;
  sellEntry: number;
  sellTargets: number[];
  sellStoploss: number;
  volumeProfile: {
    threshold: number;
    timeframe: string;
  };
  patterns: {
    bullish: string[];
    bearish: string[];
  };
}

// Constants for 15-min timeframe optimization
const timeFrames = [15, 30, 45, 60];
const tradingStartTime = { hour: 9, minute: 15 };
const marketEndTime = { hour: 15, minute: 30 };
const candlePatterns = {
  bullish: ['Hammer', 'Morning Star', 'Bullish Engulfing', 'Three White Soldiers'],
  bearish: ['Shooting Star', 'Evening Star', 'Bearish Engulfing', 'Three Black Crows']
};

// Helper functions
const formatTime = (hour: number, minute: number, addMinutes: number): string => {
  const totalMinutes = hour * 60 + minute + addMinutes;
  const newHour = Math.floor(totalMinutes / 60);
  const newMinute = totalMinutes % 60;
  return `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`;
};

// Square of 9 helper functions
const squareOf9Level = (basePrice: number, degree: number): number => {
  const root = Math.sqrt(basePrice);
  const newPrice = Math.pow(root + (degree / 360), 2);
  return +newPrice.toFixed(2);
};

const squareOf9LevelDown = (basePrice: number, degree: number): number => {
  const root = Math.sqrt(basePrice);
  const newPrice = Math.pow(root - (degree / 360), 2);
  return +newPrice.toFixed(2);
};

// Helper function to calculate volume threshold based on price
const calculateVolumeThreshold = (price: number): number => {
  // Basic volume threshold calculation:
  // Higher the price, lower the required volume for confirmation
  const baseVolume = 100000; // Base volume of 100K
  const priceMultiplier = Math.max(1, Math.floor(1000 / price));
  return baseVolume * priceMultiplier;
};

// Main calculation function using Gann degrees
const computeGannLevelsRefined = (currentPrice: number): GannRecommendation => {
  // Define Gann degrees with finer increments for more precise levels
  const stepDegrees = [22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180];
  
  // Initialize arrays for buy and sell levels
  const buyLevels: number[] = [];
  const sellLevels: number[] = [];

  // Dynamic range calculation based on price
  const getMaxRange = (price: number): number => {
    // Lower percentage range for higher prices
    if (price > 1000) return 0.02; // 2%
    if (price > 500) return 0.025; // 2.5%
    return 0.03; // 3%
  };

  const maxRange = getMaxRange(currentPrice);
  
  // Calculate levels for each degree with increased precision
  stepDegrees.forEach(degree => {
    const buyLevel = squareOf9Level(currentPrice, degree);
    const sellLevel = squareOf9LevelDown(currentPrice, degree);
    
    // Add buy levels above current price with dynamic range
    if (buyLevel > currentPrice && 
        buyLevel <= currentPrice * (1 + maxRange)) {
      buyLevels.push(buyLevel);
    }
    
    // Add sell levels below current price with dynamic range
    if (sellLevel < currentPrice && 
        sellLevel >= currentPrice * (1 - maxRange)) {
      sellLevels.push(sellLevel);
    }
  });
  
  // If no levels found with initial range, try with expanded range
  if (buyLevels.length === 0 || sellLevels.length === 0) {
    stepDegrees.forEach(degree => {
      const buyLevel = squareOf9Level(currentPrice, degree);
      const sellLevel = squareOf9LevelDown(currentPrice, degree);
      
      // Add buy levels with expanded range
      if (buyLevel > currentPrice && 
          buyLevel <= currentPrice * (1 + maxRange * 1.5) &&
          !buyLevels.includes(buyLevel)) {
        buyLevels.push(buyLevel);
      }
      
      // Add sell levels with expanded range
      if (sellLevel < currentPrice && 
          sellLevel >= currentPrice * (1 - maxRange * 1.5) &&
          !sellLevels.includes(sellLevel)) {
        sellLevels.push(sellLevel);
      }
    });
  }
  
  // Sort levels appropriately
  buyLevels.sort((a, b) => a - b);  // ascending
  sellLevels.sort((a, b) => b - a);  // descending
  
  // If still no levels found, use default percentage-based levels
  const buyEntry = buyLevels[0] || currentPrice * (1 + 0.005); // 0.5% above
  const sellEntry = sellLevels[0] || currentPrice * (1 - 0.005); // 0.5% below
  
  // Generate targets based on available levels or percentage increments
  const generateTargets = (basePrice: number, isUp: boolean, count: number): number[] => {
    const targets: number[] = [];
    const increment = basePrice * 0.005; // 0.5% increments
    
    for (let i = 1; i <= count; i++) {
      targets.push(basePrice * (1 + (isUp ? 1 : -1) * (i * 0.005)));
    }
    
    return targets;
  };

  // Get targets (next 3 levels)
  const buyTargets = buyLevels.slice(1, 4).length ? 
    buyLevels.slice(1, 4) : 
    generateTargets(buyEntry, true, 3);
  
  const sellTargets = sellLevels.slice(1, 4).length ?
    sellLevels.slice(1, 4) :
    generateTargets(sellEntry, false, 3);
  
  // Calculate stop-loss levels with tighter ranges for higher prices
  const stopLossPercentage = currentPrice > 1000 ? 0.003 : 
                            currentPrice > 500 ? 0.004 : 
                            0.005;
                            
  const buyStoploss = Math.min(sellEntry, currentPrice * (1 - stopLossPercentage));
  const sellStoploss = Math.max(buyEntry, currentPrice * (1 + stopLossPercentage));
  
  // Stoploss levels (optimized for 15-min)
  // Calculate volume threshold
  const volumeThreshold = calculateVolumeThreshold(currentPrice);
  
  return {
    buyEntry,
    buyTargets,
    buyStoploss,
    sellEntry,
    sellTargets,
    sellStoploss,
    volumeProfile: {
      threshold: volumeThreshold,
      timeframe: '15min'
    },
    patterns: {
      bullish: candlePatterns.bullish,
      bearish: candlePatterns.bearish
    }
  };
};

// Main component
const GannSquareOf9 = () => {
  // Add SEO meta title and description
  useEffect(() => {
    // Update page metadata
    document.title = 'Gann Square of 9 Calculator | Professional Trading Tool';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Professional Gann Square of 9 calculator for intraday trading. Calculate support, resistance levels, and get trading recommendations based on W.D. Gann\'s mathematical principles.');
    }
  }, []);

  const [price, setPrice] = useState<string>('');
  const [levels, setLevels] = useState<GannLevel[]>([]);
  const [recommendation, setRecommendation] = useState<GannRecommendation | null>(null);

  // Debounced price calculation
  const debouncedCalculate = useCallback(
    (priceValue: string) => {
      const numPrice = parseFloat(priceValue);
      if (!isNaN(numPrice) && numPrice > 0) {
        const newLevels = calculateGannLevels(numPrice);
        setLevels(newLevels);
      } else {
        setLevels([]);
        setRecommendation(null);
      }
    },
    []
  );

  // Effect to handle debounced calculations
  useEffect(() => {
    const timer = setTimeout(() => {
      if (price) {
        debouncedCalculate(price);
      }
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [price, debouncedCalculate]);
  const calculateGannLevels = (basePrice: number): GannLevel[] => {
    const recommendation = computeGannLevelsRefined(basePrice);
    setRecommendation(recommendation);
    
    const getCurrentMarketTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      if (hour < tradingStartTime.hour || 
          (hour === tradingStartTime.hour && minute < tradingStartTime.minute) ||
          hour > marketEndTime.hour ||
          (hour === marketEndTime.hour && minute > marketEndTime.minute)) {
        return tradingStartTime;
      }
      return { hour, minute };
    };

    const currentTime = getCurrentMarketTime();
    
    const newLevels = [
      // Buy levels with enhanced metadata
      ...recommendation.buyTargets.map((price, idx) => ({
        price,
        angle: (idx + 2) * 45,
        type: 'resistance' as const,
        timeFrame: timeFrames[idx],
        expectedTime: formatTime(currentTime.hour, currentTime.minute, timeFrames[idx]),
        volumeThreshold: recommendation.volumeProfile.threshold,
        pattern: recommendation.patterns.bullish[idx % recommendation.patterns.bullish.length],
        significance: 1 - (idx * 0.2) // Decreasing significance for each level
      })),
      // Sell levels with enhanced metadata
      ...recommendation.sellTargets.map((price, idx) => ({
        price,
        angle: 360 - (idx + 2) * 45,
        type: 'support' as const,
        timeFrame: timeFrames[idx],
        expectedTime: formatTime(currentTime.hour, currentTime.minute, timeFrames[idx]),
        volumeThreshold: recommendation.volumeProfile.threshold,
        pattern: recommendation.patterns.bearish[idx % recommendation.patterns.bearish.length],
        significance: 1 - (idx * 0.2) // Decreasing significance for each level
      }))
    ].sort((a, b) => a.price - b.price);

    return newLevels;
  };

  const resultsSection = useMemo(() => {
    if (levels.length === 0 || !recommendation) return null;

    return (
      <div className="mt-8 space-y-8">
        {/* Recommendations Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
            Trading Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buy Setup Card */}
            <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4 border-l-4 border-green-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-green-700 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-green-800 dark:text-green-300">
                  Buy Setup
                </h4>
              </div>
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded p-3 border border-green-200 dark:border-green-900">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Entry Signal (15m)</div>
                  <div className="text-xl font-semibold text-green-700 dark:text-green-400">
                    ₹{recommendation.buyEntry.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Wait for 15m close above this level</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Intraday Targets</div>
                  <div className="grid grid-cols-2 gap-2">
                    {recommendation.buyTargets.map((target, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 rounded p-2 border border-green-200 dark:border-green-900">
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                          Target {index + 1} ({timeFrames[index]} min)
                        </div>
                        <div className="text-green-700 dark:text-green-400 font-medium">₹{target.toFixed(2)}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {(((target - recommendation.buyEntry) / recommendation.buyEntry) * 100).toFixed(2)}% move
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Expected: {formatTime(9, 15, timeFrames[index])}
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          Watch for: {candlePatterns.bullish[index % candlePatterns.bullish.length]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/10 rounded p-3 border border-red-200 dark:border-red-900">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Intraday Stop Loss</div>
                  <div className="text-lg font-medium text-red-600 dark:text-red-400">
                    ₹{recommendation.buyStoploss.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Risk: {(((recommendation.buyEntry - recommendation.buyStoploss) / recommendation.buyEntry) * 100).toFixed(2)}% | Golden Ratio Based
                  </div>
                </div>
              </div>
            </div>

            {/* Sell Setup Card */}
            <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4 border-l-4 border-red-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-red-700 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-red-800 dark:text-red-300">
                  Sell Setup
                </h4>
              </div>
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded p-3 border border-red-200 dark:border-red-900">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Entry Signal (15m)</div>
                  <div className="text-xl font-semibold text-red-700 dark:text-red-400">
                    ₹{recommendation.sellEntry.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Wait for 15m close below this level</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Intraday Targets</div>
                  <div className="grid grid-cols-2 gap-2">
                    {recommendation.sellTargets.map((target, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 rounded p-2 border border-red-200 dark:border-red-900">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Target {index + 1} ({timeFrames[index]} min)
                        </div>
                        <div className="text-red-700 dark:text-red-400 font-medium">₹{target.toFixed(2)}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {(((recommendation.sellEntry - target) / recommendation.sellEntry) * 100).toFixed(2)}% move
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Expected: {formatTime(9, 15, timeFrames[index])}
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          Watch for: {candlePatterns.bearish[index % candlePatterns.bearish.length]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/10 rounded p-3 border border-green-200 dark:border-green-900">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Intraday Stop Loss</div>
                  <div className="text-lg font-medium text-green-600 dark:text-green-400">
                    ₹{recommendation.sellStoploss.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Risk: {(((recommendation.sellStoploss - recommendation.sellEntry) / recommendation.sellEntry) * 100).toFixed(2)}% | Golden Ratio Based
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trading Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-3">
            How to Use These Levels
          </h4>
          <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Wait for a 15-minute candle close above/below the entry level before taking a position
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Volume should exceed the threshold for valid breakouts/breakdowns
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Look for suggested candlestick patterns at each level for confirmation
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Maintain strict stop-losses within 0.5% for intraday trades
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Take partial profits at each target level to reduce risk
            </li>
          </ul>
        </div>
      </div>
    );
  }, [levels, recommendation]);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header with semantic meta information */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white" id="gann-calculator-title">
            Gann Square of 9 Calculator for Intraday Trading
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Calculate precise Gann Square of 9 levels, support/resistance zones, and intraday trading recommendations based on W.D. Gann's mathematical principles.
          </p>
          {/* Meta description for SEO */}
          <div className="hidden">
            <span itemScope itemType="https://schema.org/FinancialProduct">
              <meta itemProp="name" content="Gann Square of 9 Calculator" />
              <meta itemProp="description" content="Professional Gann Square of 9 calculator for intraday trading. Get real-time support, resistance levels, and trading recommendations based on W.D. Gann's mathematical principles." />
              <meta itemProp="category" content="Trading Tool" />
              <meta itemProp="audience" content="Day Traders, Technical Analysts" />
            </span>
          </div>
        </div>

        {/* Input Section with ARIA labels and semantic markup */}
        <div className="mb-6" role="form" aria-labelledby="price-input-label">
          <label id="price-input-label" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter Stock Price for Gann Analysis
          </label>
          <Input
            type="number"
            placeholder="Enter price value..."
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full max-w-sm"
            aria-label="Enter stock price for Gann Square of 9 analysis"
            aria-describedby="price-input-help" />
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Enter a price to see Gann levels and targets automatically
          </div>
        </div>

        {/* Results Section with semantic markup */}
        <section aria-label="Gann Calculator Results" role="region">
          {resultsSection}
        </section>

        {/* Quick Trading Instructions with semantic markup */}
        <section 
          aria-label="Trading Instructions" 
          role="complementary" 
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg p-6 mb-8"
          itemScope 
          itemType="https://schema.org/HowTo">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">
            Quick Trading Guide
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium text-blue-700 dark:text-blue-300 mb-2">
                Entry Rules
              </h4>
              <ul className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Wait for 15-minute candle close above/below entry level
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Confirm with suggested candlestick patterns
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Check volume threshold before entry
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-medium text-blue-700 dark:text-blue-300 mb-2">
                Risk Management
              </h4>
              <ul className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Place stop-loss immediately after entry
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Book 50% profits at first target
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Trail stop-loss after second target
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </Card>
  );
};

export default GannSquareOf9;
