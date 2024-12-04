const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

// CORS middleware with multiple allowed origins and preflight support
const allowedOrigins = [
  "https://chat-app-rho-ten-58.vercel.app", // Frontend URL
  "http://localhost:3000", // Localhost for dev environment
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Enable credentials like cookies or tokens
  })
);

// Preflight request handling for all routes
app.options("*", cors());

// Middleware to parse JSON body
app.use(express.json());

// MongoDB connection
const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log("Server is connected to the Database");
  } catch (err) {
    console.log("Error connecting to database", err.message);
  }
};
connectDb();

app.get("/", (req, res) => {
  res.send("API is running");
});

// Routes
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

// Error Handling middleware
app.use(notFound);
app.use(errorHandler);

// CORS debugging log (optional)
app.use((req, res, next) => {
  console.log("CORS headers are being applied...");
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
