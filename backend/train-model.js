const { trainModel } = require("./services/trainModel");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

console.log("===================================");
console.log(" CROP DISEASE DETECTION MODEL TRAINER");
console.log("===================================");
console.log(
  "This script will train a TensorFlow.js model on the crop disease dataset."
);
console.log(
  "The training process may take a significant amount of time depending on"
);
console.log("the size of the dataset and your hardware capabilities.");
console.log("");
console.log("Please ensure you have:");
console.log("1. Sufficient RAM for image processing");
console.log("2. The correct dataset path in the script");
console.log("3. A Gemini API key in your .env file (for the API integration)");
console.log("");
console.log("Starting training process...");

// Run the training process
trainModel()
  .then((result) => {
    console.log("===================================");
    console.log(" TRAINING COMPLETED SUCCESSFULLY");
    console.log("===================================");
    console.log("Model saved to:", result.modelSavePath);
    console.log("Number of classes:", result.numClasses);
    console.log("Number of samples processed:", result.numSamples);
    console.log("");
    console.log("You can now use the API to detect crop diseases.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("===================================");
    console.error(" TRAINING FAILED");
    console.error("===================================");
    console.error("Error:", error.message);
    console.error("");
    console.error("Please check the logs above for more details.");
    process.exit(1);
  });
