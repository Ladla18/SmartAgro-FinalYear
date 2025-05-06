// Buyer Dashboard Component
import { useEffect, useState } from "react";
import { StatCard } from "../components/StatCard";
import { FeatureCard } from "../components/FeatureCard";
import { cropService } from "../services/cropService";
import { orderService } from "../services/orderService";
import { sourcedProductService } from "../services/sourcedProductService";
import { toast } from "react-hot-toast";
import BuySellMarket from "./BuySellMarket";
import BackButton from "../components/BackButton";
import { ProductSearchFilter } from "../components/ProductSearchFilter";
import {
  ShoppingCart,
  TrendingUp,
  Package,
  Search,
  Eye,
  Trash2,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChatModal from "../components/ChatModal";

export const BuyerDashboard = () => {
  const [selectedFeature, setSelectedFeature] = useState("");
  const [stats, setStats] = useState({
    activeOrders: 0,
    marketplaceListings: 0,
    avgSavings: "15%",
    productsSourced: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [sourcedProducts, setSourcedProducts] = useState([]);
  const [showSourcedProducts, setShowSourcedProducts] = useState(false);
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user data from local storage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setCurrentUser(user);
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Get marketplace listings
      const marketplaceListings = await cropService.getMarketplaceListings();

      // Get order history to count active orders
      let activeOrdersCount = 0;
      try {
        const orderHistory = await orderService.getOrderHistory();
        if (orderHistory) {
          // Count orders with status "checkout" (processing)
          activeOrdersCount = orderHistory.filter(
            (order) => order.status === "checkout"
          ).length;
        }
      } catch (error) {
        console.error("Error fetching order history:", error);
      }

      // Get sourced products
      let sourcedProductsData = [];
      try {
        sourcedProductsData = await sourcedProductService.getSourcedProducts();
        setSourcedProducts(sourcedProductsData);
      } catch (error) {
        console.error("Error fetching sourced products:", error);
        // Don't show toast here as this is a secondary feature
      }

      setStats((prevStats) => ({
        ...prevStats,
        marketplaceListings: marketplaceListings
          ? marketplaceListings.length
          : 0,
        activeOrders: activeOrdersCount,
        productsSourced: sourcedProductsData.length,
      }));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeatureSelect = (featureTitle) => {
    setSelectedFeature(featureTitle);
    setShowSourcedProducts(false);
  };

  const handleFeatureReset = () => {
    setSelectedFeature("");
    setShowSourcedProducts(false);
  };

  const toggleSourcedProductsView = () => {
    if (!showSourcedProducts && !sourcedProducts.length) {
      toast.info("You haven't sourced any products yet.");
    }
    setShowSourcedProducts(!showSourcedProducts);
  };

  const handleDeleteProduct = async (sourcedProductId) => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await sourcedProductService.removeSourcedProduct(sourcedProductId);

      setSourcedProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== sourcedProductId)
      );

      setStats((prevStats) => ({
        ...prevStats,
        productsSourced: prevStats.productsSourced - 1,
      }));

      toast.success("Product removed from sourced items");
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error deleting sourced product:", error);
      toast.error(
        typeof error === "string" ? error : "Failed to remove product"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelete = (e, id) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setDeleteConfirmId(null);
  };

  const handleContactSeller = (product) => {
    if (!product.listingId || !product.listingId.sellerId) {
      toast.error("Seller information is not available");
      return;
    }

    setSelectedSeller(product.listingId.sellerId);
    setSelectedListing(product.listingId);
    setChatModalOpen(true);
  };

  const SourcedProductsView = () => {
    if (sourcedProducts.length === 0) {
      return (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-700">
            No Products Sourced
          </h3>
          <p className="mt-2 text-gray-500">
            You haven't sourced any products yet. Visit the Product Search to
            source products.
          </p>
          <button
            onClick={() => handleFeatureSelect("Product Search")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Product Search
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-blue-800">
            Your Sourced Products
          </h3>
          <span className="text-sm text-gray-500">
            {sourcedProducts.length} products sourced
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sourcedProducts.map((item) => (
            <div
              key={item._id}
              className="border rounded-lg p-4 bg-white shadow-sm relative hover:shadow-md transition-shadow"
            >
              {deleteConfirmId === item._id ? (
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-60 rounded-lg flex flex-col items-center justify-center text-white p-4 z-10">
                  <AlertCircle className="h-8 w-8 text-red-400 mb-2" />
                  <p className="font-medium mb-3 text-center">
                    Are you sure you want to remove this product?
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={(e) => handleDeleteProduct(item._id)}
                      disabled={isDeleting}
                      className={`px-4 py-1 bg-red-600 hover:bg-red-700 rounded-md flex items-center ${
                        isDeleting ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {isDeleting ? "Removing..." : "Remove"}
                    </button>
                    <button
                      onClick={cancelDelete}
                      className="px-4 py-1 bg-gray-600 hover:bg-gray-700 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={(e) => confirmDelete(e, item._id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-100"
                  title="Delete sourced product"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}

              <h4 className="font-medium text-gray-900 mb-2 pr-6">
                {item.cropId?.cropName || "Unknown Crop"}
              </h4>
              <div className="text-sm text-gray-500 space-y-1">
                <p>
                  <span className="font-medium">Source Date:</span>{" "}
                  {new Date(item.sourcedDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Status:</span> {item.status}
                </p>
                {item.notes && (
                  <p>
                    <span className="font-medium">Notes:</span> {item.notes}
                  </p>
                )}
              </div>

              {/* Contact Seller Button */}
              {item.listingId && item.listingId.sellerId && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleContactSeller(item)}
                    className="w-full py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-md flex items-center justify-center transition-colors text-sm font-medium"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Seller
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<ShoppingCart className="h-8 w-8 text-blue-500" />}
          title="Active Orders"
          value={isLoading ? "Loading..." : String(stats.activeOrders)}
          onClick={() => navigate("/buyer/orders")}
          className="cursor-pointer hover:shadow-md transition-shadow"
        />
        <StatCard
          icon={<TrendingUp className="h-8 w-8 text-green-500" />}
          title="Marketplace Listings"
          value={isLoading ? "Loading..." : String(stats.marketplaceListings)}
          tooltip="Number of crops currently available in the marketplace"
        />
        <StatCard
          icon={<Package className="h-8 w-8 text-purple-500" />}
          title="Products Sourced"
          value={isLoading ? "Loading..." : String(stats.productsSourced)}
          onClick={toggleSourcedProductsView}
          className="cursor-pointer hover:shadow-md transition-shadow"
          actionIcon={<Eye className="h-5 w-5 text-purple-600" />}
          actionLabel="View"
        />
      </div>

      {showSourcedProducts ? (
        <>
          <BackButton onResetFeature={() => setShowSourcedProducts(false)} />
          <SourcedProductsView />
        </>
      ) : (
        <>
          {selectedFeature && (
            <BackButton onResetFeature={handleFeatureReset} />
          )}

          {selectedFeature === "" ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-blue-800">Buyer Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FeatureCard
                  onFeatureSelect={handleFeatureSelect}
                  icon={<Search className="h-12 w-12 text-blue-500" />}
                  title="Product Search"
                  description="Find the exact produce you need from our network of farmers."
                />
                <FeatureCard
                  onFeatureSelect={handleFeatureSelect}
                  icon={<ShoppingCart className="h-12 w-12 text-green-500" />}
                  title="Marketplace"
                  description="Browse all available products and make purchases."
                />
                <FeatureCard
                  onFeatureSelect={handleFeatureSelect}
                  icon={<TrendingUp className="h-12 w-12 text-purple-500" />}
                  title="Price Analytics"
                  description="View price trends and make informed purchasing decisions."
                />
                <FeatureCard
                  onFeatureSelect={() => navigate("/buyer/orders")}
                  icon={<Package className="h-12 w-12 text-red-500" />}
                  title="Order Management"
                  description="Track and manage all your orders in one place."
                />
              </div>
            </div>
          ) : selectedFeature === "Marketplace" ? (
            <BuySellMarket />
          ) : selectedFeature === "Product Search" ? (
            <ProductSearchFilter />
          ) : (
            <div className="text-center p-10 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium text-gray-700">
                {selectedFeature} Feature
              </h3>
              <p className="mt-2 text-gray-500">This feature is coming soon!</p>
            </div>
          )}
        </>
      )}

      {/* Chat Modal */}
      {chatModalOpen && selectedSeller && (
        <ChatModal
          isOpen={chatModalOpen}
          onClose={() => {
            setChatModalOpen(false);
            setSelectedSeller(null);
            setSelectedListing(null);
          }}
          recipient={selectedSeller}
          listing={selectedListing}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};
