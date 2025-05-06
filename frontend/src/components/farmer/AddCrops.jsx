import React, { useState, useRef } from "react";
import {
  Check,
  Leaf,
  AlertCircle,
  ArrowLeft,
  X,
  Upload,
  Trash,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cropService } from "../../services/cropService";
import { toast } from "react-hot-toast";

export default function AddCrops() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cropName: "",
    quantity: "",
    pricePerUnit: "",
    unit: "kg",
    harvestDate: "",
    description: "",
    location: "",
    organic: false,
    images: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      // Limit to 5 images
      const selectedFiles = Array.from(files);
      const totalFiles = [...formData.images, ...selectedFiles].slice(0, 5);

      setFormData((prev) => ({
        ...prev,
        images: totalFiles,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!formData.cropName.trim()) newErrors.cropName = "Crop name is required";
    if (!formData.quantity.trim()) newErrors.quantity = "Quantity is required";
    if (isNaN(Number(formData.quantity)))
      newErrors.quantity = "Quantity must be a number";
    if (!formData.pricePerUnit.trim())
      newErrors.pricePerUnit = "Price is required";
    if (isNaN(Number(formData.pricePerUnit)))
      newErrors.pricePerUnit = "Price must be a number";
    if (!formData.harvestDate)
      newErrors.harvestDate = "Harvest date is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to the first error
      const firstError = document.querySelector(".text-red-600");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData to handle file uploads
      const formDataToSend = new FormData();

      // Add text fields
      formDataToSend.append("cropName", formData.cropName);
      formDataToSend.append("quantity", formData.quantity);
      formDataToSend.append("pricePerUnit", formData.pricePerUnit);
      formDataToSend.append("unit", formData.unit);
      formDataToSend.append("harvestDate", formData.harvestDate);
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("location", formData.location);
      formDataToSend.append("organic", formData.organic);

      // Add images
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image) => {
          formDataToSend.append("images", image);
        });
      }

      await cropService.addCrop(formDataToSend);
      toast.success("Crop added successfully!");
      setSubmitSuccess(true);

      // Reset form after success
      setTimeout(() => {
        navigate("/farmer/your-crops");
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error?.message || error || "Failed to add crop. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl p-8 text-center shadow-xl">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Success!</h3>
            <p className="text-gray-600 mb-4">
              Your crop has been added successfully.
            </p>
            <p className="text-gray-500">Redirecting to your crops list...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/farmer")}
          className="flex items-center text-green-700 hover:text-green-900 mb-6 transition duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Back to Dashboard</span>
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-green-800 mb-2">
            Add New Crop
          </h2>
          <p className="text-gray-600">
            Fill in the details below to add your crop to the marketplace
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6 sm:p-8">
              {/* Basic Information Section */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center border-b pb-2">
                  <Leaf className="h-5 w-5 mr-2 text-green-600" />
                  Basic Crop Information
                </h3>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="cropName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Crop Name*
                    </label>
                    <input
                      type="text"
                      id="cropName"
                      name="cropName"
                      value={formData.cropName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.cropName ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                      placeholder="e.g., Tomatoes, Rice, Wheat"
                    />
                    {errors.cropName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.cropName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="quantity"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Quantity*
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          id="quantity"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 rounded-l-lg border ${
                            errors.quantity
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                          placeholder="Quantity"
                        />
                        <select
                          name="unit"
                          value={formData.unit}
                          onChange={handleChange}
                          className="px-3 py-2 rounded-r-lg border-y border-r border-gray-300 bg-gray-50"
                        >
                          <option value="kg">kg</option>
                          <option value="ton">ton</option>
                          <option value="pound">pound</option>
                          <option value="bushel">bushel</option>
                        </select>
                      </div>
                      {errors.quantity && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.quantity}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="pricePerUnit"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Price per {formData.unit}*
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          $
                        </span>
                        <input
                          type="text"
                          id="pricePerUnit"
                          name="pricePerUnit"
                          value={formData.pricePerUnit}
                          onChange={handleChange}
                          className={`w-full pl-8 pr-4 py-2 rounded-lg border ${
                            errors.pricePerUnit
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                          placeholder="0.00"
                        />
                      </div>
                      {errors.pricePerUnit && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.pricePerUnit}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Details Section */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center border-b pb-2">
                  <Leaf className="h-5 w-5 mr-2 text-green-600" />
                  Additional Details
                </h3>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="harvestDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Harvest Date*
                      </label>
                      <input
                        type="date"
                        id="harvestDate"
                        name="harvestDate"
                        value={formData.harvestDate}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.harvestDate
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                      />
                      {errors.harvestDate && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.harvestDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Location*
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.location ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                        placeholder="City, State, Country"
                      />
                      {errors.location && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.location}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Describe your crops (quality, variety, etc.)"
                    ></textarea>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="organic"
                      name="organic"
                      checked={formData.organic}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="organic"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Organically grown
                    </label>
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center border-b pb-2">
                  <Leaf className="h-5 w-5 mr-2 text-green-600" />
                  Upload Images (Optional)
                </h3>

                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-2">
                    Upload up to 5 high-quality images of your crops. Buyers are
                    more likely to purchase crops with clear images.
                  </p>
                  <div className="flex items-center text-sm text-green-600 mb-4">
                    <Check className="h-4 w-4 mr-1" />
                    <span>You can upload multiple images at once</span>
                  </div>
                </div>

                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    formData.images.length >= 5
                      ? "border-gray-300 bg-gray-50"
                      : "border-gray-300 hover:border-green-500 cursor-pointer"
                  }`}
                  onClick={
                    formData.images.length >= 5 ? undefined : triggerFileInput
                  }
                >
                  <input
                    type="file"
                    id="images"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                    ref={fileInputRef}
                    disabled={formData.images.length >= 5}
                  />

                  <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                    <Upload className="h-6 w-6 text-green-600" />
                  </div>

                  {formData.images.length >= 5 ? (
                    <p className="text-sm text-gray-500">
                      Maximum number of images reached (5). Remove some to add
                      more.
                    </p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600">
                        Drag and drop images here, or click to select files
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.images.length}/5 images uploaded
                      </p>
                    </>
                  )}
                </div>

                {formData.images.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Preview ({formData.images.length}/5)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      {formData.images.map((file, index) => (
                        <div
                          key={index}
                          className="aspect-square rounded-md bg-gray-100 relative overflow-hidden group"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Crop image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index);
                              }}
                              className="bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove image"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1.5 py-0.5 rounded">
                            {(file.size / 1024 / 1024).toFixed(1)} MB
                          </div>
                        </div>
                      ))}

                      {/* Empty slots to show available space */}
                      {Array.from({
                        length: Math.max(0, 5 - formData.images.length),
                      }).map((_, index) => (
                        <div
                          key={`empty-${index}`}
                          className="aspect-square rounded-md border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-green-500 transition-colors"
                          onClick={triggerFileInput}
                        >
                          <Upload className="h-6 w-6 text-gray-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <button
                type="button"
                onClick={() => navigate("/farmer")}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  isSubmitting
                    ? "opacity-75 cursor-not-allowed"
                    : "hover:bg-green-700"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Add Crop"}
                {!isSubmitting && <Check className="ml-2 h-4 w-4" />}
              </button>
            </div>
          </form>
        </div>

        <p className="text-sm text-gray-500 mt-4 text-center">
          * Required fields
        </p>
      </div>
    </div>
  );
}
