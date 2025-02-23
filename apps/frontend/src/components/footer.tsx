import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

export const Footer = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex justify-between h-12 bg-[#F7F4FB] rounded-t-xl">
      <Link
        to="/"
        className={cn(
          '  px-4 py-1  w-1/2 flex justify-center items-center rounded-tl-xl text-black',
          pathname === '/' && 'bg-[#2A2C79] border text-[#F7F4FB]'
        )}
      >
        Голосование
      </Link>
      <Link
        to="/setting"
        className={cn(
          ' px-4 py-1  w-1/2 flex justify-center items-center  rounded-tr-xl text-black',
          pathname === '/setting' && 'bg-[#2A2C79] border text-[#F7F4FB]'
        )}
      >
        Настройки
      </Link>
    </div>
  );
};
