import React, { useState, useEffect } from "react";
import { orderService } from "../services/orderService";
import { useNavigate, useParams } from "react-router-dom";
import {
  Loader,
  ShoppingBag,
  Package,
  Truck,
  Calendar,
  CheckCircle,
  FileText,
  ArrowLeft,
  Search,
  Eye,
} from "lucide-react";
import { toast } from "react-hot-toast";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState("list"); // 'list' or 'details'
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
      setView("details");
    }
  }, [orderId]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const orderHistory = await orderService.getOrderHistory();
      setOrders(orderHistory);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load your orders");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderDetails = async (id) => {
    setIsLoading(true);
    try {
      const orderDetails = await orderService.getOrderDetails(id);
      setSelectedOrder(orderDetails);
      setView("details");
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to load order details");
      setView("list");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { color: "bg-blue-100 text-blue-800", label: "Active" },
      checkout: { color: "bg-yellow-100 text-yellow-800", label: "Processing" },
      completed: { color: "bg-green-100 text-green-800", label: "Completed" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
    };

    const statusInfo = statusMap[status] || {
      color: "bg-gray-100 text-gray-800",
      label: status,
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
      >
        {statusInfo.label}
      </span>
    );
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return `${
      process.env.NODE_ENV === "development"
        ? import.meta.env.VITE_API_URL
        : import.meta.env.VITE_API_URL
    }${imagePath}`;
  };

  const renderOrderList = () => {
    if (orders.length === 0) {
      return (
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No orders yet
          </h3>
          <p className="text-gray-500 mb-4">
            Start shopping in the marketplace to place your first order
          </p>
          <button
            onClick={() => navigate("/buyer/marketplace")}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Browse Marketplace
          </button>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
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
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order._id.substring(0, 8)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(order.updatedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.items.length} items
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="font-medium">₹{order.total.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(order.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => fetchOrderDetails(order._id)}
                    className="text-green-600 hover:text-green-900 flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderOrderDetails = () => {
    if (!selectedOrder) return null;

    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 bg-white p-6 rounded-lg border">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-4">
              Order Information
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium">#{selectedOrder._id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">
                  {formatDate(selectedOrder.updatedAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium capitalize">
                  {selectedOrder.paymentMethod
                    ? selectedOrder.paymentMethod.replace(/_/g, " ")
                    : "Not specified"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-4">
              Shipping Information
            </h3>
            {selectedOrder.shippingAddress ? (
              <div className="space-y-1">
                <p>{selectedOrder.shippingAddress.street || ""}</p>
                <p>
                  {selectedOrder.shippingAddress.city || ""}
                  {selectedOrder.shippingAddress.city &&
                  selectedOrder.shippingAddress.state
                    ? ", "
                    : ""}
                  {selectedOrder.shippingAddress.state || ""}
                </p>
                <p>{selectedOrder.shippingAddress.zipCode || ""}</p>
                <p>{selectedOrder.shippingAddress.country || ""}</p>
              </div>
            ) : (
              <p className="text-gray-500">No shipping address provided</p>
            )}
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
          </div>
          <div className="divide-y">
            {selectedOrder.items.map((item) => {
              const crop = item.cropId;
              if (!crop) return null;

              // Get seller information if available
              const seller = item.listingId?.sellerId;

              return (
                <div
                  key={item._id}
                  className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center">
                    <div className="h-20 w-20 rounded-md bg-gray-100 flex items-center justify-center mr-4 overflow-hidden">
                      {crop.images && crop.images.length > 0 ? (
                        <img
                          src={getImageUrl(crop.images[0])}
                          alt={crop.cropName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {crop.cropName}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mt-2">
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Quantity:</span>{" "}
                          {item.quantity} {item.unit}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Price:</span> ₹
                          {item.pricePerUnit} per {item.unit}
                        </p>
                        {seller && (
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Seller:</span>{" "}
                            {seller.fullName}
                          </p>
                        )}
                        {crop.description && (
                          <p className="text-sm text-gray-500 col-span-2 mt-1">
                            <span className="font-medium">Description:</span>{" "}
                            {crop.description.substring(0, 100)}
                            {crop.description.length > 100 ? "..." : ""}
                          </p>
                        )}
                        {crop.organic !== undefined && (
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Organic:</span>{" "}
                            {crop.organic ? "Yes" : "No"}
                          </p>
                        )}
                        {crop.harvestDate && (
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Harvest Date:</span>{" "}
                            {formatDate(crop.harvestDate)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className="font-medium">
                      ₹{item.subtotal.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      (₹{item.pricePerUnit} × {item.quantity})
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <div className="text-right">
              <p className="text-gray-500">Total</p>
              <div className="font-medium">
                ₹{selectedOrder.total.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {selectedOrder.notes && (
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Order Notes</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700">{selectedOrder.notes}</p>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleBackToList}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </button>
        </div>
      </div>
    );
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedOrder(null);
    navigate("/buyer/orders");
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-green-800">
            {view === "list" ? "Order Management" : "Order Details"}
          </h2>
          {view === "details" && (
            <button
              onClick={() => {
                setView("list");
                setSelectedOrder(null);
                navigate("/buyer/orders");
              }}
              className="flex items-center text-green-600 hover:text-green-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Orders
            </button>
          )}
        </div>
        <p className="text-gray-600">
          {view === "list"
            ? "Manage and track your orders"
            : "View detailed information about your order"}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="h-8 w-8 text-green-500 animate-spin mr-2" />
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : view === "list" ? (
        renderOrderList()
      ) : (
        renderOrderDetails()
      )}
    </div>
  );
};

export default OrderManagement;
