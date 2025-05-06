import React, { useState } from "react";
import { User, Lock, Mail, Phone } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

import { Toaster, toast } from "react-hot-toast";
import { userService } from "../services/userService";
import { Link, useNavigate } from "react-router-dom";

export const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [loginLoading, setLoginLoading] = useState(false);
  const [userType, setUserType] = useState("farmer");
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const response = await userService.login({
        ...loginData,
        userType,
      });
      toast.success("Login successful!");
      onLogin(userType);
      navigate(userType === "farmer" ? "/farmer" : "/buyer");
    } catch (error) {
      toast.error(error || "Login failed.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Toaster position="top-center" />

      <Card className="w-full max-w-4xl bg-white/80 backdrop-blur-sm shadow-2xl">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Side - Hero Section */}
          <div className="p-6 bg-gradient-to-br from-green-600 to-blue-600 text-white rounded-l-xl hidden md:block">
            <div className="h-full flex flex-col justify-between">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold">FarmConnect Pro</h1>
                <p className="text-lg opacity-90">
                  Connect, Trade, and Grow with the Leading Agricultural
                  Marketplace
                </p>
                <div className="space-y-4 mt-8">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-full">
                      <User className="w-6 h-6" />
                    </div>
                    <p>Connect with verified buyers and farmers</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-full">
                      <Lock className="w-6 h-6" />
                    </div>
                    <p>Secure transactions and communication</p>
                  </div>
                </div>
              </div>
              <p className="text-sm opacity-75">
                © 2024 FarmConnect Pro. All rights reserved.
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-center text-gray-800">
                Welcome Back
              </h2>
              <p className="text-center text-gray-600 mt-2">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    name="email"
                    type="email"
                    value={loginData.email}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-50 border-gray-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    name="password"
                    type="password"
                    value={loginData.password}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-50 border-gray-200"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {/* User Type Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">I am a:</label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Farmer Button */}
                  <Button
                    type="button"
                    onClick={() => setUserType("farmer")}
                    className={`py-6 relative transition-all duration-200 ${
                      userType === "farmer"
                        ? "bg-green-600 hover:bg-green-700 ring-4 ring-green-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`p-2 rounded-full ${
                          userType === "farmer"
                            ? "bg-green-500/20"
                            : "bg-gray-200"
                        }`}
                      >
                        <img
                          src="/farmer-icon.png"
                          alt="Farmer"
                          className="w-6 h-6"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                      <span
                        className={
                          userType === "farmer" ? "text-white font-medium" : ""
                        }
                      >
                        Farmer
                      </span>
                      {userType === "farmer" && (
                        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </Button>

                  {/* Buyer Button */}
                  <Button
                    type="button"
                    onClick={() => setUserType("buyer")}
                    className={`py-6 relative transition-all duration-200 ${
                      userType === "buyer"
                        ? "bg-blue-600 hover:bg-blue-700 ring-4 ring-blue-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`p-2 rounded-full ${
                          userType === "buyer"
                            ? "bg-blue-500/20"
                            : "bg-gray-200"
                        }`}
                      >
                        <img
                          src="/buyer-icon.png"
                          alt="Buyer"
                          className="w-6 h-6"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z'/%3E%3Cline x1='3' y1='6' x2='21' y2='6'/%3E%3Cpath d='M16 10a4 4 0 0 1-8 0'/%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                      <span
                        className={
                          userType === "buyer" ? "text-white font-medium" : ""
                        }
                      >
                        Buyer
                      </span>
                      {userType === "buyer" && (
                        <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
};
