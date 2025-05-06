const tf = require("@tensorflow/tfjs");
const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Gemini API client
let genAI = null;
let geminiModel = null;

// Model variables
let model = null;
let isModelLoaded = false;
let modelClasses = [];

// Path to the dataset and model
const DATASET_PATH = path.join(__dirname, "../../diseasedataset/train");
const MODEL_PATH = path.join(__dirname, "../data/crop-disease-model");

// Function to initialize the Gemini API
const initializeGeminiAPI = () => {
  try {
    // Get API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Gemini API key not found. Please set GEMINI_API_KEY in .env file"
      );
    }

    genAI = new GoogleGenerativeAI(apiKey);
    geminiModel = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    console.log("Gemini API initialized successfully");
    return true;
  } catch (error) {
    console.error("Failed to initialize Gemini API:", error);
    return false;
  }
};

// Load the model classes from dataset directories
const loadModelClasses = () => {
  try {
    // Check if we have saved class names from training
    const classNamesPath = path.join(MODEL_PATH, "class_names.json");

    if (fs.existsSync(classNamesPath)) {
      // Load class names from the saved file
      const classNamesJson = fs.readFileSync(classNamesPath, "utf8");
      modelClasses = JSON.parse(classNamesJson);
    } else {
      // If no saved class names, read from dataset directories
      const directories = fs.readdirSync(DATASET_PATH);
      modelClasses = directories.sort();
    }

    console.log(`Loaded ${modelClasses.length} disease classes`);
    return modelClasses;
  } catch (error) {
    console.error("Error loading model classes:", error);
    throw error;
  }
};

// Preprocess an image for model input
const preprocessImage = async (imagePath) => {
  try {
    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath);

    // Since we're not using tfjs-node, we'll use a simpler approach for now
    // In a production environment, you might want to use a library like jimp or sharp
    // to preprocess the image on the server side

    return { buffer: imageBuffer, tensorPlaceholder: true };
  } catch (error) {
    console.error("Error preprocessing image:", error);
    throw error;
  }
};

// Create a simple model (since we can't easily train without tfjs-node)
const createSimpleModel = async () => {
  try {
    console.log("Creating a simple model for demonstration...");

    // Create a sequential model
    model = tf.sequential();

    // Add model layers - Simple architecture for demonstration
    model.add(
      tf.layers.conv2d({
        inputShape: [224, 224, 3],
        filters: 32,
        kernelSize: 3,
        activation: "relu",
      })
    );
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({ units: 128, activation: "relu" }));
    model.add(
      tf.layers.dense({ units: modelClasses.length, activation: "softmax" })
    );

    // Compile the model
    model.compile({
      optimizer: "adam",
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });

    console.log("Simple model created for demonstration purposes.");
    console.log(
      "Note: This model is not trained and will provide random results."
    );
    console.log(
      "In a production environment, you would use a pre-trained model or train a model with tfjs-node."
    );

    isModelLoaded = true;
    return true;
  } catch (error) {
    console.error("Error creating simple model:", error);
    isModelLoaded = false;
    throw error;
  }
};

// Initialize the model
const initializeModel = async () => {
  try {
    // Load model classes
    await loadModelClasses();

    // Create a simple model
    await createSimpleModel();

    // Initialize Gemini API
    await initializeGeminiAPI();

    return {
      modelLoaded: isModelLoaded,
      classes: modelClasses,
      geminiInitialized: genAI !== null,
    };
  } catch (error) {
    console.error("Error initializing model:", error);
    throw error;
  }
};

// Simulate prediction for demonstration
const simulatePrediction = async (imagePath) => {
  try {
    // Read classes
    const classNames = modelClasses;

    // Randomly select top 3 classes
    let predictions = [];
    let usedIndices = new Set();

    for (let i = 0; i < 3; i++) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * classNames.length);
      } while (usedIndices.has(randomIndex));

      usedIndices.add(randomIndex);

      // Generate a random probability (higher for the first one)
      const probability =
        i === 0 ? 0.7 + Math.random() * 0.2 : 0.1 + Math.random() * 0.3;

      predictions.push({
        className: classNames[randomIndex],
        probability: probability,
      });
    }

    // Sort by probability
    predictions.sort((a, b) => b.probability - a.probability);

    return predictions;
  } catch (error) {
    console.error("Error simulating prediction:", error);
    throw error;
  }
};

