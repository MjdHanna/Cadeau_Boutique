import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import p from "../assets/images/authentication/p1.png";
import FilterSelect from "../components/Search/FilterSelect";
import Loader from "./Loader/Loader";
const filterFields = [
  {
    name: "age",
    placeholder: "Select Age",
    options: [
      { value: "child", label: "Child" },
      { value: "teen", label: "Teenager" },
      { value: "adult", label: "Adult" },
    ],
  },
  {
    name: "relation",
    placeholder: "Relation",
    options: [
      { value: "mom", label: "Mother" },
      { value: "dad", label: "Father" },
      { value: "brother", label: "Brother" },
      { value: "sister", label: "Sister" },
      { value: "friend", label: "Friend" },
    ],
  },
  {
    name: "occasion",
    placeholder: "Occasion",
    options: [
      { value: "birthday", label: "Birthday" },
      { value: "graduation", label: "Graduation" },
      { value: "wedding", label: "Wedding" },
    ],
  },
  {
    name: "gender",
    placeholder: "Gender",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
    ],
  },
];

const SearchPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [filters, setFilters] = useState({
    age: "",
    relation: "",
    occasion: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setLoading(true);
    setResults(null);

    setTimeout(() => {
      setResults([]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12" dir={isRTL ? "rtl" : "ltr"}>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        {t("Search For Gift")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {filterFields.map((field) => (
          <FilterSelect
            key={field.name}
            name={field.name}
            value={filters[field.name]}
            onChange={handleChange}
            placeholder={field.placeholder}
            options={field.options}
          />
        ))}
      </div>
      <button
        onClick={handleSearch}
        disabled={loading}
        className="w-full bg-primary hover:bg-primary text-white font-bold p-3 rounded-lg mt-2 transition"
      >
        {loading ? t("Searching...") : t("Search")}
      </button>

      <div className="mt-10">
        {loading && <Loader />}

        {!loading && results && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-600 text-lg mt-6"
          >
            <img src={p} className="w-20 mx-auto mb-3 opacity-80" alt="logo" />
            {t("No products found for your search.")}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
