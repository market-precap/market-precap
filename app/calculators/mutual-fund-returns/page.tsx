import type { Metadata } from 'next';
import Link from 'next/link';
import MutualFundCalculator from '@/components/calculators/MutualFundCalculator';

export const metadata: Metadata = {
    title: 'Mutual Fund Returns Calculator | SIP & Lumpsum',
    description: 'Calculate the estimated returns on your Mutual Fund SIP and Lumpsum investments. Check total value and wealth gained over time.',
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
                            Mutual Fund Returns
                        </li>
                    </ol>
                </nav>

                {/* Client Component */}
                <div className="max-w-4xl mx-auto">
                    <div className="mb-12">
                        <MutualFundCalculator />
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mutual Fund SIP & Lumpsum Calculator</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">What is SIP?</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    A Systematic Investment Plan (SIP) allows you to invest a fixed amount regularly in a mutual fund scheme. It instills financial discipline and helps differ rupee cost averaging.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">What is Lumpsum?</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    A Lumpsum investment is a one-time investment of a significant amount. It&apos;s ideal when you have a large disposable amount to invest at once.
                                </p>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">How returns are calculated?</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            This calculator uses the compound interest formula for Lumpsum and monthly compounding annuity formula for SIP investments.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
