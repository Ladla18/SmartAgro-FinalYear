import React, { useState, useEffect } from "react";
import { diseaseHistoryService } from "../services/diseaseHistoryService";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Leaf, Calendar, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

// Import API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

export const DiseaseHistory = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const historyData = await diseaseHistoryService.getUserHistory();
      setHistory(historyData);
    } catch (err) {
      console.error("Failed to fetch disease history:", err);
      setError(err.message || "Failed to load disease history");
      toast.error(err.message || "Failed to load history");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleViewDetails = (entry) => {
    setSelectedEntry(entry);
  };

  const handleCloseDetails = () => {
    setSelectedEntry(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setIsDeleting(true);
      try {
        await diseaseHistoryService.deleteHistory(id);
        toast.success("History entry deleted");

        // Remove the entry from the state
        setHistory(history.filter((entry) => entry._id !== id));

        // Close the details panel if the deleted entry was selected
        if (selectedEntry && selectedEntry._id === id) {
          setSelectedEntry(null);
        }
      } catch (err) {
        console.error("Failed to delete history entry:", err);
        toast.error(err.message || "Failed to delete entry");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Helper function to get full image URL
  const getImageUrl = (relativePath) => {
    if (!relativePath) return null;

    // Check if the path already starts with http (already a full URL)
    if (relativePath.startsWith("http")) {
      return relativePath;
    }

    // Handle absolute paths from Windows (C:/ or other drive letters)
    if (/^[A-Za-z]:\//.test(relativePath)) {
      // Extract just the filename from the absolute path
      const filename = relativePath.split("/").pop();
      return `${API_URL}/uploads/${filename}`;
    }

    // Handle paths that already contain "uploads/"
    if (relativePath.includes("uploads/")) {
      // Make sure we don't duplicate the API_URL if it's already in the path
      if (relativePath.startsWith("/")) {
        return `${API_URL}${relativePath}`;
      } else {
        return `${API_URL}/${relativePath}`;
      }
    }

    // For simple paths, ensure they point to uploads
    if (!relativePath.startsWith("/")) {
      return `${API_URL}/${relativePath}`;
    }

    // Default fallback
    return `${API_URL}${relativePath}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="ml-2">Loading history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Error Loading History</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          No Disease Detection History
        </h3>
        <p className="text-gray-600 max-w-md mb-4">
          Your crop disease detection history will appear here after you analyze
          your first crop image.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Disease Detection History</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-1">
            <div className="space-y-4">
              {history.map((entry) => (
                <div
                  key={entry._id}
                  className={`border rounded-lg p-4 cursor-pointer transition hover:bg-gray-50 ${
                    selectedEntry && selectedEntry._id === entry._id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => handleViewDetails(entry)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-1">
                        <Leaf className="w-4 h-4 text-green-600 mr-2" />
                        <h3 className="font-semibold">{entry.cropName}</h3>
                      </div>
                      <p className="text-red-600 font-medium">
                        {entry.disease}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {formatDate(entry.timestamp)}
                      </p>
                    </div>
                    <div className="ml-4">
                      <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-medium">
                        {(entry.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-1">
            {selectedEntry ? (
              <div className="border rounded-lg p-4 h-full">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">
                    {selectedEntry.disease}
                  </h3>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleDelete(selectedEntry._id)}
                      disabled={isDeleting}
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-red-200 hover:bg-red-50"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      onClick={handleCloseDetails}
                      variant="outline"
                      size="sm"
                    >
                      Close
                    </Button>
                  </div>
                </div>

                {selectedEntry.imageUrl && (
                  <div className="mb-4">
                    <img
                      src={getImageUrl(selectedEntry.imageUrl)}
                      alt={selectedEntry.disease}
                      className="w-full rounded-lg max-h-64 object-cover"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <span className="font-medium flex items-center">
                      <Leaf className="w-4 h-4 mr-1 text-green-600" />
                      Crop Type:
                    </span>
                    <p>{selectedEntry.cropName}</p>
                  </div>

                  <div>
                    <span className="font-medium">Confidence:</span>
                    <p>{(selectedEntry.probability * 100).toFixed(2)}%</p>
                  </div>

                  <div>
                    <span className="font-medium">Description:</span>
                    <p className="text-gray-700">{selectedEntry.description}</p>
                  </div>

                  <div>
                    <span className="font-medium">Treatments:</span>
                    <ul className="list-disc pl-5 space-y-1 mt-1">
                      {selectedEntry.treatments.map((treatment, index) => (
                        <li key={index}>{treatment}</li>
                      ))}
                    </ul>
                  </div>

                  {selectedEntry.secondaryPredictions &&
                    selectedEntry.secondaryPredictions.length > 0 && (
                      <div>
                        <span className="font-medium">
                          Other Possible Conditions:
                        </span>
                        <div className="text-sm text-gray-600 mt-1">
                          {selectedEntry.secondaryPredictions.map(
                            (pred, index) => (
                              <div key={index} className="mb-1">
                                <div className="flex justify-between">
                                  <span>{pred.disease}</span>
                                  <span>
                                    {(pred.probability * 100).toFixed(2)}%
                                  </span>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  <div>
                    <span className="font-medium">Detected on:</span>
                    <p>{formatDate(selectedEntry.timestamp)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">
                    Select an entry to view details
                  </h3>
                  <p className="text-sm text-gray-400">
                    Click on any history entry to view its detailed information
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
