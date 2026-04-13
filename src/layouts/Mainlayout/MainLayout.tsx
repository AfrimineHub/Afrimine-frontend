import { Outlet } from 'react-router-dom';
import Navbar from '@/shared/components/NavBar';
import Footer from '@/shared/components/Footer';

const MainLayout = () => {
  return (
    <div className="flex min-h-0 min-h-dvh w-full flex-1 flex-col bg-[#F9FAFB]">
      <Navbar />
      <main className="flex min-h-0 w-full min-w-0 flex-1 flex-col [&>*]:min-h-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;