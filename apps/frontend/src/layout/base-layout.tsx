import { Outlet } from 'react-router-dom';
import { Header } from '../components/header';
import { Footer } from '../components/footer';

export const BaseLayout = () => {
  return (
    <div className="flex h-screen flex-col bg-[#502c7e]">
      <Header />

      <div className="flex-1 relative">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
