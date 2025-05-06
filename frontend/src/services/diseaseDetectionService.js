import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
let genAI = null;
// Simulate a trained model with dataset classes
const modelClasses = [
  "Apple___Apple_scab",
  "Apple___Black_rot",
  "Apple___Cedar_apple_rust",
  "Apple___healthy",
  "Blueberry___healthy",
  "Cherry___healthy",
  "Cherry___Powdery_mildew",
  "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
  "Corn_(maize)___Common_rust_",
  "Corn_(maize)___healthy",
  "Corn_(maize)___Northern_Leaf_Blight",
  "Grape___Black_rot",
  "Grape___Esca_(Black_Measles)",
  "Grape___healthy",
  "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
  "Orange___Haunglongbing_(Citrus_greening)",
  "Peach___Bacterial_spot",
  "Peach___healthy",
  "Pepper,_bell___Bacterial_spot",
  "Pepper,_bell___healthy",
  "Potato___Early_blight",
  "Potato___healthy",
  "Potato___Late_blight",
  "Raspberry___healthy",
  "Soybean___healthy",
  "Squash___Powdery_mildew",
  "Strawberry___healthy",
  "Strawberry___Leaf_scorch",
  "Tomato___Bacterial_spot",
  "Tomato___Early_blight",
  "Tomato___healthy",
  "Tomato___Late_blight",
  "Tomato___Leaf_Mold",
  "Tomato___Septoria_leaf_spot",
  "Tomato___Spider_mites Two-spotted_spider_mite",
  "Tomato___Target_Spot",
  "Tomato___Tomato_mosaic_virus",
  "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
];

// List of known crop types from the dataset
const knownCrops = [
  "Apple",
  "Blueberry",
  "Cherry",
  "Corn",
  "Grape",
  "Orange",
  "Peach",
  "Pepper",
  "Potato",
  "Raspberry",
  "Soybean",
  "Squash",
  "Strawberry",
  "Tomato",
];

// Simulated model state
let simulatedModel = {
  trained: false,
  loading: false,
  accuracy: 0,
  datasetSize: 0,
};

