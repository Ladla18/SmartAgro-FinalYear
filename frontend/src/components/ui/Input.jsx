// src/components/ui/Input.jsx
import React from "react";

export const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
    {...props}
  />
));

Input.displayName = "Input";
