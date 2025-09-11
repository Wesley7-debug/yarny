import { useState } from "react";
import { Search } from "lucide-react";

const SearchInput = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim() !== "") {
      onSearch(query);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-4 pr-10 py-2 ring-2 rounded-2xl border border-base-300 bg-base-100 text-sm outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        onClick={handleSearch}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-primary"
      >
        <Search className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SearchInput;
