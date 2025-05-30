const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.routes");
const cropRoutes = require("./routes/crop.routes");
const marketplaceRoutes = require("./routes/marketplace.routes");
const orderRoutes = require("./routes/order.routes");
const chatRoutes = require("./routes/chat.routes");
const sourcedProductRoutes = require("./routes/sourcedProduct.routes");
const cropDiseaseRoutes = require("./routes/cropDisease.routes");
const diseaseHistoryRoutes = require("./routes/diseaseHistory.routes");
const path = require("path");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

// CORS configuration
app.use(
  cors({
    origin: "*", // Allow all origins, or specify like: 'http://localhost:5173'
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database connection
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error("FATAL ERROR: MONGODB_URI is not defined.");
  process.exit(1); // Exit if MONGODB_URI is not set
}

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Connection failed", err);
    process.exit(1); // Exit if connection fails
  });

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"],
  },
});

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a room for private messaging
  socket.on("join_room", (userId) => {
    console.log("User joined room:", userId);
    socket.join(userId);
  });

  // Handle new message
  socket.on("send_message", (messageData) => {
    console.log("New message:", messageData);
    // Emit the message to the recipient's room
    socket.to(messageData.recipientId).emit("receive_message", messageData);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Middleware to pass io instance to route handlers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/sourced-products", sourcedProductRoutes);
app.use("/api/crop-disease", cropDiseaseRoutes);
app.use("/api/disease-history", diseaseHistoryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Something went wrong!" });
});

// Export the app for serverless environments
module.exports = app;

// Start the server only if not in a Lambda environment
if (process.env.LAMBDA_TASK_ROOT === undefined) {
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}
