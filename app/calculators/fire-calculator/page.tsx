import type { Metadata } from 'next';
import Link from 'next/link';
import FireCalculator from '@/components/calculators/FireCalculator';

export const metadata: Metadata = {
    title: 'FIRE Number Calculator | Financial Independence Retire Early',
    description: 'Calculate your FIRE number and see when you can retire early based on your savings and expenses.',
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
                            FIRE Number Calculator
                        </li>
                    </ol>
                </nav>

                {/* Client Component */}
                <div className="max-w-4xl mx-auto">
                    <div className="mb-12">
                        <FireCalculator />
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What is FIRE?</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            FIRE stands for Financial Independence, Retire Early. It is a movement of people dedicated to a program of extreme savings and investment that allows them to retire far earlier than traditional budgets and retirement plans would permit.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">The 4% Rule</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            A common rule of thumb for FIRE is the &quot;4% Rule,&quot; which states that if you can live on 4% of your portfolio in the first year of retirement, and adjust that amount for inflation in subsequent years, your money has a very high probability of lasting 30 years or more.
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                            To find your FIRE number based on the 4% rule, simply multiply your annual expenses by 25.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
