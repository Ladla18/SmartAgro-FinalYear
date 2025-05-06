import React, { useState, useEffect } from "react";
import {
  Trash2,
  ShoppingBag,
  CreditCard,
  Truck,
  Loader,
  ArrowLeft,
  Wheat,
  Plus,
  Minus,
  Home,
  Check,
} from "lucide-react";
import { orderService } from "../services/orderService";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const OrderBasket = () => {
  const [orderBasket, setOrderBasket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState("items"); // 'items' or 'checkout'
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    paymentMethod: "credit_card",
    notes: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderBasket();
  }, []);

  const fetchOrderBasket = async () => {
    setIsLoading(true);
    try {
      const basket = await orderService.getOrderBasket();
      setOrderBasket(basket);
    } catch (error) {
      console.error("Error fetching order basket:", error);
      toast.error("Failed to load your order basket");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await orderService.updateItemQuantity(itemId, newQuantity);
      await fetchOrderBasket(); // Refresh basket data
      toast.success("Quantity updated");
    } catch (error) {
      toast.error(error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;

    try {
      await orderService.removeFromBasket(itemId);
      await fetchOrderBasket(); // Refresh basket data
      toast.success("Item removed from basket");
    } catch (error) {
      toast.error(error);
    }
  };

  const handleClearBasket = async () => {
    if (!window.confirm("Are you sure you want to clear your entire basket?"))
      return;

    try {
      await orderService.clearBasket();
      await fetchOrderBasket(); // Refresh basket data
      toast.success("Basket cleared");
    } catch (error) {
      toast.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const shippingAddress = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      };

      const result = await orderService.checkout({
        shippingAddress,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      });

      toast.success("Order placed successfully! View your order details.");

      // Navigate to the order management page with order ID
      if (result && result._id) {
        navigate(`/buyer/orders/${result._id}`);
      } else {
        navigate("/buyer/orders");
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getImageUrl = (imagePath) => {
    return `${
      process.env.NODE_ENV === "development"
        ? import.meta.env.VITE_API_URL
        : import.meta.env.VITE_API_URL
    }${imagePath}`;
  };

  const handleProceedToCheckout = () => {
    if (!orderBasket || orderBasket.items.length === 0) {
      toast.error("Your basket is empty");
      return;
    }
    setActiveStep("checkout");
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-green-800">Order Basket</h2>
          {activeStep === "checkout" && (
            <button
              onClick={() => setActiveStep("items")}
              className="flex items-center text-green-600 hover:text-green-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Items
            </button>
          )}
        </div>
        <p className="text-gray-600">
          {activeStep === "items"
            ? "Review your selected items before checkout"
            : "Complete your order details"}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="h-8 w-8 text-green-500 animate-spin mr-2" />
          <p className="text-gray-600">Loading your order basket...</p>
        </div>
      ) : !orderBasket || orderBasket.items.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Your basket is empty
          </h3>
          <p className="text-gray-500 mb-4">
            Add items to your basket from the marketplace
          </p>
          <button
            onClick={() => navigate("/buyer/marketplace")}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Browse Marketplace
          </button>
        </div>
      ) : activeStep === "items" ? (
        <div className="space-y-6">
          {/* Order Items Section */}
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orderBasket.items.map((item) => {
                  const crop = item.cropId;
                  if (!crop) return null;

                  return (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {crop.images && crop.images.length > 0 ? (
                            <img
                              src={getImageUrl(crop.images[0])}
                              alt={crop.cropName}
                              className="h-12 w-12 rounded-md object-cover mr-3"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center mr-3">
                              <Wheat className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {crop.cropName}
                            </div>
                            <div className="text-sm text-gray-500">
                              Seller:{" "}
                              {item.listingId?.sellerId?.fullName || "Unknown"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="text-sm font-semibold text-gray-700">
                          ₹{item.pricePerUnit}/{item.unit}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity - 1)
                            }
                            className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4 text-gray-600" />
                          </button>
                          <span className="text-sm font-medium text-gray-700 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity + 1)
                            }
                            className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
                          >
                            <Plus className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <span className="font-semibold">
                          ₹{item.subtotal.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Order Summary */}
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start">
            <div className="flex-1">
              <button
                onClick={handleClearBasket}
                className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Basket
              </button>
            </div>
            <div className="w-full md:w-80 bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-medium text-gray-900">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    <span className="font-semibold">
                      ₹{orderBasket.total.toFixed(2)}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-green-700">
                    <span className="font-semibold">
                      ₹{orderBasket.total.toFixed(2)}
                    </span>
                  </span>
                </div>
              </div>
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Checkout Form Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">
              Shipping Information
            </h3>
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label
                  htmlFor="street"
                  className="block text-sm font-medium text-gray-700"
                >
                  Street Address
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State/Province
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ZIP/Postal Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Payment Method
                </h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center">
                    <input
                      id="credit_card"
                      name="paymentMethod"
                      type="radio"
                      value="credit_card"
                      checked={formData.paymentMethod === "credit_card"}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <label
                      htmlFor="credit_card"
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      Credit Card
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="bank_transfer"
                      name="paymentMethod"
                      type="radio"
                      value="bank_transfer"
                      checked={formData.paymentMethod === "bank_transfer"}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <label
                      htmlFor="bank_transfer"
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      Bank Transfer
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="cash_on_delivery"
                      name="paymentMethod"
                      type="radio"
                      value="cash_on_delivery"
                      checked={formData.paymentMethod === "cash_on_delivery"}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <label
                      htmlFor="cash_on_delivery"
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      Cash on Delivery
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Order Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </form>
          </div>

          {/* Order Summary Section */}
          <div className="bg-gray-50 p-6 rounded-lg space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>

            <div className="space-y-4">
              {orderBasket.items.map((item) => {
                const crop = item.cropId;
                if (!crop) return null;

                return (
                  <div
                    key={item._id}
                    className="flex justify-between items-center py-2"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center mr-3">
                        {crop.images && crop.images.length > 0 ? (
                          <img
                            src={getImageUrl(crop.images[0])}
                            alt={crop.cropName}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        ) : (
                          <Wheat className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {crop.cropName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.quantity} {item.unit} × ₹{item.pricePerUnit}
                        </div>
                      </div>
                    </div>
                    <div className="font-medium text-gray-900">
                      <span className="font-semibold">
                        ₹{item.subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-b py-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  <span className="font-semibold">
                    ₹{orderBasket.total.toFixed(2)}
                  </span>
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxes</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Total</span>
              <span className="text-xl font-bold text-green-700">
                <span className="font-bold text-xl text-green-700">
                  ₹{orderBasket.total.toFixed(2)}
                </span>
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Place Order
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              By placing this order, you agree to our terms and conditions. All
              items will be delivered directly from farmers to your location.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderBasket;
