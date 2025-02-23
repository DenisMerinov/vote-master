import { createContext, useState, ReactNode } from 'react';

export const SearchContext = createContext<{
  search: string;
  setSearch: (search: string) => void;
}>({
  search: '',
  setSearch: () => {},
});

// Провайдер контекста
export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [search, setSearch] = useState<string>('');

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  );
};
