import React from 'react';

const SearchIcon = ({searchQuery}) => {
  function handleSearch(e){
    e.preventDefault()

  }
  return (
    <div key={9} id='search-icon' className="absolute right-0 -translate-y-[50%] top-[50%] z-50  ">
      <button
      onClick={handleSearch}
        type="submit"
        className="inline-flex aspect-square w-10 items-center justify-center text-neutral-500 hover:text-neutral-700 focus:text-neutral-700 group-invalid:pointer-events-none group-invalid:opacity-80"
      >
        <span className="sr-only">search</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-search h-5 w-5"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
      </button>
    </div>
  );
};

export default SearchIcon;
