import React, { useState } from "react";
import p1 from "../../assets/images/authentication/p1.png";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    gender: "",
    phoneNumber: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-xl p-8">
        <div className="flex flex-col md:flex-row items-start gap-10">
          {/* Left Section */}
          <div className="flex flex-col items-start space-y-3 w-full md:w-1/2">
            <img src={p1} alt="Logo" className="h-16 object-contain" />
            <h2 className="text-3xl font-bold text-gray-900 text-left">
              Welcome Back
            </h2>
            <h3 className="text-primary  text-left">
              Welcome back to our store
            </h3>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full md:w-1/2 space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-gray-700 mb-1 text-left"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary "
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 mb-1 text-left"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@gmail.com"
                className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary "
              />
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block text-gray-700 mb-1 text-left"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary "
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-gray-700 mb-1 text-left"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+963"
                className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary "
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 mb-1 text-left"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary "
              />
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-primary text-white font-bold rounded-lg hover:bg-primary transition"
            >
              Sign Up
            </button>

            <p className="text-gray-600 text-center">
              Already have an account?{" "}
              <a href="/login" className="text-primary font-semibold">
                Click here to login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
