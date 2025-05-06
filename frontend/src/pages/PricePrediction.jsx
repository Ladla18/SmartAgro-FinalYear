import React, { useState, useEffect } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Loader2, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { toast } from "react-hot-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";

const COMMON_CROPS = [
  "Rice",
  "Wheat",
  "Maize",
  "Potato",
  "Tomato",
  "Onion",
  "Soybean",
  "Cotton",
  "Sugarcane",
  "Groundnut",
];

const STATES = [
  "Andhra Pradesh",
  "Bihar",
  "Gujarat",
  "Haryana",
  "Karnataka",
  "Madhya Pradesh",
  "Maharashtra",
  "Punjab",
  "Rajasthan",
  "Uttar Pradesh",
];

const PricePrediction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [formData, setFormData] = useState({
    crop: "",
    state: "",
    currentPrice: "",
    season: "Kharif", // Default season
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const predictPrice = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("API key is not configured");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `As an agricultural price prediction expert, analyze and predict the price of ${formData.crop} in ${formData.state}, India for the next month.
      Current price: ₹${formData.currentPrice} per quintal
      Season: ${formData.season}
      
      Consider factors like:
      1. Historical price trends
      2. Seasonal variations
      3. Current market conditions
      4. Supply and demand dynamics
      5. Weather patterns
      
      Return ONLY a JSON object with this exact structure (no additional text):
      {
        "predictedPrice": number (predicted price per quintal),
        "confidence": number (confidence level 0-1),
        "trend": "up" or "down" or "stable",
        "factors": [string] (list of 3 main factors),
        "recommendation": string (short trading recommendation)
      }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();

      // Parse the JSON response
      const cleanJson = text.replace(/```json\n|\n```|```/g, "").trim();
      const analysis = JSON.parse(cleanJson);

      setPrediction(analysis);
      toast.success("Price prediction generated successfully!");
    } catch (error) {
      console.error("Prediction error:", error);
      toast.error(error.message || "Failed to generate price prediction");
    } finally {
      setIsLoading(false);
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case "up":
        return "text-green-500";
      case "down":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Crop Price Prediction
        </h2>
        <p className="text-center text-gray-600">
          Get AI-powered price predictions for agricultural commodities
        </p>

        <form onSubmit={predictPrice} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Crop Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Select Crop
              </label>
              <select
                name="crop"
                value={formData.crop}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select a crop</option>
                {COMMON_CROPS.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </div>

            {/* State Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Select State
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select a state</option>
                {STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Current Price (₹/quintal)
              </label>
              <input
                type="number"
                name="currentPrice"
                value={formData.currentPrice}
                onChange={handleInputChange}
                required
                placeholder="Enter current price"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Season Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Season
              </label>
              <select
                name="season"
                value={formData.season}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Kharif">Kharif (Monsoon)</option>
                <option value="Rabi">Rabi (Winter)</option>
                <option value="Zaid">Zaid (Summer)</option>
              </select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 rounded-md transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating Prediction...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Predict Price</span>
              </div>
            )}
          </Button>
        </form>

        {prediction && (
          <div className="mt-8 space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Predicted Price Card */}
              <Card className="p-4 bg-white shadow-lg rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-800">
                    Predicted Price
                  </h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{prediction.predictedPrice.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">per quintal</p>
              </Card>

              {/* Confidence Level Card */}
              <Card className="p-4 bg-white shadow-lg rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-800">
                    Confidence Level
                  </h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {(prediction.confidence * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">prediction accuracy</p>
              </Card>

              {/* Market Trend Card */}
              <Card className="p-4 bg-white shadow-lg rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp
                    className={`w-5 h-5 ${getTrendColor(prediction.trend)}`}
                  />
                  <h3 className="font-semibold text-gray-800">Market Trend</h3>
                </div>
                <p
                  className={`text-2xl font-bold capitalize ${getTrendColor(
                    prediction.trend
                  )}`}
                >
                  {prediction.trend}
                </p>
                <p className="text-sm text-gray-600">price movement</p>
              </Card>
            </div>

            {/* Analysis Details */}
            <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Key Factors
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                {prediction.factors.map((factor, index) => (
                  <li key={index} className="text-gray-700">
                    {factor}
                  </li>
                ))}
              </ul>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Recommendation
                </h3>
                <p className="text-gray-700">{prediction.recommendation}</p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PricePrediction;
