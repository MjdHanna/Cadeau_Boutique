import { memo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  useGetCategoriesQuery,
  useGetBrandsQuery,
  useGetOccasionsQuery,
} from "../../redux/features/apiSlice";
import FilterTextField from "../../components/form/FilterTextField/FilterTextField";
import useDebounce from "../../hooks/useDebounce";

const FilterSidebar = ({ filters, setFilters }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();

  const { data: categories } = useGetCategoriesQuery();
  const { data: brands } = useGetBrandsQuery();
  const { data: occasions } = useGetOccasionsQuery();

  const [searchDraft, setSearchDraft] = useState(filters.name || "");
  const debouncedSearch = useDebounce(searchDraft, 600);
  useEffect(() => {
    if (debouncedSearch.length >= 3 || debouncedSearch === "") {
      applyFilters({ ...filters, name: debouncedSearch });
    }
  }, [debouncedSearch]);

  const applyFilters = (updatedFilters) => {
    setFilters(updatedFilters);

    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });

    navigate(`/search?${params.toString()}`);
  };

  const handleChange = (key, value) => {
    applyFilters({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    const cleared = {
      categoryId: "",
      brandId: "",
      occasionId: "",
      minPrice: "",
      maxPrice: "",
      color: "",
      size: "",
      name: "",
    };
    setSearchDraft("");
    applyFilters(cleared);
  };

  const Chip = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full border text-sm transition ${
        active
          ? "bg-primary text-white border-primary"
          : "bg-white hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full flex justify-center px-4 my-10">
      <aside
        dir={isRTL ? "rtl" : "ltr"}
        className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-7xl space-y-10 mt-10"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t("Filters")}</h2>
          <button
            onClick={resetFilters}
            className="text-sm text-gray-500 hover:underline"
          >
            {t("Reset")}
          </button>
        </div>
        <section className="max-w-md">
          <FilterTextField
            label="Search"
            value={searchDraft}
            placeholder={t("Search products")}
            onChange={setSearchDraft}
          />
          {searchDraft.length > 0 && searchDraft.length < 3 && (
            <p className="text-sm text-gray-400 mt-1">
              {t("Type at least 3 characters")}
            </p>
          )}
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* CATEGORY */}
          <section>
            <h3 className="font-semibold mb-3">{t("Category")}</h3>
            <div className="flex flex-wrap gap-2">
              {categories?.data?.map((c) => (
                <Chip
                  key={c.categoryId}
                  active={filters.categoryId === c.categoryId}
                  onClick={() =>
                    handleChange(
                      "categoryId",
                      filters.categoryId === c.categoryId ? "" : c.categoryId,
                    )
                  }
                >
                  {isRTL ? c.categoryNameArabic : c.categoryNameEnglish}
                </Chip>
              ))}
            </div>
          </section>

          {/* BRAND */}
          <section>
            <h3 className="font-semibold mb-3">{t("Brand")}</h3>
            <div className="flex flex-wrap gap-2">
              {brands?.data?.map((b) => (
                <Chip
                  key={b.brandId}
                  active={filters.brandId === b.brandId}
                  onClick={() =>
                    handleChange(
                      "brandId",
                      filters.brandId === b.brandId ? "" : b.brandId,
                    )
                  }
                >
                  {isRTL ? b.brandNameArabic : b.brandNameEnglish}
                </Chip>
              ))}
            </div>
          </section>

          {/* OCCASION */}
          <section>
            <h3 className="font-semibold mb-3">{t("Occasion")}</h3>
            <div className="flex flex-wrap gap-2">
              {occasions?.data?.map((o) => (
                <Chip
                  key={o.occasionId}
                  active={filters.occasionId === o.occasionId}
                  onClick={() =>
                    handleChange(
                      "occasionId",
                      filters.occasionId === o.occasionId ? "" : o.occasionId,
                    )
                  }
                >
                  {isRTL ? o.occasionNameArabic : o.occasionNameEnglish}
                </Chip>
              ))}
            </div>
          </section>
        </div>

        {/* COLOR / SIZE / PRICE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* COLOR */}
          <section>
            <h3 className="font-semibold mb-3">{t("Color")}</h3>
            <div className="flex gap-3">
              {["Black", "White", "Red", "Blue", "Green", "Gray"].map(
                (color) => (
                  <button
                    key={color}
                    onClick={() =>
                      handleChange(
                        "color",
                        filters.color === color ? "" : color,
                      )
                    }
                    className={`
                    w-8 h-8 rounded-full border-2
                    ${filters.color === color ? "ring-2 ring-primary" : ""}
                  `}
                    style={{ backgroundColor: color }}
                  />
                ),
              )}
            </div>
          </section>

          {/* SIZE */}
          <section>
            <h3 className="font-semibold mb-3">{t("Size")}</h3>
            <div className="flex gap-2">
              {["S", "M", "L", "XL"].map((size) => (
                <Chip
                  key={size}
                  active={filters.size === size}
                  onClick={() =>
                    handleChange("size", filters.size === size ? "" : size)
                  }
                >
                  {size}
                </Chip>
              ))}
            </div>
          </section>

          {/* PRICE */}
          <section>
            <h3 className="font-semibold mb-3">{t("Price Range")}</h3>
            <div className="grid grid-cols-2 gap-3">
              <FilterTextField
                label="Min"
                type="number"
                value={filters.minPrice}
                onChange={(v) => handleChange("minPrice", v)}
              />
              <FilterTextField
                label="Max"
                type="number"
                value={filters.maxPrice}
                onChange={(v) => handleChange("maxPrice", v)}
              />
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
};

export default memo(FilterSidebar);
