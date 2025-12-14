const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {FieldValue} = require("firebase-admin/firestore"); // <-- Add this line
const express = require("express");
const cors = require("cors"); // Recommended for handling cross-origin requests

// Initialize Firebase Admin SDK
admin.initializeApp();

// Get a reference to the Firestore database
const db = admin.firestore();

// Create an Express app
const app = express();

// const FieldValue = admin.firestore.FieldValue;

// Middleware for parsing x-www-form-urlencoded bodies
app.use(express.urlencoded({extended: true}));
app.use(express.json()); // Also good to have for JSON bodies
app.use(cors({origin: true})); // Allows cross-origin requests from any origin

app.post("/", async (req, res) => {
  const formData = req.body;

  console.log("Received x-www-form-urlencoded data via Express:", formData);

  try {
    const docRef = await db.collection("watchData").add({
      ...formData,
      timestamp: FieldValue.serverTimestamp(),
    });

    console.log("Document written with ID:", docRef.id);
    return res.status(200).send("Form data received and stored successfully");
  } catch (error) {
    console.error("Error storing form data with Express:", error);
    return res.status(500).send("Error processing your request.");
  }
});

// IMPORTANT: Export the Express app as a Cloud Function
exports.api = functions.https.onRequest(app);
