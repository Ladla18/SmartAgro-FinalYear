// src/components/ui/Button.jsx
import React, { createContext, useState } from "react";
import classNames from "classnames";

import axios from "axios";
export const Button = ({
  children,
  variant = "default",
  size = "md",
  title,
  onButtonClick,
  className,
  ...props
}) => {
  const variants = {
    default: "bg-green-600 text-white hover:bg-green-700",
    outline:
      "border border-green-600 text-green-600 hover:bg-green-600 hover:text-white",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  const handleToolClick = () => {
    if (onButtonClick) {
      onButtonClick(title); // Pass `title` to parent callback
    }
  };

  return (
    <button
      onClick={handleToolClick}
      className={classNames(
        "font-medium rounded focus:outline-none flex  focus:ring-2 focus:ring-green-500",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
