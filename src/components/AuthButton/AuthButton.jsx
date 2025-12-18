import React from "react";

const AuthButton = ({ label, loading, className = "", children }) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`w-full bg-primary hover:bg-primary text-white font-bold p-3 rounded-lg mt-2 transition
      ${loading ? "opacity-70 cursor-not-allowed" : ""} ${className}`}
    >
      {loading ? (
        <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
      ) : (
        children || label
      )}
    </button>
  );
};

export default AuthButton;
