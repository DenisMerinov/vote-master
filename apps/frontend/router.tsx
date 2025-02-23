import { createBrowserRouter } from 'react-router-dom';
import { BaseLayout } from './src/layout/base-layout';
import { HomePage } from './src/pages/home';
import { SettingPage } from './src/pages/setting';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/setting', element: <SettingPage /> },
    ],
  },
]);
