require("dotenv").config();
// BACKEND API - Express Server for Contact Form
// STEP 1: Import Required Packages
// ============================================
const express = require("express");
const cors = require("cors");
const axios = require("axios");

// Initialize Express application
const app = express();
// const PORT = 3000;

// ============================================
// STEP 2: Middleware Configuration
// ============================================
// app.use(cors());
app.use(
  cors({
    origin: [
      "https://contact-form-project-1-0c2g.onrender.com",
      "http://localhost:5500",
    ],
    credentials: true,
  })
);

app.use(express.json());

// ============================================
// STEP 3: Configuration

// const N8N_WEBHOOK_URL = "http://localhost:5678/webhook-test/Contact";
const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook/Contact";
const PORT = process.env.PORT || 3000;

// ============================================
// STEP 4: Validation Function
// ============================================
function validateContactData(data) {
  const errors = [];

  // Check if name exists and is not empty
  if (!data.name || data.name.trim().length === 0) {
    errors.push("Name is required");
  }

  // Check if name is reasonable length
  if (data.name && data.name.length > 100) {
    errors.push("Name is too long (max 100 characters)");
  }

  // Email validation using regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push("Valid email is required");
  }

  // Check if message exists and meets length requirements
  if (!data.message || data.message.trim().length === 0) {
    errors.push("Message is required");
  }

  if (data.message && data.message.length < 10) {
    errors.push("Message is too short (minimum 10 characters)");
  }

  if (data.message && data.message.length > 5000) {
    errors.push("Message is too long (maximum 5000 characters)");
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}

// ============================================
// STEP 5: Main API Endpoint
// ============================================
app.post("/contact", async (req, res) => {
  try {
    console.log("📩 Received contact form submission");
    console.log("Data:", req.body);

    // Extract data from request body
    const { name, email, message } = req.body;

    // Validate the data
    const validation = validateContactData({ name, email, message });

    if (!validation.isValid) {
      // If validation fails, return 400 Bad Request
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: validation.errors,
      });
    }

    // Prepare data to send to n8n
    const dataForN8n = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
      source: "contact-form",
    };

    // Forward data to n8n webhook
    console.log("🚀 Forwarding to n8n...");

    const n8nResponse = await axios.post(N8N_WEBHOOK_URL, dataForN8n, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000, // 10 second timeout
    });

    console.log("✅ Successfully forwarded to n8n");
    console.log("n8n response:", n8nResponse.data);

    // Send success response to frontend
    res.status(200).json({
      success: true,
      message: "Message received and being processed",
      data: {
        name: dataForN8n.name,
        email: dataForN8n.email,
      },
    });
  } catch (error) {
    console.error("❌ Error processing contact form:", error.message);

    // Check if error is from n8n webhook
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        success: false,
        error: "Service temporarily unavailable. Please try again later.",
      });
    }

    if (error.response) {
      // n8n returned an error
      return res.status(500).json({
        success: false,
        error: "Failed to process your message. Please try again.",
      });
    }

    // Generic error
    res.status(500).json({
      success: false,
      error: "Internal server error. Please try again later.",
    });
  }
});

// ============================================
// STEP 6: Health Check Endpoint
// ============================================
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Contact Form API",
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "Contact Form API",
    status: "running",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      contact: "/contact (POST)",
    },
    documentation: "https://github.com/Victor-VIO/contact-form-project",
  });
});
// ============================================
// STEP 7: Start Server
// ============================================

app.listen(PORT, () => {
  console.log("=================================");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/contact`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log("=================================");
});
