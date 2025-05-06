import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  Filter,
  Wheat,
  Loader,
  Image as ImageIcon,
  Grid,
  List,
  Calendar,
  MapPin,
  DollarSign,
  Trash2,
  AlertTriangle,
  ShoppingBag,
  Edit,
  Save,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cropService } from "../../services/cropService";
import { marketplaceService } from "../../services/marketplaceService";
import { toast } from "react-hot-toast";

export default function YourCrops() {
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, available, sold
  const [selectedImage, setSelectedImage] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  const [cropToDelete, setCropToDelete] = useState(null); // New state for delete confirmation
  const [isDeleting, setIsDeleting] = useState(false); // New state for delete operation
  const [isListing, setIsListing] = useState(false); // New state for marketplace listing operation
  const [marketplaceListings, setMarketplaceListings] = useState([]); // Track which crops are listed

  // New state for edit functionality
  const [cropToEdit, setCropToEdit] = useState(null); // State to track which crop is being edited
  const [editFormData, setEditFormData] = useState({}); // State to track form data during edit
  const [isUpdating, setIsUpdating] = useState(false); // State to track update operation

  // Fetch crops data when component mounts
  useEffect(() => {
    fetchCrops();
    fetchMarketplaceListings();
  }, []);

  const fetchCrops = async () => {
    setIsLoading(true);
    try {
      const fetchedCrops = await cropService.getUserCrops();
      setCrops(fetchedCrops || []);
    } catch (error) {
      console.error("Error fetching crops:", error);
      toast.error(error || "Failed to fetch your crops. Please try again.");
      setCrops([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMarketplaceListings = async () => {
    try {
      const listings = await marketplaceService.getMyListings();
      // Extract cropIds from listings to track which crops are already listed
      const listedCropIds = listings.map(
        (listing) => listing.cropId._id || listing.cropId
      );
      setMarketplaceListings(listedCropIds);
    } catch (error) {
      console.error("Error fetching marketplace listings:", error);
      // Don't show error toast as this is secondary functionality
    }
  };

  const handleStatusChange = async (cropId, newStatus) => {
    try {
      await cropService.updateCropStatus(cropId, newStatus);
      toast.success(`Crop marked as ${newStatus}`);

      // Update the local state
      setCrops((prevCrops) =>
        prevCrops.map((crop) =>
          crop._id === cropId ? { ...crop, status: newStatus } : crop
        )
      );
    } catch (error) {
      console.error("Error updating crop status:", error);
      toast.error(error || "Failed to update crop status. Please try again.");
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "table" ? "grid" : "table");
  };

  const filteredCrops = crops.filter((crop) => {
    // Apply search term filter
    const matchesSearch =
      crop.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.location.toLowerCase().includes(searchTerm.toLowerCase());

    // Apply status filter
    const matchesFilter = filter === "all" || crop.status === filter;

    return matchesSearch && matchesFilter;
  });

  const getImageUrl = (imagePath) => {
    return `${
      process.env.NODE_ENV === "development"
        ? import.meta.env.VITE_API_URL
        : import.meta.env.VITE_API_URL
    }${imagePath}`;
  };

  const handleDeleteCrop = async (cropId) => {
    try {
      setIsDeleting(true);
      await cropService.deleteCrop(cropId);
      toast.success("Crop deleted successfully");

      // Update the local state
      setCrops((prevCrops) => prevCrops.filter((crop) => crop._id !== cropId));
      setCropToDelete(null); // Close the confirmation modal
    } catch (error) {
      console.error("Error deleting crop:", error);
      toast.error(error || "Failed to delete crop. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleListInMarketplace = async (cropId) => {
    try {
      setIsListing(true);

      // Check if the crop is already listed
      const isAlreadyListed = marketplaceListings.includes(cropId);

      if (isAlreadyListed) {
        // If already listed, remove from marketplace
        await marketplaceService.removeCropFromMarketplace(cropId);
        setMarketplaceListings((prev) => prev.filter((id) => id !== cropId));
        toast.success("Crop removed from marketplace");
      } else {
        // If not listed, add to marketplace
        await marketplaceService.listCropInMarketplace({ cropId });
        setMarketplaceListings((prev) => [...prev, cropId]);
        toast.success("Crop listed in marketplace successfully");
      }

      // Make sure the crop is marked as available if we're listing it
      if (!isAlreadyListed) {
        const crop = crops.find((c) => c._id === cropId);
        if (crop && crop.status !== "available") {
          await handleStatusChange(cropId, "available");
        }
      }
    } catch (error) {
      console.error("Error listing in marketplace:", error);
      toast.error(
        error || "Failed to update marketplace listing. Please try again."
      );
    } finally {
      setIsListing(false);
    }
  };

  // New function to handle opening the edit modal
  const handleEditCrop = (crop) => {
    setCropToEdit(crop);
    setEditFormData({
      cropName: crop.cropName,
      location: crop.location,
      quantity: crop.quantity,
      unit: crop.unit,
      pricePerUnit: crop.pricePerUnit,
      harvestDate: crop.harvestDate
        ? new Date(crop.harvestDate).toISOString().split("T")[0]
        : "",
      organic: crop.organic || false,
      description: crop.description || "",
    });
  };

  // Function to handle changes in the edit form
  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Function to submit the edit form
  const handleUpdateCrop = async (e) => {
    e.preventDefault();

    if (isUpdating) return;

    setIsUpdating(true);
    try {
      // Prepare the crop data with updated fields
      const cropData = {
        cropName: editFormData.cropName,
        location: editFormData.location,
        quantity: editFormData.quantity,
        unit: editFormData.unit,
        pricePerUnit: editFormData.pricePerUnit,
        harvestDate: editFormData.harvestDate,
        organic: editFormData.organic,
        description: editFormData.description || "",
        status: cropToEdit.status, // Preserve the current status
      };

      // Use the existing updateCrop method to update all fields at once
      await cropService.updateCrop(cropToEdit._id, cropData);

      toast.success("Crop updated successfully");

      // Update the local state
      setCrops((prevCrops) =>
        prevCrops.map((crop) =>
          crop._id === cropToEdit._id ? { ...crop, ...cropData } : crop
        )
      );

      // Close the edit modal
      setCropToEdit(null);
    } catch (error) {
      console.error("Error updating crop:", error);
      toast.error(error || "Failed to update crop. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const renderTableView = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Crop
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Images
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Harvest Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredCrops.map((crop) => (
            <tr key={crop._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {crop.cropName}
                    </div>
                    <div className="text-sm text-gray-500">{crop.location}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {crop.images && crop.images.length > 0 ? (
                  <div className="flex space-x-2">
                    {crop.images.slice(0, 3).map((image, index) => (
                      <div
                        key={index}
                        className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden cursor-pointer"
                        onClick={() => openImageModal(getImageUrl(image))}
                      >
                        <img
                          src={getImageUrl(image)}
                          alt={`${crop.cropName} image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {crop.images.length > 3 && (
                      <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                        +{crop.images.length - 3}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-400 flex items-center">
                    <ImageIcon className="h-4 w-4 mr-1" />
                    No images
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {crop.quantity} {crop.unit}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  ₹{crop.pricePerUnit}/{crop.unit}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {new Date(crop.harvestDate).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    crop.status === "available"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {crop.status === "available" ? "Available" : "Sold"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex flex-col space-y-2">
                  <div className="flex space-x-2">
                    {crop.status === "available" ? (
                      <button
                        onClick={() => handleStatusChange(crop._id, "sold")}
                        className="text-indigo-600 hover:text-indigo-900"
                        disabled={isListing}
                      >
                        Mark as Sold
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleStatusChange(crop._id, "available")
                        }
                        className="text-green-600 hover:text-green-900"
                        disabled={isListing}
                      >
                        Re-list
                      </button>
                    )}

                    {/* Edit button */}
                    <button
                      onClick={() => handleEditCrop(crop)}
                      className="text-blue-600 hover:text-blue-900 flex items-center"
                      disabled={isListing || isUpdating}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>

                    <button
                      onClick={() => setCropToDelete(crop)}
                      className="text-red-600 hover:text-red-900 flex items-center"
                      disabled={isListing || isDeleting}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>

                  <button
                    onClick={() => handleListInMarketplace(crop._id)}
                    className={`flex items-center text-sm ${
                      marketplaceListings.includes(crop._id)
                        ? "text-amber-600 hover:text-amber-700"
                        : "text-green-600 hover:text-green-700"
                    }`}
                    disabled={isListing || crop.status !== "available"}
                  >
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    {marketplaceListings.includes(crop._id)
                      ? "Remove from Market"
                      : "List in Marketplace"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCrops.map((crop) => (
        <div
          key={crop._id}
          className="bg-white rounded-lg shadow overflow-hidden flex flex-col"
        >
          {/* Crop Image */}
          <div className="relative h-48 bg-gray-100">
            {crop.images && crop.images.length > 0 ? (
              <img
                src={getImageUrl(crop.images[0])}
                alt={crop.cropName}
                className="w-full h-full object-cover"
                onClick={() => openImageModal(getImageUrl(crop.images[0]))}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ImageIcon className="h-12 w-12" />
              </div>
            )}
            {/* Status Badge */}
            <span
              className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full 
                ${
                  crop.status === "available"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
            >
              {crop.status === "available" ? "Available" : "Sold"}
            </span>

            {/* Marketplace Badge */}
            {marketplaceListings.includes(crop._id) && (
              <span className="absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                In Marketplace
              </span>
            )}

            {/* Multiple Images Indicator */}
            {crop.images && crop.images.length > 1 && (
              <div className="absolute bottom-2 right-2 flex space-x-1">
                {crop.images.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === 0 ? "bg-white" : "bg-white bg-opacity-60"
                    }`}
                  ></div>
                ))}
              </div>
            )}
          </div>

          {/* Crop Details */}
          <div className="flex-1 p-4">
            <div className="flex justify-between mb-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {crop.cropName}
              </h3>
              <p className="text-green-600 font-bold">
                ₹{crop.pricePerUnit}/{crop.unit}
              </p>
            </div>

            <div className="text-sm text-gray-500 flex items-center mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              {crop.location}
            </div>

            <div className="flex flex-wrap text-sm text-gray-600 gap-4 mb-3">
              <div className="flex items-center">
                <Wheat className="h-4 w-4 mr-1" />
                {crop.quantity} {crop.unit}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(crop.harvestDate).toLocaleDateString()}
              </div>
              {crop.organic && (
                <div className="flex items-center text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Organic
                </div>
              )}
            </div>

            {crop.description && crop.description.length > 0 && (
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {crop.description}
              </p>
            )}
          </div>

          {/* Actions Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                {crop.status === "available" ? (
                  <button
                    onClick={() => handleStatusChange(crop._id, "sold")}
                    className="inline-flex items-center px-3 py-1 border border-indigo-600 text-sm rounded text-indigo-600 hover:bg-indigo-50"
                    disabled={isListing}
                  >
                    Mark as Sold
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(crop._id, "available")}
                    className="inline-flex items-center px-3 py-1 border border-green-600 text-sm rounded text-green-600 hover:bg-green-50"
                    disabled={isListing}
                  >
                    Re-list
                  </button>
                )}

                <div className="flex space-x-2">
                  {/* Edit button */}
                  <button
                    onClick={() => handleEditCrop(crop)}
                    className="inline-flex items-center px-3 py-1 border border-blue-600 text-sm rounded text-blue-600 hover:bg-blue-50"
                    disabled={isListing || isUpdating}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>

                  <button
                    onClick={() => setCropToDelete(crop)}
                    className="inline-flex items-center px-3 py-1 border border-red-600 text-sm rounded text-red-600 hover:bg-red-50"
                    disabled={isListing || isDeleting}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>

              {/* Marketplace Button */}
              <button
                onClick={() => handleListInMarketplace(crop._id)}
                className={`inline-flex items-center justify-center px-3 py-1 border text-sm rounded ${
                  marketplaceListings.includes(crop._id)
                    ? "border-amber-500 text-amber-600 hover:bg-amber-50"
                    : "border-green-500 text-green-600 hover:bg-green-50"
                }`}
                disabled={isListing || crop.status !== "available"}
              >
                <ShoppingBag className="h-4 w-4 mr-1" />
                {marketplaceListings.includes(crop._id)
                  ? "Remove from Market"
                  : "List in Marketplace"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/farmer")}
          className="flex items-center text-green-700 hover:text-green-900 mb-6 transition duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-green-800 mb-2">
              Your Crops
            </h2>
            <p className="text-lg text-gray-600">
              Manage your available harvests
            </p>
          </div>

          <button
            onClick={() => navigate("/farmer/add-crops")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 flex items-center"
          >
            <Wheat className="h-5 w-5 mr-2" />
            Add New Crop
          </button>
        </div>

        {/* Filters, Search, and View Toggle */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          {/* Top Row - Filters and View Toggle */}
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 mb-4">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1 rounded-md ${
                    filter === "all"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("available")}
                  className={`px-3 py-1 rounded-md ${
                    filter === "available"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Available
                </button>
                <button
                  onClick={() => setFilter("sold")}
                  className={`px-3 py-1 rounded-md ${
                    filter === "sold"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Sold
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* View Toggle Buttons */}
              <div className="border border-gray-300 rounded-md p-1 flex">
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
                  onClick={() => setViewMode("table")}
                  className={`p-1 rounded ${
                    viewMode === "table"
                      ? "bg-green-100 text-green-800"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                  title="Table View"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search crops or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full md:w-64"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Loader className="h-10 w-10 text-green-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your crops...</p>
          </div>
        ) : filteredCrops.length > 0 ? (
          viewMode === "table" ? (
            renderTableView()
          ) : (
            renderGridView()
          )
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Wheat className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No crops found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filter !== "all"
                ? "Try adjusting your search or filters"
                : "Start by adding your first crop"}
            </p>
            {!searchTerm && filter === "all" && (
              <button
                onClick={() => navigate("/farmer/add-crops")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                Add Your First Crop
              </button>
            )}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeImageModal}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10 bg-white bg-opacity-75 rounded-full p-1"
              onClick={closeImageModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Crop"
              className="w-full object-contain max-h-[80vh]"
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {cropToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-md w-full bg-white rounded-lg overflow-hidden shadow-xl">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Confirm Deletion
                </h3>
              </div>
              <p className="mb-4 text-gray-600">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{cropToDelete.cropName}</span>?
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setCropToDelete(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteCrop(cropToDelete._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none flex items-center"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                  {!isDeleting && <Trash2 className="ml-2 h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Edit Crop Modal */}
      {cropToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-2xl w-full bg-white rounded-lg overflow-hidden shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Edit Crop Details
                </h3>
                <button
                  onClick={() => setCropToEdit(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateCrop}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Crop Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Crop Name
                    </label>
                    <input
                      type="text"
                      name="cropName"
                      value={editFormData.cropName || ""}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={editFormData.location || ""}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={editFormData.quantity || ""}
                      onChange={handleEditFormChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Unit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <select
                      name="unit"
                      value={editFormData.unit || ""}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Unit</option>
                      <option value="kg">Kilogram (kg)</option>
                      <option value="ton">Ton</option>
                      <option value="pound">Pound (lb)</option>
                      <option value="bushel">Bushel</option>
                    </select>
                  </div>

                  {/* Price Per Unit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price Per Unit (₹)
                    </label>
                    <input
                      type="number"
                      name="pricePerUnit"
                      value={editFormData.pricePerUnit || ""}
                      onChange={handleEditFormChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Harvest Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Harvest Date
                    </label>
                    <input
                      type="date"
                      name="harvestDate"
                      value={editFormData.harvestDate || ""}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Organic Checkbox */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="organic"
                      name="organic"
                      checked={editFormData.organic || false}
                      onChange={handleEditFormChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="organic"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Organically Grown
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editFormData.description || ""}
                    onChange={handleEditFormChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe your crop (optional)"
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setCropToEdit(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none"
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none flex items-center"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Update Crop"}
                    {!isUpdating && <Save className="ml-2 h-4 w-4" />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
