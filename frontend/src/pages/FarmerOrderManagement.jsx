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
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { BackButton } from "../components/BackButton";

const FarmerOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState("list"); // 'list' or 'details'
  const [statusFilter, setStatusFilter] = useState("all");
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
      const receivedOrders = await orderService.getReceivedOrders();
      setOrders(receivedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load received orders");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderDetails = async (id) => {
    setIsLoading(true);
    try {
      const orderDetails = await orderService.getOrderDetails(id);
      if (orderDetails) {
        setSelectedOrder(orderDetails);
        setView("details");
        console.log("Order details loaded successfully:", orderDetails);
      } else {
        throw new Error("No order details returned");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to load order details");
      // Stay on list view if we're navigating from there
      if (view === "list") {
        setView("list");
      } else {
        // If we were on the details page (via URL), go back to the main orders page
        navigate("/farmer/orders");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(
        orderId,
        status
      );
      toast.success(`Order status updated to ${status}`);

      if (view === "details") {
        setSelectedOrder(updatedOrder);
      } else {
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { color: "bg-blue-100 text-blue-800", label: "Active" },
      processing: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Processing",
      },
      shipped: { color: "bg-indigo-100 text-indigo-800", label: "Shipped" },
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

  const handleBackToList = () => {
    setView("list");
    setSelectedOrder(null);
    navigate("/farmer/orders");
  };

  useEffect(() => {
    // Debug order ID param
    if (orderId) {
      console.log("Order ID from URL params:", orderId);
    }
  }, [orderId]);

  // More detailed debugging for rendering conditions
  useEffect(() => {
    console.log("Current view state:", view);
    console.log("Selected order:", selectedOrder ? selectedOrder._id : "none");
    console.log("Loading state:", isLoading);
  }, [view, selectedOrder, isLoading]);

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  const renderOrderList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader className="h-8 w-8 text-green-600 animate-spin" />
        </div>
      );
    }

    if (filteredOrders.length === 0) {
      return (
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No orders found
          </h3>
          <p className="text-gray-500 mb-4">
            {statusFilter === "all"
              ? "You haven't received any orders yet"
              : `No orders with status "${statusFilter}"`}
          </p>
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
                Buyer
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
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order._id.substring(0, 8)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(order.updatedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.buyerName || "Unknown"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.items.length} items
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ₹{order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(order.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => navigate(`/farmer/orders/${order._id}`)}
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
              Buyer Information
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Buyer Name</p>
                <p className="font-medium">
                  {selectedOrder.buyerName || "Not available"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact Email</p>
                <p className="font-medium">
                  {selectedOrder.buyerEmail || "Not available"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-4">
              Shipping Address
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

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">Order Actions</h3>
          </div>
          <div className="p-6 flex flex-wrap gap-2">
            {selectedOrder.status !== "processing" && (
              <button
                onClick={() =>
                  updateOrderStatus(selectedOrder._id, "processing")
                }
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                disabled={
                  selectedOrder.status === "cancelled" ||
                  selectedOrder.status === "completed"
                }
              >
                Mark as Processing
              </button>
            )}

            {selectedOrder.status !== "shipped" && (
              <button
                onClick={() => updateOrderStatus(selectedOrder._id, "shipped")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={
                  selectedOrder.status === "cancelled" ||
                  selectedOrder.status === "completed"
                }
              >
                Mark as Shipped
              </button>
            )}

            {selectedOrder.status !== "completed" && (
              <button
                onClick={() =>
                  updateOrderStatus(selectedOrder._id, "completed")
                }
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                disabled={selectedOrder.status === "cancelled"}
              >
                Mark as Completed
              </button>
            )}

            {selectedOrder.status !== "cancelled" && (
              <button
                onClick={() =>
                  updateOrderStatus(selectedOrder._id, "cancelled")
                }
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={selectedOrder.status === "completed"}
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {view === "list" ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-green-800">
              Orders Received
            </h2>
            <div className="flex items-center">
              <label
                htmlFor="statusFilter"
                className="mr-2 text-sm text-gray-600"
              >
                Filter by Status:
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={handleFilterChange}
                className="border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Orders</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          {renderOrderList()}
        </>
      ) : (
        <>
          <div className="mb-6">
            <button
              onClick={handleBackToList}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </button>
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-6">
            Order Details
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader className="h-8 w-8 text-green-600 animate-spin" />
            </div>
          ) : selectedOrder ? (
            renderOrderDetails()
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Order not found
              </h3>
              <p className="text-gray-500 mb-4">
                The order details could not be loaded
              </p>
              <button
                onClick={handleBackToList}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Return to Order List
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FarmerOrderManagement;