// Analyze image with Gemini for confirmation or additional insights
const analyzeWithGemini = async (imagePath, mlPrediction) => {
  try {
    if (!geminiModel) {
      throw new Error("Gemini model not initialized");
    }

    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath);

    // Convert buffer to base64
    const base64Image = imageBuffer.toString("base64");

    // Create content parts for crop validation
    const validationImagePart = {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg",
      },
    };

    // First check if image is of a crop
    const validationPrompt =
      "Is this image showing a crop or plant? Respond with only 'yes' or 'no'.";

    // Validate the image contains crops
    const validationResult = await geminiModel.generateContent([
      validationPrompt,
      validationImagePart,
    ]);
    const validationResponse = await validationResult.response;
    const validationText = validationResponse.text().toLowerCase().trim();

    // If the image is not of a crop, return error
    if (validationText !== "yes") {
      throw new Error(
        "The image does not appear to show a crop or plant. Please upload an image of a crop."
      );
    }

    // Create prompt based on ML prediction
    let prompt =
      "Analyze this plant image and tell me if it shows any signs of disease. ";

    if (mlPrediction) {
      prompt += `Our ML model suggests this might be ${mlPrediction.className.replace(
        /_/g,
        " "
      )} with ${(mlPrediction.probability * 100).toFixed(
        2
      )}% confidence. Please confirm or provide alternative analysis.`;
    }

    // Create Gemini content parts
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg",
      },
    };

    // Generate content with Gemini
    const result = await geminiModel.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    return {
      geminiAnalysis: text,
      confidence: text.includes("confirm") ? "high" : "medium",
      source: "gemini",
    };
  } catch (error) {
    console.error("Error analyzing with Gemini:", error);
    throw error;
  }
};

// Combined analysis (simulated ML + Gemini)
const analyzeCropDisease = async (imagePath) => {
  try {
    // Check if model is loaded
    if (!isModelLoaded) {
      throw new Error("Model not loaded. Please initialize the model first.");
    }

    // Step 1: Simulate ML prediction
    const mlPredictions = await simulatePrediction(imagePath);
    const topPrediction = mlPredictions[0];

    // Step 2: Analyze with Gemini
    try {
      const geminiResult = await analyzeWithGemini(imagePath, topPrediction);

      // Step 3: Combine results
      return {
        mlPrediction: {
          className: topPrediction.className,
          readableClassName: topPrediction.className
            .replace(/_/g, " ")
            .replace(/___/, ": "),
          probability: topPrediction.probability,
          otherPredictions: mlPredictions.slice(1),
        },
        geminiAnalysis: geminiResult.geminiAnalysis,
        confidence: geminiResult.confidence,
        timestamp: new Date(),
      };
    } catch (geminiError) {
      // Check if this is a crop validation error
      if (
        geminiError.message.includes("does not appear to show a crop or plant")
      ) {
        // Return error response for non-crop images
        return {
          error: true,
          message: geminiError.message,
          validationFailed: true,
          timestamp: new Date(),
        };
      }
      // For other Gemini-related errors, still return ML results with a note
      return {
        mlPrediction: {
          className: topPrediction.className,
          readableClassName: topPrediction.className
            .replace(/_/g, " ")
            .replace(/___/, ": "),
          probability: topPrediction.probability,
          otherPredictions: mlPredictions.slice(1),
        },
        geminiAnalysis: "Gemini analysis unavailable: " + geminiError.message,
        confidence: "low",
        timestamp: new Date(),
      };
    }
  } catch (error) {
    console.error("Error in combined analysis:", error);
    throw error;
  }
};

// Get model status
const getModelStatus = () => {
  return {
    isLoaded: isModelLoaded,
    classes: modelClasses.length,
    geminiAvailable: geminiModel !== null,
  };
};

module.exports = {
  initializeModel,
  analyzeCropDisease,
  getModelStatus,
};
