import { Outlet } from 'react-router-dom';
import Navbar from './NavBar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;