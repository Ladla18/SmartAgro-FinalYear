import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  Filter,
  Grid,
  List,
  Wheat,
  Clock,
  MapPin,
  Tag,
  Loader,
  Check,
  DollarSign,
  Phone,
  Mail,
  User,
  ShoppingBag,
  MessageSquare,
} from "lucide-react";
import { cropService } from "../services/cropService";
import { userService } from "../services/userService";
import { orderService } from "../services/orderService";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ChatModal from "../components/ChatModal";

const BuySellMarket = () => {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [currentUser, setCurrentUser] = useState(null);
  const [addingToBasketId, setAddingToBasketId] = useState(null);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user data
    const user = userService.getCurrentUser();
    if (user) {
      console.log("Current user set in BuySellMarket:", user);
      setCurrentUser(user);
    } else {
      console.error("No current user found");
    }

    fetchMarketplace();
  }, []);

  const fetchMarketplace = async () => {
    setIsLoading(true);
    try {
      // Fetch listings from the marketplace endpoint
      const marketplaceListings = await cropService.getMarketplaceListings();
      console.log("Listings in component:", marketplaceListings);
      setListings(marketplaceListings || []);
    } catch (error) {
      console.error("Error fetching marketplace:", error);
      toast.error("Failed to load marketplace. Please try again.");
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredListings = listings.filter((listing) => {
    const crop = listing.cropId;
    if (!crop) return false; // Skip if cropId is not populated

    return (
      crop.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getImageUrl = (imagePath) => {
    return `${
      process.env.NODE_ENV === "development"
        ? import.meta.env.VITE_API_URL
        : import.meta.env.VITE_API_URL
    }${imagePath}`;
  };

  const getContactInfo = (listing) => {
    const preference = listing.contactPreference || "both";
    const seller = listing.sellerId || {};

    if (preference === "phone" || preference === "both") {
      return { type: "phone", value: seller.phoneNumber };
    } else if (preference === "email") {
      return { type: "email", value: seller.email };
    }
    return { type: "both", value: seller.phoneNumber };
  };

  const handleContactSeller = (listing) => {
    const seller = listing.sellerId;
    if (!seller) {
      toast.error("Seller information not available");
      return;
    }

    console.log("Opening chat with seller:", seller);
    console.log("Current user in chat:", currentUser);

    // Open chat modal
    setSelectedListing(listing);
    setChatModalOpen(true);
  };

  const handlePurchase = async (listing) => {
    // Default quantity to minimum order quantity or 1
    const defaultQuantity = listing.minOrderQuantity || 1;
    addToBasket(listing._id, defaultQuantity);
  };

  const addToBasket = async (listingId, quantity) => {
    if (addingToBasketId) return;

    setAddingToBasketId(listingId);
    try {
      await orderService.addToBasket(listingId, quantity);
      toast.success("Item added to your order basket!");

      // Optionally navigate to basket
      if (window.confirm("Item added to basket. View your order basket now?")) {
        navigate("/buyer/order-basket");
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setAddingToBasketId(null);
    }
  };

  // Check if user is a farmer
  const isFarmer = currentUser?.userType === "farmer";

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-green-800 mb-2">Marketplace</h2>
        <p className="text-gray-600">
          Browse crops listed for sale from local farmers
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search crops, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
          />
        </div>

        {/* View Toggle */}
        <div className="border border-gray-300 rounded-md p-1 flex self-end">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1 rounded ${
              viewMode === "grid"
                ? "bg-green-100 text-green-800"
                : "text-gray-500 hover:bg-gray-100"
            }`}
            title="Grid View"
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1 rounded ${
              viewMode === "list"
                ? "bg-green-100 text-green-800"
                : "text-gray-500 hover:bg-gray-100"
            }`}
            title="List View"
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="h-8 w-8 text-green-500 animate-spin mr-2" />
          <p className="text-gray-600">Loading marketplace...</p>
        </div>
      ) : filteredListings.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => {
              const crop = listing.cropId;
              const seller = listing.sellerId;
              if (!crop) return null;

              return (
                <div
                  key={listing._id}
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <div className="h-48 bg-gray-100 relative">
                    {crop.images && crop.images.length > 0 ? (
                      <img
                        src={getImageUrl(crop.images[0])}
                        alt={crop.cropName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Wheat className="h-12 w-12" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        Marketplace
                      </span>

                      {crop.organic && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          Organic
                        </span>
                      )}

                      {listing.negotiable && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          Negotiable
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {crop.cropName}
                    </h3>

                    {/* Seller information */}
                    {seller && (
                      <div className="flex items-center mt-1 mb-2 text-sm text-gray-600">
                        <User className="h-4 w-4 mr-1 text-gray-500" />
                        <span>
                          Seller: {seller.fullName || "Unknown Seller"}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-2 mb-3">
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {crop.location}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(crop.harvestDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {crop.quantity} {crop.unit} available
                      </span>
                      <span className="font-bold text-green-700">
                        ₹{crop.pricePerUnit}/{crop.unit}
                      </span>
                    </div>

                    <div className="mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-1" />
                        Min. order: {listing.minOrderQuantity} {crop.unit}
                      </div>
                    </div>

                    {listing.notes && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {listing.notes}
                      </p>
                    )}

                    {!isFarmer && (
                      <div className="mt-4 flex gap-2">
                        <button
                          className="flex-1 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-md flex items-center justify-center"
                          onClick={() => handleContactSeller(listing)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact
                        </button>
                        <button
                          className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center justify-center"
                          onClick={() => handlePurchase(listing)}
                          disabled={addingToBasketId === listing._id}
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          {addingToBasketId === listing._id
                            ? "Adding..."
                            : "Purchase"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Crop
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seller
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min. Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  {!isFarmer && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredListings.map((listing) => {
                  const crop = listing.cropId;
                  const seller = listing.sellerId;
                  if (!crop) return null;

                  return (
                    <tr key={listing._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {crop.images && crop.images.length > 0 ? (
                            <img
                              src={getImageUrl(crop.images[0])}
                              alt={crop.cropName}
                              className="h-10 w-10 rounded-full object-cover mr-3"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                              <Wheat className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div className="text-sm font-medium text-gray-900">
                            {crop.cropName}
                            <div className="flex gap-1 mt-1">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">
                                Marketplace
                              </span>
                              {crop.organic && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Organic
                                </span>
                              )}
                              {listing.negotiable && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Negotiable
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {seller ? seller.fullName : "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {crop.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {listing.minOrderQuantity} {crop.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {crop.quantity} {crop.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-700">
                        ₹{crop.pricePerUnit}/{crop.unit}
                      </td>
                      {!isFarmer && (
                        <td className="px-6 py-4 whitespace-nowrap flex text-sm font-medium space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900 px-2 py-1 border border-blue-600 rounded-md flex items-center"
                            onClick={() => handleContactSeller(listing)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Contact
                          </button>
                          <button
                            className="text-green-600 bg-green-50 hover:bg-green-100 px-2 py-1 border border-green-600 rounded-md flex items-center"
                            onClick={() => handlePurchase(listing)}
                            disabled={addingToBasketId === listing._id}
                          >
                            <ShoppingBag className="h-4 w-4 mr-1" />
                            {addingToBasketId === listing._id
                              ? "Adding..."
                              : "Purchase"}
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <Wheat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No crops in the marketplace
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? "Try adjusting your search"
              : "Check back later for new listings"}
          </p>
        </div>
      )}

      {/* Chat Modal */}
      {chatModalOpen && selectedListing && (
        <ChatModal
          isOpen={chatModalOpen}
          onClose={() => {
            setChatModalOpen(false);
            setSelectedListing(null);
          }}
          recipient={selectedListing.sellerId}
          listing={selectedListing}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default BuySellMarket;
