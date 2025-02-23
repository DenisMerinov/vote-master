import { RouterProvider } from 'react-router-dom';
import { router } from '../../router';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { SearchProvider } from '../provider/searchProvider';
import { useEffect } from 'react';
import WebApp from '@twa-dev/sdk';

export function App() {
  useEffect(() => {
    WebApp.disableVerticalSwipes();
  }, []);

  return (
    <div>
      <Provider store={store}>
        <SearchProvider>
          <RouterProvider router={router} />
        </SearchProvider>
      </Provider>
    </div>
  );
}

export default App;
