import React, { useState } from "react";
import { Search } from "lucide-react";
import "./styles.css";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Dispatch custom event with search query
    window.dispatchEvent(new CustomEvent("searchMovie", { detail: query }));
  };

  return (
    <div className="relative  w-full max-w-md">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Rechercher..."
        className="w-full rounded-md border border-border bg-background py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-accent"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
    </div>
  );
};

export default SearchBar;
