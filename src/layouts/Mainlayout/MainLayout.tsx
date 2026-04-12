import { Outlet } from 'react-router-dom';
import Navbar from './NavBar';
import Footer from '@/features/landing/components/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;