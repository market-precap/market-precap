'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface FireResult {
    fireNumber: number;
    yearsToFire: number;
    ageAtFire?: number;
}

const FireCalculator = () => {
    const [expenses, setExpenses] = useState<string>('50000');
    const [savings, setSavings] = useState<string>('100000');
    const [contribution, setContribution] = useState<string>('20000');
    const [withdrawalRate, setWithdrawalRate] = useState<string>('4');
    const [returnRate, setReturnRate] = useState<string>('7');
    const [currentAge, setCurrentAge] = useState<string>('30');
    const [inflation, setInflation] = useState<string>('3');
    const [result, setResult] = useState<FireResult | null>(null);

    const calculateFire = () => {
        const annualExpenses = parseFloat(expenses);
        const currentSavings = parseFloat(savings);
        const annualContribution = parseFloat(contribution);
        const safeWithdrawalRate = parseFloat(withdrawalRate) / 100;
        const annualReturn = parseFloat(returnRate) / 100;
        const inflationRate = parseFloat(inflation) / 100;
        const age = parseFloat(currentAge);

        if (
            isNaN(annualExpenses) ||
            isNaN(currentSavings) ||
            isNaN(annualContribution) ||
            isNaN(safeWithdrawalRate) ||
            isNaN(annualReturn) ||
            isNaN(inflationRate) ||
            safeWithdrawalRate <= 0
        ) {
            return;
        }

        // FIRE Number adjusted for inflation is tricky because it depends on when you retire.
        // The standard rule is simply Expenses / SWR.
        // However, we should account for real return (Nominal Return - Inflation) to keep it in today's dollars.

        // Real Return Rate
        const realReturn = (1 + annualReturn) / (1 + inflationRate) - 1;

        const fireNumber = annualExpenses / safeWithdrawalRate;

        let portfolio = currentSavings;
        let years = 0;

        // Safety break to prevent infinite loops
        while (portfolio < fireNumber && years < 100) {
            portfolio = portfolio * (1 + realReturn) + annualContribution;
            years++;
        }

        if (years >= 100) {
            // Technically never reached in reasonable time
            setResult({
                fireNumber,
                yearsToFire: 100, // Cap at 100+
                ageAtFire: age ? age + 100 : undefined
            });
        } else {
            setResult({
                fireNumber,
                yearsToFire: years,
                ageAtFire: !isNaN(age) ? age + years : undefined,
            });
        }
    };

    useEffect(() => {
        calculateFire();
    }, [expenses, savings, contribution, withdrawalRate, returnRate, currentAge, inflation]);

    return (
        <Card className="p-6">
            <div className="space-y-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        FIRE Number Calculator
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Calculate your Financial Independence, Retire Early (FIRE) number and see how long it will take to reach financial freedom.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Input
                            label="Current Age"
                            type="number"
                            value={currentAge}
                            onChange={(e) => setCurrentAge(e.target.value)}
                            placeholder="30"
                        />
                        <Input
                            label="Annual Expenses"
                            type="number"
                            value={expenses}
                            onChange={(e) => setExpenses(e.target.value)}
                            placeholder="50000"
                            helperText="Estimated annual spending in retirement"
                        />
                        <Input
                            label="Current Savings"
                            type="number"
                            value={savings}
                            onChange={(e) => setSavings(e.target.value)}
                            placeholder="100000"
                            helperText="Total value of current investments"
                        />
                        <Input
                            label="Annual Contribution"
                            type="number"
                            value={contribution}
                            onChange={(e) => setContribution(e.target.value)}
                            placeholder="20000"
                            helperText="How much you save/invest per year"
                        />
                    </div>
                    <div className="space-y-4">
                        <Input
                            label="Safe Withdrawal Rate (%)"
                            type="number"
                            value={withdrawalRate}
                            onChange={(e) => setWithdrawalRate(e.target.value)}
                            placeholder="4"
                            step="0.1"
                            helperText="Standard is 4%"
                        />
                        <Input
                            label="Expected Annual Return (%)"
                            type="number"
                            value={returnRate}
                            onChange={(e) => setReturnRate(e.target.value)}
                            placeholder="7"
                            step="0.1"
                        />
                        <Input
                            label="Expected Inflation Rate (%)"
                            type="number"
                            value={inflation}
                            onChange={(e) => setInflation(e.target.value)}
                            placeholder="3"
                            step="0.1"
                        />
                    </div>
                </div>

                {result && (
                    <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Results</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">FIRE Number</p>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(result.fireNumber)}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">Target portfolio value</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Years to FIRE</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {result.yearsToFire >= 100 ? '100+' : result.yearsToFire} <span className="text-base font-normal text-gray-500">Years</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Age at FIRE</p>
                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                    {result.ageAtFire && result.yearsToFire < 100 ? result.ageAtFire : 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
                            <p>
                                Calculated using {withdrawalRate}% withdrawal rate and inflation-adjusted return of {(((1 + parseFloat(returnRate) / 100) / (1 + parseFloat(inflation) / 100) - 1) * 100).toFixed(2)}%.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default FireCalculator;
