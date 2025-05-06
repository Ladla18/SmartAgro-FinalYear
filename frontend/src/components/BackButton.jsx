import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ onResetFeature }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onResetFeature) {
      onResetFeature();
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      variant="ghost"
      className="mb-4 text-gray-600 hover:text-gray-800"
      onClick={handleClick}
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back
    </Button>
  );
};

// Support both named and default exports
export { BackButton };
export default BackButton;
