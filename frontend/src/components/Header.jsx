// Header Component
import React, { useState, useEffect } from "react";
import {
  User,
  LogOut,
  PlusCircle,
  Wheat,
  Menu,
  X,
  FileText,
  ShoppingBasket,
  PackageCheck,
  MessageSquare,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { useNavigate, useLocation } from "react-router-dom";
import Inbox from "./Inbox";
import { userService } from "../services/userService";
import { chatService } from "../services/chatService";
import { socketService } from "../services/socketService";
import classNames from "classnames";

export const Header = ({ userType, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [userFullName, setUserFullName] = useState("");
  const [unreadMessages, setUnreadMessages] = useState(0);
  const currentPath = location.pathname;

  useEffect(() => {
    const initData = async () => {
      try {
        // Fetch user profile
        const userProfile = await userService.getUserProfile();
        if (userProfile && userProfile.fullName) {
          setUserFullName(userProfile.fullName);
        }

        // Fetch unread message count
        await fetchUnreadCount();

        // Initialize socket connection
        initializeSocket();
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };

    initData();

    // Listen for profile updates
    const handleProfileUpdate = (event) => {
      if (event.detail && event.detail.fullName) {
        setUserFullName(event.detail.fullName);
      } else {
        // If no detail provided, refresh the profile data
        fetchUserProfile();
      }
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    // Cleanup listener
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
      socketService.removeAllListeners();
    };
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userProfile = await userService.getUserProfile();
      if (userProfile && userProfile.fullName) {
        setUserFullName(userProfile.fullName);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const initializeSocket = () => {
    // Get the socket instance (will initialize if not already connected)
    const socket = socketService.getSocket();

    // Listen for new messages
    socketService.onReceiveMessage((message) => {
      console.log("New message received:", message);
      // Increment unread count when a new message arrives
      setUnreadMessages((prev) => prev + 1);
    });

    // Listen for conversation updates
    socketService.onConversationUpdated((data) => {
      console.log("Conversation updated via socket:", data);
      if (data && typeof data.unreadCount === "number") {
        fetchUnreadCount(); // Refresh the full count to be accurate
      }
    });

    // Listen for messages marked as read
    socketService.onMessagesRead(() => {
      fetchUnreadCount(); // Refresh unread count
    });
  };

  const fetchUnreadCount = async () => {
    try {
      const conversations = await chatService.getConversations();
      if (conversations && Array.isArray(conversations)) {
        // Calculate total unread messages across all conversations
        const totalUnread = conversations.reduce(
          (total, conv) => total + (conv.unreadCount || 0),
          0
        );
        setUnreadMessages(totalUnread);
      }
    } catch (error) {
      console.error("Error fetching unread messages:", error);
    }
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const toggleInbox = () => {
    setShowInbox(!showInbox);
    if (!showInbox) {
      // Reset unread count when opening inbox
      setUnreadMessages(0);
    } else {
      // Refresh unread count when closing inbox
      fetchUnreadCount();
    }
  };

  // Helper function to check if a path is active
  const isActive = (path) => {
    return currentPath.includes(path);
  };

  // Button with active state styling
  const NavButton = ({ path, onClick, children, icon, badge }) => {
    const active = isActive(path);
    return (
      <Button
        variant={active ? "default" : "outline"}
        size="sm"
        onClick={onClick || (() => navigate(path))}
        className={classNames(
          "flex items-center relative",
          active
            ? "bg-green-600 text-white hover:bg-green-700"
            : "hover:bg-green-50 hover:text-green-600"
        )}
      >
        {icon && React.cloneElement(icon, { className: "h-4 w-4 mr-2" })}
        {children}
        {badge > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </Button>
    );
  };

  const FarmerActions = () => (
    <>
      <NavButton path="/farmer/add-crops" icon={<PlusCircle />}>
        Add Crops
      </NavButton>

      <NavButton path="/farmer/your-crops" icon={<Wheat />}>
        Your Crops
      </NavButton>

      <NavButton path="/farmer/orders" icon={<PackageCheck />}>
        Orders
      </NavButton>

      <NavButton
        path="/inbox"
        onClick={toggleInbox}
        icon={<MessageSquare />}
        badge={unreadMessages}
      >
        Inbox
      </NavButton>
    </>
  );

  const BuyerActions = () => (
    <>
      <NavButton path="/buyer/marketplace" icon={<Wheat />}>
        Marketplace
      </NavButton>

    
      <NavButton path="/buyer/order-basket" icon={<ShoppingBasket />}>
        Order Basket
      </NavButton>

      <NavButton path="/buyer/orders" icon={<PackageCheck />}>
        Your Orders
      </NavButton>

      <NavButton
        path="/inbox"
        onClick={toggleInbox}
        icon={<MessageSquare />}
        badge={unreadMessages}
      >
        Inbox
      </NavButton>
    </>
  );

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <h1
            className="text-2xl md:text-3xl font-bold text-green-800 cursor-pointer"
            onClick={() =>
              navigate(
                userType === "farmer" ? "/farmer/dashboard" : "/buyer/dashboard"
              )
            }
          >
            FarmConnect
          </h1>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {userType === "farmer" && (
              <div className="flex items-center space-x-2 mr-4">
                <FarmerActions />
              </div>
            )}

            {userType === "buyer" && (
              <div className="flex items-center space-x-2 mr-4">
                <BuyerActions />
              </div>
            )}

            <div className="flex items-center space-x-4">
              <User className="h-6 w-6 text-green-600" />
              <span className="text-green-700 font-medium">
                {userFullName || "Loading..."}
              </span>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2 mt-0.5" />
                Logout
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-green-700" />
              ) : (
                <Menu className="h-6 w-6 text-green-700" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-2 space-y-3">
            <div className="flex flex-col space-y-2">
              {userType === "farmer" && (
                <div className="flex flex-col space-y-2">
                  <FarmerActions />
                </div>
              )}

              {userType === "buyer" && (
                <div className="flex flex-col space-y-2">
                  <BuyerActions />
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-green-600" />
                  <span className="text-green-700 font-medium text-sm">
                    {userFullName ||
                      (userType === "farmer" ? "Farmer" : "Buyer")}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Inbox Modal */}
      {showInbox && <Inbox isOpen={showInbox} onClose={toggleInbox} />}
    </header>
  );
};
