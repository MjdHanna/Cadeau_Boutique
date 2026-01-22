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
  const [openCategory, setOpenCategory] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);
  const [openOccasion, setOpenOccasion] = useState(false);

  const debouncedSearch = useDebounce(searchDraft, 600);
  useEffect(() => {
    setSearchDraft(filters.name ?? "");
  }, [filters.name]);

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* CATEGORY */}
          <section className="relative">
            <h3 className="font-semibold mb-3">{t("Category")}</h3>

            <button
              onClick={() => setOpenCategory((v) => !v)}
              className="w-full flex justify-between items-center px-4 py-3 border rounded-xl bg-white hover:bg-gray-50"
            >
              <span className="text-sm truncate">
                {filters.categoryId
                  ? isRTL
                    ? categories?.data?.find(
                        (c) => c.categoryId === filters.categoryId,
                      )?.categoryNameArabic
                    : categories?.data?.find(
                        (c) => c.categoryId === filters.categoryId,
                      )?.categoryNameEnglish
                  : t("Select category")}
              </span>
              <span>▾</span>
            </button>

            {openCategory && (
              <div
                className={`absolute z-20 mt-2 w-full bg-white border rounded-xl shadow-lg max-h-60 overflow-auto ${isRTL ? "right-0" : "left-0"}`}
              >
                {categories?.data?.map((c) => (
                  <button
                    key={c.categoryId}
                    onClick={() => {
                      handleChange("categoryId", c.categoryId);
                      setOpenCategory(false);
                    }}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                      filters.categoryId === c.categoryId
                        ? "bg-primary/10 text-primary font-medium"
                        : ""
                    }`}
                  >
                    {isRTL ? c.categoryNameArabic : c.categoryNameEnglish}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* BRAND */}
          <section className="relative">
            <h3 className="font-semibold mb-3">{t("Brand")}</h3>

            <button
              onClick={() => setOpenBrand((v) => !v)}
              className="w-full flex justify-between items-center px-4 py-3 border rounded-xl bg-white hover:bg-gray-50"
            >
              <span className="text-sm truncate">
                {filters.brandId
                  ? isRTL
                    ? brands?.data?.find((b) => b.brandId === filters.brandId)
                        ?.brandNameArabic
                    : brands?.data?.find((b) => b.brandId === filters.brandId)
                        ?.brandNameEnglish
                  : t("Select brand")}
              </span>
              <span>▾</span>
            </button>

            {openBrand && (
              <div
                className={`absolute z-20 mt-2 w-full bg-white border rounded-xl shadow-lg max-h-60 overflow-auto ${isRTL ? "right-0" : "left-0"}`}
              >
                {brands?.data?.map((b) => (
                  <button
                    key={b.brandId}
                    onClick={() => {
                      handleChange("brandId", b.brandId);
                      setOpenBrand(false);
                    }}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                      filters.brandId === b.brandId
                        ? "bg-primary/10 text-primary font-medium"
                        : ""
                    }`}
                  >
                    {isRTL ? b.brandNameArabic : b.brandNameEnglish}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* OCCASION */}
          <section className="relative">
            <h3 className="font-semibold mb-3">{t("Occasion")}</h3>

            <button
              onClick={() => setOpenOccasion((v) => !v)}
              className="w-full flex justify-between items-center px-4 py-3 border rounded-xl bg-white hover:bg-gray-50"
            >
              <span className="text-sm truncate">
                {filters.occasionId
                  ? isRTL
                    ? occasions?.data?.find(
                        (o) => o.occasionId === filters.occasionId,
                      )?.occasionNameArabic
                    : occasions?.data?.find(
                        (o) => o.occasionId === filters.occasionId,
                      )?.occasionNameEnglish
                  : t("Select occasion")}
              </span>
              <span>▾</span>
            </button>

            {openOccasion && (
              <div
                className={`absolute z-20 mt-2 w-full bg-white border rounded-xl shadow-lg max-h-60 overflow-auto ${isRTL ? "right-0" : "left-0"}`}
              >
                {occasions?.data?.map((o) => (
                  <button
                    key={o.occasionId}
                    onClick={() => {
                      handleChange("occasionId", o.occasionId);
                      setOpenOccasion(false);
                    }}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                      filters.occasionId === o.occasionId
                        ? "bg-primary/10 text-primary font-medium"
                        : ""
                    }`}
                  >
                    {isRTL ? o.occasionNameArabic : o.occasionNameEnglish}
                  </button>
                ))}
              </div>
            )}
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
