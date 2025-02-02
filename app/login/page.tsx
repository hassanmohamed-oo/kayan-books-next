"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isToken, setToken] = useState(false);
  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        "https://e-book-kayan.vercel.app/api/auth/refresh",
        {
          withCredentials: true,
        }
      );
      const newAccessToken = response.data.AccessToken;
      Cookies.set("accessToken", newAccessToken, {
        secure: true,
        sameSite: "strict",
      });
      return newAccessToken;
    } catch (err) {
      console.error("Error refreshing access token:", err);
      throw new Error("Failed to refresh access token");
    }
  };

   const router = useRouter();

   useEffect(() => {
     const token = Cookies.get("accessToken"); // تحقق من وجود التوكن
     if (token) {
       // إذا كان التوكن موجودًا، أعد التوجيه للبروفايل
       router.replace("/profile");
     }
   }, [router]);


 
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const loginResponse = await axios.post(
        "https://e-book-kayan.vercel.app/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      setSuccess("تم تسجيل الدخول بنجاح!");
      router.replace("/");
      const AccessToken = loginResponse.data.AccessToken;
      Cookies.set("accessToken", AccessToken, {
        secure: true,
        sameSite: "strict",
      });
    } catch (err: any) {
      console.error("Login or fetch users error:", err);

      const errorMessage =
        err.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
     (
        <div className="h-[80vh] flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-2xl font-semibold text-center text-blue-500 mb-6">
              تسجيل الدخول
            </h2>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">
                {success}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
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
                  className="w-full p-3 border mt-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل بريدك الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600 transition"
                disabled={loading}
              >
                {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                ليس لديك حساب؟{" "}
                <a href="/register" className="text-blue-500">
                  سجل الآن
                </a>
              </p>
            </div>
          </div>
        </div>
      )
    </>
  );
};

export default LoginPage;
