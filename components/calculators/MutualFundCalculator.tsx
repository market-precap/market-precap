'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';

interface CalculatorResult {
    investedAmount: number;
    estReturns: number;
    totalValue: number;
}

const MutualFundCalculator = () => {
    const [investmentType, setInvestmentType] = useState<'sip' | 'lumpsum'>('sip');
    const [totalInvestment, setTotalInvestment] = useState<string>('5000');
    const [returnRate, setReturnRate] = useState<string>('12');
    const [timePeriod, setTimePeriod] = useState<string>('10');
    const [result, setResult] = useState<CalculatorResult | null>(null);

    const calculateReturns = useCallback(() => {
        const amount = parseFloat(totalInvestment);
        const rate = parseFloat(returnRate);
        const years = parseFloat(timePeriod);

        if (isNaN(amount) || isNaN(rate) || isNaN(years) || amount <= 0 || rate <= 0 || years <= 0) {
            return;
        }

        let investedAmount = 0;
        let totalValue = 0;

        if (investmentType === 'lumpsum') {
            investedAmount = amount;
            totalValue = amount * Math.pow(1 + rate / 100, years);
        } else {
            // SIP Calculation
            // M * [ (1+i)^n - 1 ] / i * (1+i)
            const monthlyRate = rate / 12 / 100;
            const months = years * 12;
            investedAmount = amount * months;
            totalValue = amount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
        }

        setResult({
            investedAmount,
            estReturns: totalValue - investedAmount,
            totalValue,
        });
    }, [investmentType, totalInvestment, returnRate, timePeriod]);

    useEffect(() => {
        calculateReturns();
    }, [calculateReturns]);

    // Donut Chart SVG
    const chartData = useMemo(() => {
        if (!result) return null;
        const total = result.totalValue;
        const investedPercent = (result.investedAmount / total) * 100;
        const returnsPercent = (result.estReturns / total) * 100;

        // SVG Dash array calculation for circle
        // Circumference = 2 * pi * r. Let r=40 (viewbox 100x100). C ~ 251.2
        // const radius = 15.9155; // Radius for circumference of 100
        // const circumference = 100;

        return {
            investedOffset: 0,
            investedDash: `${investedPercent} ${100 - investedPercent}`,
            returnsOffset: -investedPercent, // Start where invested ends
            returnsDash: `${returnsPercent} ${100 - returnsPercent}`,
            investedPercent,
            returnsPercent
        };
    }, [result]);

    return (
        <Card className="p-6">
            <div className="space-y-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Mutual Fund Returns Calculator
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Calculate the future value of your SIP or Lumpsum mutual fund investments.
                    </p>
                </div>

                {/* Investment Type Toggle */}
                <div className="flex bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg w-max mb-6">
                    <button
                        onClick={() => setInvestmentType('sip')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${investmentType === 'sip'
                            ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        SIP
                    </button>
                    <button
                        onClick={() => setInvestmentType('lumpsum')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${investmentType === 'lumpsum'
                            ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-200 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        Lumpsum
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <Input
                                label={investmentType === 'sip' ? 'Monthly Investment' : 'Total Investment'}
                                type="number"
                                value={totalInvestment}
                                onChange={(e) => setTotalInvestment(e.target.value)}
                                placeholder="5000"
                                leftIcon={<span className="text-gray-500">₹</span>}
                            />
                            <Input
                                label="Expected Return Rate (p.a)"
                                type="number"
                                value={returnRate}
                                onChange={(e) => setReturnRate(e.target.value)}
                                placeholder="12"
                                rightIcon={<span className="text-gray-500">%</span>}
                            />
                            <Input
                                label="Time Period (Years)"
                                type="number"
                                value={timePeriod}
                                onChange={(e) => setTimePeriod(e.target.value)}
                                placeholder="10"
                                rightIcon={<span className="text-gray-500">Yr</span>}
                            />
                        </div>

                        {/* Slider Interactions could go here for better UX in future */}
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 flex flex-col items-center justify-center">
                        {result && chartData && (
                            <div className="w-full">
                                {/* Chart Area */}
                                <div className="flex justify-center mb-8 relative">
                                    <svg viewBox="0 0 42 42" className="w-48 h-48">
                                        <circle
                                            className="text-gray-200 dark:text-gray-700 stroke-current"
                                            strokeWidth="5"
                                            cx="21"
                                            cy="21"
                                            r="15.9155"
                                            fill="transparent"
                                        ></circle>
                                        {/* Invested Circle - Blue */}
                                        <circle
                                            className="text-blue-500 stroke-current transition-all duration-1000 ease-out"
                                            strokeWidth="5"
                                            strokeDasharray={chartData.investedDash}
                                            strokeDashoffset={chartData.investedOffset + 25} // Rotate to start from top
                                            cx="21"
                                            cy="21"
                                            r="15.9155"
                                            fill="transparent"
                                        ></circle>
                                        {/* Returns Circle - Green */}
                                        <circle
                                            className="text-green-500 stroke-current transition-all duration-1000 ease-out"
                                            strokeWidth="5"
                                            strokeDasharray={chartData.returnsDash}
                                            strokeDashoffset={chartData.returnsOffset + 25}
                                            cx="21"
                                            cy="21"
                                            r="15.9155"
                                            fill="transparent"
                                        ></circle>
                                    </svg>
                                </div>

                                {/* Stats */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                            <span className="text-gray-600 dark:text-gray-400">Invested Amount</span>
                                        </div>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(result.investedAmount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                            <span className="text-gray-600 dark:text-gray-400">Est. Returns</span>
                                        </div>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(result.estReturns)}
                                        </span>
                                    </div>
                                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400 font-medium">Total Value</span>
                                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(result.totalValue)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default MutualFundCalculator;