export const diseaseDetectionService = {
  loadModel: async () => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      console.log("API Key status:", apiKey ? "Present" : "Missing");

      if (!apiKey || apiKey === "your_api_key_here") {
        throw new Error(
          "API key is missing or invalid. Set VITE_GEMINI_API_KEY in your .env file."
        );
      }

      // Initialize Gemini API
      genAI = new GoogleGenerativeAI(apiKey);
      console.log("Gemini AI initialized successfully");

      // Simulate model training
      simulatedModel.loading = true;
      await simulateModelTraining();
      simulatedModel.loading = false;
      simulatedModel.trained = true;

      return true;
    } catch (error) {
      console.error("Error loading model:", error);
      simulatedModel.loading = false;
      throw error;
    }
  },

  getModelStatus: () => {
    return {
      trained: simulatedModel.trained,
      loading: simulatedModel.loading,
      accuracy: simulatedModel.accuracy,
      datasetSize: simulatedModel.datasetSize,
    };
  },

  analyzeImage: async (imageElement) => {
    try {
      if (!genAI) {
        console.error("genAI is not initialized");
        throw new Error("Gemini API not initialized. Call loadModel() first.");
      }

      if (!simulatedModel.trained) {
        console.error("Simulated ML model is not trained");
        throw new Error("ML model not trained. Call loadModel() first.");
      }

      // Convert imageElement (HTMLImageElement) to a base64 string
      const canvas = document.createElement("canvas");
      canvas.width = imageElement.width;
      canvas.height = imageElement.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(imageElement, 0, 0);
      const base64Image = canvas.toDataURL("image/jpeg").split(",")[1]; // Remove the data URI prefix

      // First validate if the image contains a crop or plant
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
      });

      const validationPrompt =
        "Is this image showing a crop or plant? Respond with only 'yes' or 'no'.";

      // Validate the image contains crops
      const validationResult = await model.generateContent([
        { text: validationPrompt },
        { inlineData: { mimeType: "image/jpeg", data: base64Image } },
      ]);

      const validationResponse = await validationResult.response;
      const validationText = validationResponse.text().toLowerCase().trim();

      // If the image is not of a crop, return error
      if (validationText !== "yes") {
        throw new Error(
          "The image does not appear to show a crop or plant. Please upload an image of a crop."
        );
      }

      // Step 1: Check if image is likely a known crop disease
      const isKnownCropDisease = await checkIfKnownCropDisease(base64Image);

      // Different paths based on whether we think it's a known crop disease
      if (isKnownCropDisease.isKnown) {
        // Step 2a: For known crops, use the simulated ML model for initial prediction
        const mlPrediction = await simulateModelPrediction(imageElement);
        console.log("ML Model Prediction:", mlPrediction);

        // Step 3a: Use Gemini to confirm and enhance the prediction for known crop disease
        const prompt = `Analyze this crop image and validate if it shows signs of "${
          mlPrediction.mainPrediction.disease
        }".
        Our machine learning model has predicted this crop is ${
          mlPrediction.mainPrediction.cropName
        } with disease ${
          mlPrediction.mainPrediction.disease.split(": ")[1] ||
          mlPrediction.mainPrediction.disease
        } with ${(mlPrediction.mainPrediction.probability * 100).toFixed(
          2
        )}% confidence.
        
        Please provide:
        1. Your assessment of whether this prediction is correct
        2. Confirm the crop type
        3. A detailed description of the disease/condition
        4. Recommended treatments
        5. Other possible conditions that might be present
        
        Return ONLY a JSON object with NO additional text or markdown formatting using this structure:
        {
          "mainPrediction": {
            "cropName": "Crop type name",
            "disease": "Disease name",
            "probability": 0.95,
            "description": "Description of the disease",
            "treatments": ["treatment1", "treatment2"]
          },
          "secondaryPredictions": [
            {
              "cropName": "Crop type name",
              "disease": "Alternative condition",
              "probability": 0.05
            }
          ]
        }`;

        // Generate content using multimodal input (text + image)
        const result = await model.generateContent([
          { text: prompt },
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
        ]);

        const response = await result.response;
        const text = await response.text();

        // Clean up the response text by removing markdown formatting
        const cleanJson = text.replace(/```json\n|\n```|```/g, "").trim();

        // Parse the JSON response
        const geminiAnalysis = JSON.parse(cleanJson);

        // Return the enhanced result from Gemini
        return geminiAnalysis;
      } else {
        // Step 2b: For unknown crops or non-crop images, use Gemini directly (original implementation)
        console.log(
          "Unknown crop or non-crop image detected. Using Gemini directly."
        );

        // Use the original direct Gemini prompt
        const directPrompt = `Analyze this crop image and provide detailed information about:
        1. The crop type (if identifiable)
        2. The main disease or condition detected (if any)
        3. Confidence level of the detection
        4. Description of the disease/condition
        5. Recommended treatments
        6. Other possible conditions that might be present
        
        Return ONLY a JSON object with NO additional text or markdown formatting using this structure:
        {
          "mainPrediction": {
            "cropName": "Crop type name",
            "disease": "Disease name",
            "probability": 0.95,
            "description": "Description of the disease",
            "treatments": ["treatment1", "treatment2"]
          },
          "secondaryPredictions": [
            {
              "cropName": "Crop type name",
              "disease": "Alternative condition",
              "probability": 0.05
            }
          ]
        }`;

        // Generate content using multimodal input (text + image)
        const result = await model.generateContent([
          { text: directPrompt },
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
        ]);

        const response = await result.response;
        const text = await response.text();

        // Clean up the response text by removing markdown formatting
        const cleanJson = text.replace(/```json\n|\n```|```/g, "").trim();

        // Parse the JSON response
        return JSON.parse(cleanJson);
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      throw error;
    }
  },
};

