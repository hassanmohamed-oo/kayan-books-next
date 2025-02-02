"use client";
import { Navbar } from "@/components";
import React, { FormEvent, useState } from "react";
import axios from "axios";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState("");
  const [sucsess, setsucsess] = useState("")
  const [showPassword, setShowPassword] = useState(false); // حالة لإظهار كلمة المرور
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // حالة لإظهار تأكيد كلمة المرور

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.passwordConfirm
    ) {
      setError("يرجى ملء جميع الحقول");
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError("كلمة المرور وتأكيد كلمة المرور غير متطابقتين");
      return;
    }
    try {
      const response = await axios.post(
        "https://e-book-kayan.vercel.app/api/auth/register",
        formData
      );
      setError("")
      setsucsess("تم انشاء حساب بنجاح برجاء تسجيل الدخول به");
    } catch (error:any) {
      if (error.response?.data?.errors) {
        const serverError = error.response.data.errors[0];
        setError(serverError.msg);
      } else {
        setError(error.response?.data?.message);
    }
  };
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  // دالة التعامل مع التسجيل

  return (
    <>
      <Navbar />
      <div className="h-[80vh] flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-center text-blue-500 mb-6">
            التسجيل
          </h2>

          {/* رسالة الخطأ */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
              {error}
            </div>
          )}
          {sucsess && (
            <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">
              {sucsess}
            </div>
          )}

          {/* نموذج التسجيل */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-600"
              >
                الاسم الكامل
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-3 border mt-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل اسمك الكامل"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-600"
              >
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل بريدك الإلكتروني"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-600"
              >
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل كلمة المرور"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div
                  className="absolute top-1/2 left-3 pt-2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <i className="fa-solid fa-eye-slash"></i>
                  ) : (
                    <i className="fa-regular fa-eye"></i>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-600"
              >
                تأكيد كلمة المرور
              </label>
              <div className="relative  text-left">
                <input
                  type= "password"
                  id="passwordConfirm"
                  className="w-full mt-2 p-3 border relative border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="تأكيد كلمة المرور"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                />
                <div
                  className="absolute top-1/2 left-3 pt-2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <i className="fa-solid fa-eye-slash"></i>
                  ) : (
                    <i className="fa-regular fa-eye"></i>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              تسجيل الحساب
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              لديك حساب بالفعل؟{" "}
              <a href="/login" className="text-blue-600">
                سجل الدخول
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
