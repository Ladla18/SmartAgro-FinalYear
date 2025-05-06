// Farmer Dashboard Component
import { useEffect, useState } from "react";
import { StatCard } from "../components/StatCard";
import { FeatureCard } from "../components/FeatureCard";
import axios from "axios";
import {
  Leaf,
  ShoppingCart,
  BarChart2,
  Camera,
  CloudSun,
  TrendingUp,
} from "lucide-react";
import WeatherForecasting from "./WeatherForecasting";
import CropDisease from "./CropDisease";
import BuySellMarket from "./BuySellMarket";
import PricePrediction from "./PricePrediction";
import BackButton from "../components/BackButton";
import { cropService } from "../services/cropService";
import { toast } from "react-hot-toast";

export const FarmerDashboard = () => {
  const [selectedFeature, setSelectedFeature] = useState("");
  const [stats, setStats] = useState({
    activeCrops: 0,
    marketListings: 0,
    yieldIncrease: "12%"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [weatherData, setweatherData] = useState([]);
 
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Get user crops
      const crops = await cropService.getUserCrops();
      
      // Get marketplace listings
      const marketplaceListings = await cropService.getMyMarketplaceListings();
      
      // Calculate stats
      const activeCropsCount = crops.filter(crop => crop.status === "available").length;
      
      setStats({
        activeCrops: activeCropsCount,
        marketListings: marketplaceListings ? marketplaceListings.length : 0,
        yieldIncrease: "12%"  // This could be calculated or fetched from another API
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeatureSelect = (featureTitle) => {
    setSelectedFeature(featureTitle); // Update Dashboard state with the selected feature title
    console.log("Selected Feature:", featureTitle);
  };
  
  const handleFeatureReset = () => {
    setSelectedFeature("");
  };

  if (selectedFeature === "Weather Forecast") {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `https://api.openweathermap.org/data/2.5/forecast?lat=26.6865&lon=84.1778&appid=5e0c0cc41111ae0df99b863d841cfba6`
        );
        setweatherData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("FarmerDashboard.jsx", " :: Error ❌ : ", error);
      }
    };
    fetchData();
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<Leaf className="h-8 w-8 text-green-500" />}
          title="Active Crops"
          value={isLoading ? "Loading..." : String(stats.activeCrops)}
        />
        <StatCard
          icon={<ShoppingCart className="h-8 w-8 text-blue-500" />}
          title="Market Listings"
          value={isLoading ? "Loading..." : String(stats.marketListings)}
          tooltip="Number of your crops listed in the marketplace"
        />
      
      </div>
      {selectedFeature && <BackButton onResetFeature={handleFeatureReset} />}
      {selectedFeature === "" ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Farmer Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard
              onFeatureSelect={handleFeatureSelect}
              icon={<Camera className="h-12 w-12 text-green-500" />}
              title="Crop Disease Detection"
              description="Upload images of your crops to detect diseases early."
            />
            <FeatureCard
              onFeatureSelect={handleFeatureSelect}
              icon={<CloudSun className="h-12 w-12 text-blue-500" />}
              title="Weather Forecast"
              description="Get accurate, localized weather predictions for your farm."
            />
            <FeatureCard
              onFeatureSelect={handleFeatureSelect}
              icon={<ShoppingCart className="h-12 w-12 text-purple-500" />}
              title="Buy & Sell Marketplace"
              description="List your produce or find farming supplies easily."
            />
            <FeatureCard
              onFeatureSelect={handleFeatureSelect}
              icon={<TrendingUp className="h-12 w-12 text-red-500" />}
              title="Crop Price Prediction"
              description="AI-powered forecasts to help you make informed decisions."
            />
          </div>
        </div>
      ) : selectedFeature === "Crop Disease Detection" ? (
        <CropDisease />
      ) : selectedFeature === "Weather Forecast" ? (
        <WeatherForecasting data={weatherData} />
      ) : selectedFeature === "Buy & Sell Marketplace" ? (
        <BuySellMarket />
      ) : selectedFeature === "Crop Price Prediction" ? (
        <PricePrediction />
      ) : (
        "This is not the page you are looking for"
      )}
    </div>
  );
};
