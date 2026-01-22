import { useLocation } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import SearchPage from "../../views/SearchPage/SearchPage";
import FilterSidebar from "../../pages/FilterSidebar/FilterSidebar";

const SearchLayout = () => {
  const { search } = useLocation();
  const filtersFromUrl = useMemo(() => {
    const params = new URLSearchParams(search);
    return Object.fromEntries(params.entries());
  }, [search]);

  const EMPTY_FILTERS = {
    categoryId: "",
    brandId: "",
    occasionId: "",
    minPrice: "",
    maxPrice: "",
    color: "",
    size: "",
    name: "",
  };

  const [filters, setFilters] = useState(EMPTY_FILTERS);

  useEffect(() => {
    setFilters(filtersFromUrl);
  }, [filtersFromUrl]);

  return (
    <div className="py-18">
      <SearchPage />
      <FilterSidebar filters={filters} setFilters={setFilters} />
    </div>
  );
};

export default SearchLayout;
