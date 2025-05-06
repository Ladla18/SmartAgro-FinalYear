import React, { useState } from "react";
import { User, Lock, Mail, Phone } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Toaster, toast } from "react-hot-toast";
import { userService } from "../services/userService";
import { Link, useNavigate } from "react-router-dom";

export const Signup = () => {
  const navigate = useNavigate();
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupType, setSignupType] = useState("farmer");
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupLoading(true);
    try {
      const response = await userService.signup({
        ...signupData,
        userType: signupType,
      });
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error || "Signup failed. Please try again.");
    } finally {
      setSignupLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
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
                {/* ... rest of hero content ... */}
              </div>
              <p className="text-sm opacity-75">
                © 2024 FarmConnect Pro. All rights reserved.
              </p>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-center text-gray-800">
                Create Account
              </h2>
              <p className="text-center text-gray-600 mt-2">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Log in
                </Link>
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              {/* Full Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    name="fullName"
                    type="text"
                    value={signupData.fullName}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-50 border-gray-200"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    name="email"
                    type="email"
                    value={signupData.email}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-50 border-gray-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Phone Number Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    name="phoneNumber"
                    type="tel"
                    value={signupData.phoneNumber}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-50 border-gray-200"
                    placeholder="Enter your phone number"
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
                    value={signupData.password}
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
                    onClick={() => setSignupType("farmer")}
                    className={`py-6 relative transition-all duration-200 ${
                      signupType === "farmer"
                        ? "bg-green-600 hover:bg-green-700 ring-4 ring-green-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <svg
                      className="w-6 h-6 mb-2 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Farmer
                  </Button>

                  {/* Buyer Button */}
                  <Button
                    type="button"
                    onClick={() => setSignupType("buyer")}
                    className={`py-6 relative transition-all duration-200 ${
                      signupType === "buyer"
                        ? "bg-blue-600 hover:bg-blue-700 ring-4 ring-blue-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <svg
                      className="w-6 h-6 mb-2 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    Buyer
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                disabled={signupLoading}
              >
                {signupLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                    <span>Signing up...</span>
                  </div>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
};
