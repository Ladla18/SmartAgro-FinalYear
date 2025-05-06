import React, { useState, useEffect } from "react";
import { cropService } from "../services/cropService";
import { sourcedProductService } from "../services/sourcedProductService";
import { toast } from "react-hot-toast";
import {
  Loader,
  Search,
  Filter,
  Wheat,
  MapPin,
  Calendar,
  DollarSign,
  CheckSquare,
  Square,
  Info,
  Image as ImageIcon,
  PackagePlus,
  User,
  MessageSquare,
} from "lucide-react";

// Import ChatModal component for messaging sellers
import ChatModal from "./ChatModal";

// Function to get image URL (assuming similar structure to BuySellMarket)
const getImageUrl = (imagePath) => {
  // Handle potential null or undefined imagePath
  if (!imagePath) {
    return null; // Or return a default placeholder image URL
  }
  // Use Vite's way to access env variables, prefixed with VITE_
  const baseUrl =
    import.meta.env.VITE_API_URL ||
    "https://smart-agriculture-app.onrender.com";
  return `${baseUrl}${imagePath}`;
};

// Updated Listing Card Design
const ListingCardPlaceholder = ({
  listing,
  onSource,
  isSourced,
  isLoading,
}) => {
  const crop = listing.cropId;
  const seller = listing.sellerId; // Assuming sellerId might be populated
  const imageUrl =
    crop?.images?.length > 0 ? getImageUrl(crop.images[0]) : null;

  if (!crop) return null; // Don't render card if crop data is missing

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full bg-white">
      {/* Image with badges */}
      <div className="h-48 bg-gray-100 relative flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={crop.cropName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ImageIcon className="h-12 w-12" />
          </div>
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {crop.organic && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full shadow-sm">
              Organic
            </span>
          )}
          {listing.negotiable && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full shadow-sm">
              Negotiable
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-grow">
        <h3
          className="font-semibold text-lg text-gray-900 mb-2 truncate"
          title={crop.cropName}
        >
          {crop.cropName}
        </h3>

        <div className="flex items-center mb-3 text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" />
          <span className="truncate">{crop.location}</span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-700">
              <DollarSign className="h-4 w-4 mr-1 text-green-600" />
              <span className="font-medium">
                ₹{crop.pricePerUnit}/{crop.unit}
              </span>
            </div>
            <div className="flex items-center text-gray-700">
              <Wheat className="h-4 w-4 mr-1 text-amber-600" />
              <span>
                {crop.quantity} {crop.unit}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div
              className="flex items-center text-gray-700"
              title={`Minimum Order: ${listing.minOrderQuantity} ${crop.unit}`}
            >
              <CheckSquare className="h-4 w-4 mr-1 text-blue-600" />
              <span>
                Min: {listing.minOrderQuantity} {crop.unit}
              </span>
            </div>
            <div className="flex items-center text-gray-700">
              <Calendar className="h-4 w-4 mr-1 text-purple-600" />
              <span>{new Date(crop.harvestDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {seller && (
          <div className="flex items-center mt-auto mb-3 text-xs text-gray-600">
            <User className="h-3 w-3 mr-1" />
            <span>Seller: {seller.fullName || "N/A"}</span>
          </div>
        )}

        {/* Source Product Button */}
        <button
          onClick={() => onSource(listing._id)}
          disabled={isSourced || isLoading}
          className={`w-full flex items-center justify-center px-4 py-2.5 rounded-md text-sm font-medium text-white 
            ${
              isSourced
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            } 
            transition-colors shadow
            ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {isSourced ? (
            <>
              <CheckSquare className="h-4 w-4 mr-2" />
              Sourced
            </>
          ) : (
            <>
              <PackagePlus className="h-4 w-4 mr-2" />
              {isLoading ? "Processing..." : "Source this Product"}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Add debugging function
const handleTestAuth = async () => {
  try {
    const result = await sourcedProductService.testAuth();
    toast.success(`Auth test successful! User: ${result.user.email}`);
  } catch (error) {
    toast.error(`Auth test failed: ${error.toString()}`);
  }
};

export const ProductSearchFilter = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    organic: null, // null (any), true (organic), false (not organic)
    minQuantity: "",
    maxPrice: "",
    location: "",
    harvestDateStart: "",
    harvestDateEnd: "",
    negotiable: null, // null (any), true (negotiable), false (not negotiable)
    unit: "",
  });
  const [sourcingInProgress, setSourcingInProgress] = useState(false);
  const [sourcedListingIds, setSourcedListingIds] = useState(new Set());
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user data from local storage or service
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setCurrentUser(user);
    }

    fetchListings();
    fetchSourcedProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [listings, filters, searchTerm]); // Re-apply filters when listings, filters, or search term change

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const marketplaceListings = await cropService.getMarketplaceListings();
      setListings(marketplaceListings || []);
      setFilteredListings(marketplaceListings || []); // Initialize filtered list
    } catch (error) {
      console.error("Error fetching marketplace listings:", error);
      toast.error("Failed to load marketplace listings");
      setListings([]);
      setFilteredListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSourcedProducts = async () => {
    try {
      const sourcedProducts = await sourcedProductService.getSourcedProducts();
      const sourcedIds = new Set(
        sourcedProducts.map(
          (product) => product.listingId._id || product.listingId
        )
      );
      setSourcedListingIds(sourcedIds);
    } catch (error) {
      console.error("Error fetching sourced products:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // Handle tri-state checkboxes (null, true, false) if needed, or simple boolean
      if (name === "organic" || name === "negotiable") {
        // Example for a simple boolean toggle (can be enhanced for tri-state)
        setFilters((prev) => ({ ...prev, [name]: checked ? true : null }));
      } else {
        setFilters((prev) => ({ ...prev, [name]: checked }));
      }
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTriStateToggle = (name) => {
    setFilters((prev) => {
      const currentValue = prev[name];
      let nextValue;
      if (currentValue === null) {
        nextValue = true; // null -> true
      } else if (currentValue === true) {
        nextValue = false; // true -> false
      } else {
        nextValue = null; // false -> null
      }
      return { ...prev, [name]: nextValue };
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilters({
      organic: null,
      minQuantity: "",
      maxPrice: "",
      location: "",
      harvestDateStart: "",
      harvestDateEnd: "",
      negotiable: null,
      unit: "",
    });
  };

  const handleSourceProduct = async (listingId) => {
    // Check if already sourced
    if (sourcedListingIds.has(listingId)) {
      toast.success("This product is already in your sourced items");
      return;
    }

    if (sourcingInProgress) return; // Prevent multiple clicks

    setSourcingInProgress(true);
    try {
      // Check if user is logged in
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to source products");
        return;
      }

      await sourcedProductService.sourceProduct(listingId);

      // Update local state to reflect the change
      setSourcedListingIds((prev) => {
        const updated = new Set(prev);
        updated.add(listingId);
        return updated;
      });

      toast.success("Product added to your sourced items!");
    } catch (error) {
      console.error("Error sourcing product:", error);
      if (error.toString().includes("Authentication required")) {
        toast.error("Please log in to source products");
      } else if (error.toString().includes("already sourced")) {
        toast.success("This product is already in your sourced items");
        // Update local state in case our local state is out of sync
        setSourcedListingIds((prev) => {
          const updated = new Set(prev);
          updated.add(listingId);
          return updated;
        });
      } else {
        toast.error(
          typeof error === "string" ? error : "Failed to source product"
        );
      }
    } finally {
      setSourcingInProgress(false);
    }
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

  const applyFilters = () => {
    let tempFiltered = [...listings];

    // Search Term Filter (Crop Name or Location)
    if (searchTerm) {
      tempFiltered = tempFiltered.filter((listing) => {
        const crop = listing.cropId;
        return (
          crop &&
          (crop.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            crop.location.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
    }

    // Advanced Filters
    tempFiltered = tempFiltered.filter((listing) => {
      const crop = listing.cropId;
      if (!crop) return false; // Skip if crop data is missing

      // Organic Filter
      if (filters.organic !== null && crop.organic !== filters.organic) {
        return false;
      }

      // Min Quantity Filter
      if (
        filters.minQuantity &&
        crop.quantity < parseFloat(filters.minQuantity)
      ) {
        return false;
      }

      // Max Price Filter
      if (
        filters.maxPrice &&
        crop.pricePerUnit > parseFloat(filters.maxPrice)
      ) {
        return false;
      }

      // Location Filter (partial match)
      if (
        filters.location &&
        !crop.location.toLowerCase().includes(filters.location.toLowerCase())
      ) {
        return false;
      }

      // Harvest Date Range Filter
      if (filters.harvestDateStart) {
        const startDate = new Date(filters.harvestDateStart);
        const harvestDate = new Date(crop.harvestDate);
        if (harvestDate < startDate) return false;
      }
      if (filters.harvestDateEnd) {
        const endDate = new Date(filters.harvestDateEnd);
        // Add 1 day to endDate to make it inclusive
        endDate.setDate(endDate.getDate() + 1);
        const harvestDate = new Date(crop.harvestDate);
        if (harvestDate >= endDate) return false;
      }

      // Negotiable Filter
      if (
        filters.negotiable !== null &&
        listing.negotiable !== filters.negotiable
      ) {
        return false;
      }

      // Unit Filter
      if (
        filters.unit &&
        crop.unit.toLowerCase() !== filters.unit.toLowerCase()
      ) {
        return false;
      }

      return true; // Listing passes all filters
    });

    setFilteredListings(tempFiltered);
  };

  // Helper to render tri-state checkbox icon
  const renderTriStateIcon = (state) => {
    if (state === true)
      return <CheckSquare className="h-5 w-5 text-blue-600" />;
    if (state === false) return <Square className="h-5 w-5 text-red-600" />;
    return <Square className="h-5 w-5 text-gray-400" />; // null state
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-800">
          Advanced Product Search
        </h2>

        {/* Debug button - only show in development */}
        {import.meta.env.DEV && (
          <button
            onClick={handleTestAuth}
            className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded hover:bg-gray-300"
          >
            Test Auth
          </button>
        )}
      </div>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search Bar */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search by Crop Name or Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                name="search"
                placeholder="e.g., Organic Tomatoes or California"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="e.g., Florida"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Min Quantity Filter */}
          <div>
            <label
              htmlFor="minQuantity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Min. Available Quantity
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Wheat className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="minQuantity"
                name="minQuantity"
                placeholder="e.g., 100"
                min="0"
                value={filters.minQuantity}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Max Price Filter */}
          <div>
            <label
              htmlFor="maxPrice"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Max. Price per Unit (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                placeholder="e.g., 5.00"
                min="0"
                step="0.01"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Unit Filter */}
          <div>
            <label
              htmlFor="unit"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Unit Type
            </label>
            <select
              id="unit"
              name="unit"
              value={filters.unit}
              onChange={handleFilterChange}
              className="w-full py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any Unit</option>
              <option value="kg">kg</option>
              <option value="ton">ton</option>
              <option value="pound">pound</option>
              <option value="bushel">bushel</option>
            </select>
          </div>

          {/* Harvest Date Filters */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="harvestDateStart"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Harvested After
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="harvestDateStart"
                  name="harvestDateStart"
                  value={filters.harvestDateStart}
                  onChange={handleFilterChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="harvestDateEnd"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Harvested Before
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="harvestDateEnd"
                  name="harvestDateEnd"
                  value={filters.harvestDateEnd}
                  onChange={handleFilterChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Boolean Toggles (Organic, Negotiable) */}
          <div className="flex items-end space-x-6">
            {/* Organic Toggle */}
            <button
              type="button"
              onClick={() => handleTriStateToggle("organic")}
              className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-blue-600"
              title={`Cycle Organic Filter (Current: ${
                filters.organic === null
                  ? "Any"
                  : filters.organic
                  ? "Organic Only"
                  : "Non-Organic Only"
              })`}
            >
              {renderTriStateIcon(filters.organic)}
              <span>Organic</span>
              <Info className="h-4 w-4 text-gray-400" />
            </button>

            {/* Negotiable Toggle */}
            <button
              type="button"
              onClick={() => handleTriStateToggle("negotiable")}
              className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-blue-600"
              title={`Cycle Negotiable Filter (Current: ${
                filters.negotiable === null
                  ? "Any"
                  : filters.negotiable
                  ? "Negotiable Only"
                  : "Non-Negotiable Only"
              })`}
            >
              {renderTriStateIcon(filters.negotiable)}
              <span>Negotiable Price</span>
              <Info className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>
        {/* Reset Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={resetFilters}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {filteredListings.length} Result
          {filteredListings.length !== 1 ? "s" : ""} Found
        </h3>
        {isLoading ? (
          <div className="text-center p-10">
            <Loader className="animate-spin h-8 w-8 text-blue-500 mx-auto" />
            <p className="mt-2 text-gray-500">Loading listings...</p>
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <ListingCardPlaceholder
                key={listing._id}
                listing={listing}
                onSource={handleSourceProduct}
                isSourced={sourcedListingIds.has(listing._id)}
                isLoading={sourcingInProgress}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-gray-50 rounded-lg">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              No listings match your current filters.
            </p>
            <p className="text-sm text-gray-500">
              Try adjusting your search or filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

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

// Export if needed, or keep as named export within the file if only used here
// export default ProductSearchFilter;
