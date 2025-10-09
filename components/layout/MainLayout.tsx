'use client';

import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 pb-8 px-4">
        <div className="container mx-auto">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
