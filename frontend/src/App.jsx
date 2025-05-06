import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/Tabs";
import { Footer } from "./components/Footer";
import { FarmerDashboard } from "./pages/FarmerDashboard";
import { BuyerDashboard } from "./pages/BuyerDashboard";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { Header } from "./components/Header";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CropDiseaseDetection } from "./components/CropDiseaseDetection";
import { DiseaseHistory } from "./components/DiseaseHistory";
import { userService } from "./services/userService";
import { socketService } from "./services/socketService";
import AddCrops from "./components/farmer/AddCrops";
import YourCrops from "./components/farmer/YourCrops";
import BuySellMarket from "./pages/BuySellMarket";
import OrderBasket from "./pages/OrderBasket";
import OrderManagement from "./pages/OrderManagement";
import FarmerOrderManagement from "./pages/FarmerOrderManagement";
import UserProfileForm from "./components/UserProfileForm";

// This will be used for the crop details page
const FarmerLayout = ({ userType, onLogout, children }) => {
  return (
    <div className="min-h-screen bg_image_farmer">
      <Header userType={userType} onLogout={onLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>
      <Footer />
    </div>
  );
};

const BuyerLayout = ({ userType, onLogout, children }) => {
  return (
    <div className="min-h-screen bg_image_farmer">
      <Header userType={userType} onLogout={onLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>
      <Footer />
    </div>
  );
};

const DashboardLayout = ({ userType, onLogout }) => {
  return (
    <div className="min-h-screen bg_image_farmer">
      <Header userType={userType} onLogout={onLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-1">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-2 rounded-md transition-all duration-200 hover:bg-primary/10"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-2 rounded-md transition-all duration-200 hover:bg-primary/10"
            >
              Profile
            </TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            {userType === "farmer" ? <FarmerDashboard /> : <BuyerDashboard />}
          </TabsContent>
          <TabsContent value="profile">
            <UserProfileForm />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = userService.getCurrentUser();
      if (user && user.userType) {
        setIsLoggedIn(true);
        setUserType(user.userType);
      } else {
        // Invalid or expired token
        localStorage.removeItem("token");
      }
    }
  }, []);

  // Initialize socket connection when user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      // Initialize the socket connection
      socketService.init();
    }

    // Cleanup socket connection on unmount
    return () => {
      socketService.disconnect();
    };
  }, [isLoggedIn]);

  const handleLogin = (type) => {
    setIsLoggedIn(true);
    setUserType(type);
  };

  const handleLogout = () => {
    // Disconnect socket before logout
    socketService.disconnect();
    userService.logout();
    setIsLoggedIn(false);
    setUserType(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to={`/${userType}`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to={`/${userType}`} replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isLoggedIn ? <Navigate to={`/${userType}`} replace /> : <Signup />
          }
        />

        {/* Farmer Routes */}
        <Route
          path="/farmer"
          element={
            isLoggedIn && userType === "farmer" ? (
              <DashboardLayout userType={userType} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/farmer/dashboard"
          element={
            isLoggedIn && userType === "farmer" ? (
              <DashboardLayout userType={userType} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/farmer/add-crops"
          element={
            isLoggedIn && userType === "farmer" ? (
              <FarmerLayout userType={userType} onLogout={handleLogout}>
                <AddCrops />
              </FarmerLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/farmer/your-crops"
          element={
            isLoggedIn && userType === "farmer" ? (
              <FarmerLayout userType={userType} onLogout={handleLogout}>
                <YourCrops />
              </FarmerLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/farmer/orders"
          element={
            isLoggedIn && userType === "farmer" ? (
              <FarmerLayout userType={userType} onLogout={handleLogout}>
                <FarmerOrderManagement />
              </FarmerLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/farmer/orders/:orderId"
          element={
            isLoggedIn && userType === "farmer" ? (
              <FarmerLayout userType={userType} onLogout={handleLogout}>
                <FarmerOrderManagement />
              </FarmerLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/farmer/disease-detection"
          element={
            isLoggedIn && userType === "farmer" ? (
              <CropDiseaseDetection />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/farmer/disease-history"
          element={
            isLoggedIn && userType === "farmer" ? (
              <DiseaseHistory />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Buyer Routes */}
        <Route
          path="/buyer"
          element={
            isLoggedIn && userType === "buyer" ? (
              <DashboardLayout userType={userType} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/buyer/dashboard"
          element={
            isLoggedIn && userType === "buyer" ? (
              <DashboardLayout userType={userType} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/buyer/marketplace"
          element={
            isLoggedIn && userType === "buyer" ? (
              <BuyerLayout userType={userType} onLogout={handleLogout}>
                <BuySellMarket />
              </BuyerLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/buyer/order-basket"
          element={
            isLoggedIn && userType === "buyer" ? (
              <BuyerLayout userType={userType} onLogout={handleLogout}>
                <OrderBasket />
              </BuyerLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/buyer/orders"
          element={
            isLoggedIn && userType === "buyer" ? (
              <BuyerLayout userType={userType} onLogout={handleLogout}>
                <OrderManagement />
              </BuyerLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/buyer/orders/:orderId"
          element={
            isLoggedIn && userType === "buyer" ? (
              <BuyerLayout userType={userType} onLogout={handleLogout}>
                <OrderManagement />
              </BuyerLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/buyer/quotation-request"
          element={
            isLoggedIn && userType === "buyer" ? (
              <BuyerLayout userType={userType} onLogout={handleLogout}>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-bold text-green-800 mb-4">
                    Quotation Request
                  </h2>
                  <p className="text-gray-600">This feature is coming soon!</p>
                </div>
              </BuyerLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/buyer/disease-history"
          element={
            isLoggedIn && userType === "buyer" ? (
              <DiseaseHistory />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Common Routes */}
        <Route
          path="/disease-history"
          element={
            isLoggedIn ? (
              <FarmerLayout userType={userType} onLogout={handleLogout}>
                <DiseaseHistory />
              </FarmerLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