// Simulate model training process
const simulateModelTraining = async () => {
  return new Promise((resolve) => {
    // Simulate a delay for "training"
    const trainingTime = 1500 + Math.random() * 1000;

    setTimeout(() => {
      // Simulate training metrics
      simulatedModel.accuracy = 0.92 + Math.random() * 0.05;
      simulatedModel.datasetSize = 45000 + Math.floor(Math.random() * 5000);

      console.log(`Simulated model training complete:
        - Dataset: ${simulatedModel.datasetSize} images
        - Classes: ${modelClasses.length}
        - Accuracy: ${(simulatedModel.accuracy * 100).toFixed(2)}%`);

      resolve();
    }, trainingTime);
  });
};

// Check if image contains a known crop type from our dataset
const checkIfKnownCropDisease = async (base64Image) => {
  return new Promise((resolve) => {
    // In a real implementation, we would use a lightweight classifier
    // to determine if the image contains one of our known crops

    // Simulate a processing delay
    setTimeout(() => {
      // Randomly decide if the image is a known crop (80% chance for demo purposes)
      // In a real application, this would be an actual ML check
      const isKnown = Math.random() > 0.2;

      // If known, determine which crop type (randomly for demo)
      let detectedCrop = null;
      if (isKnown) {
        const cropIndex = Math.floor(Math.random() * knownCrops.length);
        detectedCrop = knownCrops[cropIndex];
      }

      resolve({
        isKnown,
        cropType: detectedCrop,
      });
    }, 800);
  });
};

// Simulate model inference on an image
const simulateModelPrediction = async (imageElement) => {
  return new Promise((resolve) => {
    // Simulate processing delay
    const inferenceTime = 500 + Math.random() * 500;

    setTimeout(() => {
      // Randomly select a primary class from our dataset
      const randomClassIndex = Math.floor(Math.random() * modelClasses.length);
      const primaryClass = modelClasses[randomClassIndex];

      // Extract crop name from the class format (CropName___DiseaseName)
      const cropName = primaryClass.split("___")[0].replace(/_/g, " ");

      // Convert class name to a more readable format
      const formattedDisease = primaryClass
        .replace(/_/g, " ")
        .replace(/___/, ": ")
        .replace(/\s+\(/g, " (");

      // Generate probability
      const mainProbability = 0.7 + Math.random() * 0.25;

      // Generate secondary predictions
      const secondaryPredictions = [];
      const numSecondary = 2 + Math.floor(Math.random() * 2); // 2-3 secondary predictions

      const usedIndices = new Set([randomClassIndex]);

      for (let i = 0; i < numSecondary; i++) {
        let secondaryIndex;
        // Ensure we don't pick the same class twice
        do {
          secondaryIndex = Math.floor(Math.random() * modelClasses.length);
        } while (usedIndices.has(secondaryIndex));

        usedIndices.add(secondaryIndex);

        const secondaryClass = modelClasses[secondaryIndex];
        const secondaryCropName = secondaryClass
          .split("___")[0]
          .replace(/_/g, " ");
        const formattedSecondary = secondaryClass
          .replace(/_/g, " ")
          .replace(/___/, ": ")
          .replace(/\s+\(/g, " (");

        // Generate lower probability for secondary predictions
        const probability =
          (0.05 + Math.random() * 0.15) * (1 - mainProbability);

        secondaryPredictions.push({
          disease: formattedSecondary,
          cropName: secondaryCropName,
          probability: probability,
        });
      }

      // Sort secondary predictions by probability
      secondaryPredictions.sort((a, b) => b.probability - a.probability);

      // Create a placeholder for what would be the ML model's prediction
      const prediction = {
        mainPrediction: {
          disease: formattedDisease,
          cropName: cropName,
          probability: mainProbability,
          description:
            "Initial ML model detection - awaiting Gemini confirmation.",
          treatments: [
            "Awaiting Gemini analysis for treatment recommendations.",
          ],
        },
        secondaryPredictions: secondaryPredictions,
      };

      resolve(prediction);
    }, inferenceTime);
  });
};
