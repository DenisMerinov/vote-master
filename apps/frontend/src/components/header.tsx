import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { SearchContext } from '../provider/searchProvider';

export const Header = () => {
  const { search, setSearch } = useContext(SearchContext);

  return (
    <div className="flex items-stretch flex-col px-6 py-2">
      <label className="relative">
        <input
          type="text"
          placeholder="Поиск"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 rounded-full px-4"
        />
      </label>
    </div>
  );
};
