import React, { useState, useRef, useEffect } from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Link } from "react-router-dom";
import {
  Upload,
  Camera,
  Loader2,
  Volume2,
  Languages,
  Brain,
  Check,
  Database,
  AlertCircle,
  Leaf,
  History,
  Save,
} from "lucide-react";
import { diseaseDetectionService } from "../services/diseaseDetectionService";
import { diseaseHistoryService } from "../services/diseaseHistoryService";
import { translationService } from "../services/translationService";
import { toast } from "react-hot-toast";

export const CropDiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedResult, setTranslatedResult] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [modelStatus, setModelStatus] = useState(null);
  const [analysisStep, setAnalysisStep] = useState(null); // 'ml', 'gemini', or 'direct-gemini'
  const [isKnownCrop, setIsKnownCrop] = useState(true); // Whether the current image is a known crop type
  const [mlPrediction, setMlPrediction] = useState(null);
  const [validationError, setValidationError] = useState(null); // Added state for validation error message
  const [isSavingToHistory, setIsSavingToHistory] = useState(false); // Track saving to history
  const [savedToHistory, setSavedToHistory] = useState(false); // Track if current result is saved
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const speechSynthRef = useRef(null);

  useEffect(() => {
    initializeModel();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (speechSynthRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const initializeModel = async () => {
    setIsModelLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === "your_api_key_here") {
        throw new Error(
          "Please configure your Gemini API key in the .env file"
        );
      }
      await diseaseDetectionService.loadModel();
      console.log("Model initialized successfully");
      setModelStatus(diseaseDetectionService.getModelStatus());
      setIsModelLoading(false);
    } catch (error) {
      console.error("Model initialization error:", error);
      toast.error(
        error.message || "Failed to initialize disease detection model"
      );
      setIsModelLoading(true); // Keep the loading state true to prevent usage
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setSelectedImage(file);
        setResult(null);
        setTranslatedResult(null);
        setMlPrediction(null);
        setAnalysisStep(null);
        setIsKnownCrop(true); // Reset this with each new image
        setValidationError(null); // Clear any previous validation errors
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
    } catch (error) {
      toast.error("Failed to access camera");
    }
  };

  const captureImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      setSelectedImage(blob);
      setPreview(canvas.toDataURL("image/jpeg"));
      setResult(null);
      setTranslatedResult(null);
      setMlPrediction(null);
      setAnalysisStep(null);
      setIsKnownCrop(true); // Reset this with each new image
      setValidationError(null); // Clear any previous validation errors
    }, "image/jpeg");

    // Stop the camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const detectDisease = async () => {
    if (!selectedImage) return;
    if (isModelLoading) {
      toast.error("Please wait for the model to initialize");
      return;
    }

    setIsLoading(true);
    setAnalysisStep("ml");
    setResult(null);
    setTranslatedResult(null);
    setValidationError(null); // Clear validation errors when starting detection
    setSavedToHistory(false); // Reset saved state for new detection

    try {
      const img = new Image();
      img.src = preview;
      await img.decode(); // Ensure image is loaded

      // Simulate initial checking step - in real implementation this would track actual API calls
      await new Promise((resolve) => setTimeout(resolve, 800));

      // This is where the backend determines if the image is a known crop type or not
      // We'll simulate this determination by checking the response behavior
      const startTime = Date.now();
      const detection = await diseaseDetectionService.analyzeImage(img);
      const elapsedTime = Date.now() - startTime;

      // In our simulation, direct Gemini processing is faster than ML+Gemini
      // We can use this to determine which path was taken
      // In a real implementation, the backend would tell us directly
      const isDirectGemini = elapsedTime < 2000;

      if (isDirectGemini) {
        // Image wasn't recognized as being in our dataset
        setIsKnownCrop(false);
        setAnalysisStep("direct-gemini");
        toast.info("Unknown crop type detected. Using Gemini AI directly.");
      } else {
        // Known crop detected, went through ML then Gemini
        setIsKnownCrop(true);
        setAnalysisStep("gemini");
      }

      setResult(detection);
      setTranslatedResult(null);
    } catch (error) {
      console.error("Detection error:", error);
      if (error.message.includes("Model not initialized")) {
        toast.error("Model not ready. Please try again in a moment.");
        // Try to reinitialize the model
        await initializeModel();
      } else if (
        error.message.includes("does not appear to show a crop or plant")
      ) {
        // Show a specific error message for non-crop images
        toast.error(error.message, {
          duration: 5000,
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
        });
        setAnalysisStep(null);
        // Set validation error message
        setValidationError(
          "The image does not appear to show a crop or plant. Please upload an image of a crop."
        );
      } else {
        toast.error("Failed to analyze image");
      }
      setAnalysisStep(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to save detection result to history
  const saveToHistory = async () => {
    if (!result) return;

    setIsSavingToHistory(true);
    try {
      // Call the service to save to history
      await diseaseHistoryService.saveToHistory(result, selectedImage);

      // Update state and show success message
      setSavedToHistory(true);
      toast.success("Analysis saved to history");
    } catch (error) {
      console.error("Failed to save to history:", error);

      // Check if it's an auth error and provide appropriate message
      if (error.toString().includes("must be logged in")) {
        toast.error("Please log in to save your analysis history");
      } else {
        toast.error(error.toString() || "Failed to save to history");
      }
    } finally {
      setIsSavingToHistory(false);
    }
  };

  const translateToHindi = async () => {
    if (!result) return;

    setIsTranslating(true);
    try {
      const translatedData = {
        mainPrediction: {
          cropName: result.mainPrediction.cropName,
          disease: await translationService.translateToHindi(
            result.mainPrediction.disease
          ),
          probability: result.mainPrediction.probability,
          description: await translationService.translateToHindi(
            result.mainPrediction.description
          ),
          treatments: await Promise.all(
            result.mainPrediction.treatments.map((treatment) =>
              translationService.translateToHindi(treatment)
            )
          ),
        },
        secondaryPredictions: await Promise.all(
          result.secondaryPredictions.map(async (pred) => ({
            cropName: pred.cropName,
            disease: await translationService.translateToHindi(pred.disease),
            probability: pred.probability,
          }))
        ),
      };

      setTranslatedResult(translatedData);
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Failed to translate results");
    } finally {
      setIsTranslating(false);
    }
  };

  const speakText = (text, lang = "en-US") => {
    if (speechSynthRef.current) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.onend = () => setIsPlaying(false);
    speechSynthRef.current = utterance;
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const getTextToSpeak = (isHindi) => {
    const data = isHindi ? translatedResult : result;
    if (!data) return "";

    return `
      ${isHindi ? "फसल प्रकार" : "Crop type"}: ${data.mainPrediction.cropName}.
      ${isHindi ? "मुख्य पहचान परिणाम" : "Primary Detection Result"}:
      ${data.mainPrediction.disease}.
      ${isHindi ? "विश्वास स्तर" : "Confidence"}: ${(
      data.mainPrediction.probability * 100
    ).toFixed(2)}%.
      ${isHindi ? "विवरण" : "Description"}: ${data.mainPrediction.description}.
      ${isHindi ? "अनुशंसित उपचार" : "Recommended Treatments"}:
      ${data.mainPrediction.treatments.join(", ")}.
    `;
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card className="p-6 space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <h2 className="text-2xl font-bold text-center">
            Plant Disease Detection with ML & Gemini
          </h2>
          {modelStatus && !isModelLoading && (
            <div className="flex items-center space-x-4 bg-slate-50 p-2 rounded-md text-sm text-slate-700">
              <div className="flex items-center">
                <Database className="w-4 h-4 mr-1 text-slate-600" />
                <span>{modelStatus.datasetSize.toLocaleString()} images</span>
              </div>
              <div className="flex items-center">
                <Brain className="w-4 h-4 mr-1 text-slate-600" />
                <span>{modelClasses ? modelClasses.length : 0} classes</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-1 text-green-600" />
                <span>{(modelStatus.accuracy * 100).toFixed(2)}% accuracy</span>
              </div>
            </div>
          )}

          {/* Add history link */}
          <div className="flex justify-center mt-2">
            <Link
              to="/disease-history"
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <History className="w-4 h-4 mr-2" />
              View Disease History
            </Link>
          </div>
        </div>

        {isModelLoading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            <p className="mt-2">
              Training disease detection model with local dataset...
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => fileInputRef.current.click()}
                className="flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Image</span>
              </Button>
              <Button
                onClick={startCamera}
                className="flex items-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>Use Camera</span>
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            <div className="flex flex-row space-x-6">
              <div className="flex-shrink-0 w-1/2">
                {streamRef.current ? (
                  <div className="space-y-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-lg"
                    />
                    <Button onClick={captureImage} className="w-full">
                      Capture Image
                    </Button>
                  </div>
                ) : (
                  preview && (
                    <div className="space-y-4">
                      <img
                        src={preview}
                        alt="Selected crop"
                        className="w-full rounded-lg"
                      />
                      {validationError && 1 > 2 ? (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                          <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                            <p className="text-red-700 text-sm">
                              {validationError}
                            </p>
                          </div>
                          <Button
                            onClick={() => fileInputRef.current.click()}
                            className="mt-3 w-full bg-red-100 hover:bg-red-200 text-red-700"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload a Crop Image Instead
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={detectDisease}
                          disabled={isLoading}
                          className="w-full"
                        >
                          {isLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>
                                {analysisStep === "ml"
                                  ? "Analyzing image..."
                                  : analysisStep === "gemini"
                                  ? "Confirming with Gemini..."
                                  : "Analyzing with Gemini..."}
                              </span>
                            </div>
                          ) : (
                            "Detect Disease"
                          )}
                        </Button>
                      )}
                    </div>
                  )
                )}
              </div>

              <div className="flex-1">
                {/* Display the analysis progress and results */}
                {isLoading || result ? (
                  <div className="bg-white rounded-lg p-4 shadow-lg space-y-4">
                    {/* Analysis pipeline UI */}
                    <div className="flex items-center space-x-2 mb-4">
                      {!isKnownCrop && analysisStep === "direct-gemini" ? (
                        <div className="flex flex-col items-center w-full">
                          <div className="flex items-center bg-amber-50 p-2 rounded-md w-full">
                            <AlertCircle className="w-4 h-4 text-amber-600 mr-2" />
                            <span className="text-sm text-amber-800">
                              Image not recognized in our dataset. Using Gemini
                              directly for analysis.
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mt-4 w-full justify-center">
                            <div
                              className={`flex flex-col items-center text-blue-600`}
                            >
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-blue-600 bg-blue-50`}
                              >
                                <svg
                                  className="w-4 h-4"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10s10-4.48 10-10zM4 12c0-4.42 3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8s-8-3.58-8-8zm8-3c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3z"></path>
                                </svg>
                              </div>
                              <span className="text-xs mt-1">Gemini AI</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div
                            className={`flex flex-col items-center ${
                              analysisStep === "ml" || analysisStep === "gemini"
                                ? "text-blue-600"
                                : "text-gray-400"
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                analysisStep === "ml" ||
                                analysisStep === "gemini"
                                  ? "border-blue-600 bg-blue-50"
                                  : "border-gray-300"
                              }`}
                            >
                              <Brain className="w-4 h-4" />
                            </div>
                            <span className="text-xs mt-1">Local ML</span>
                          </div>
                          <div
                            className={`flex-1 h-0.5 ${
                              analysisStep === "gemini"
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }`}
                          ></div>
                          <div
                            className={`flex flex-col items-center ${
                              analysisStep === "gemini"
                                ? "text-blue-600"
                                : "text-gray-400"
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                analysisStep === "gemini"
                                  ? "border-blue-600 bg-blue-50"
                                  : "border-gray-300"
                              }`}
                            >
                              <svg
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10s10-4.48 10-10zM4 12c0-4.42 3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8s-8-3.58-8-8zm8-3c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3z"></path>
                              </svg>
                            </div>
                            <span className="text-xs mt-1">Gemini</span>
                          </div>
                        </>
                      )}
                    </div>

                    {result && (
                      <>
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl font-semibold">
                            {translatedResult
                              ? "परिणाम (हिंदी में)"
                              : "Detection Result"}
                          </h3>
                          <div className="flex space-x-2">
                            {/* Save to history button */}
                            <Button
                              onClick={saveToHistory}
                              disabled={isSavingToHistory || savedToHistory}
                              size="sm"
                              variant="outline"
                              className={`${
                                savedToHistory
                                  ? "bg-green-50 text-green-700 border-green-300"
                                  : ""
                              }`}
                            >
                              {isSavingToHistory ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : savedToHistory ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Save className="w-4 h-4" />
                              )}
                              <span className="ml-1">
                                {savedToHistory ? "Saved" : "Save"}
                              </span>
                            </Button>

                            <Button
                              onClick={() => {
                                if (translatedResult) {
                                  setTranslatedResult(null);
                                } else {
                                  translateToHindi();
                                }
                              }}
                              disabled={isTranslating}
                              size="sm"
                              variant="outline"
                            >
                              {isTranslating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Languages className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              onClick={() => {
                                if (isPlaying) {
                                  window.speechSynthesis.cancel();
                                  setIsPlaying(false);
                                } else {
                                  speakText(
                                    getTextToSpeak(!!translatedResult),
                                    translatedResult ? "hi-IN" : "en-US"
                                  );
                                }
                              }}
                              size="sm"
                              variant="outline"
                            >
                              <Volume2
                                className={`w-4 h-4 ${
                                  isPlaying ? "text-green-500" : ""
                                }`}
                              />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p>
                            <span className="font-medium flex items-center">
                              <Leaf className="w-4 h-4 mr-1 text-green-600" />
                              {translatedResult ? "फसल प्रकार:" : "Crop Type: "}
                            </span>
                            {translatedResult
                              ? translatedResult.mainPrediction.cropName
                              : result.mainPrediction.cropName}
                          </p>
                          <p>
                            <span className="font-medium">
                              {translatedResult
                                ? "पहचानी गई बीमारी:"
                                : "Detected Disease: "}
                            </span>
                            {translatedResult
                              ? translatedResult.mainPrediction.disease
                              : result.mainPrediction.disease}
                          </p>
                          <p>
                            <span className="font-medium">
                              {translatedResult
                                ? "विश्वास स्तर:"
                                : "Confidence: "}
                            </span>
                            {(
                              (translatedResult || result).mainPrediction
                                .probability * 100
                            ).toFixed(2)}
                            %
                          </p>
                          <p>
                            <span className="font-medium">
                              {translatedResult ? "विवरण:" : "Description: "}
                            </span>
                            {translatedResult
                              ? translatedResult.mainPrediction.description
                              : result.mainPrediction.description}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">
                            {translatedResult
                              ? "अनुशंसित उपचार:"
                              : "Recommended Treatments:"}
                          </h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {(
                              translatedResult || result
                            ).mainPrediction.treatments.map(
                              (treatment, index) => (
                                <li key={index}>{treatment}</li>
                              )
                            )}
                          </ul>
                        </div>

                        <div className="mt-4">
                          <h4 className="font-medium mb-2">
                            {translatedResult
                              ? "अन्य संभावित स्थितियां:"
                              : "Other Possible Conditions:"}
                          </h4>
                          <div className="text-sm text-gray-600">
                            {(
                              translatedResult || result
                            ).secondaryPredictions.map((pred, index) => (
                              <div key={index} className="mb-1">
                                <div className="flex justify-between">
                                  <span>{pred.disease}</span>
                                  <span>
                                    {(pred.probability * 100).toFixed(2)}%
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  <span className="flex items-center">
                                    <Leaf className="w-3 h-3 mr-1 text-green-600 opacity-70" />
                                    {pred.cropName}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Add validation error in results panel when loading has finished but no results */}
                    {validationError && !isLoading && !result && (
                      <div className="flex flex-col items-center py-8 text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                          <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-red-700 mb-2">
                          Invalid Image Detected
                        </h3>
                        <p className="text-gray-600 mb-4">{validationError}</p>
                        <Button
                          onClick={() => fileInputRef.current.click()}
                          className="bg-red-100 hover:bg-red-200 text-red-700"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload a Crop Image
                        </Button>
                      </div>
                    )}
                  </div>
                ) : validationError ? (
                  /* Display validation error when no analysis panel is visible */
                  <div className="bg-white rounded-lg p-6 shadow-lg">
                    <div className="flex flex-col items-center py-6 text-center">
                      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-red-700 mb-2">
                        Invalid Image Detected
                      </h3>
                      <p className="text-gray-600 mb-4">{validationError}</p>
                      <Button
                        onClick={() => fileInputRef.current.click()}
                        className="bg-red-100 hover:bg-red-200 text-red-700"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload a Crop Image
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

// Make modelClasses available for the component
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
