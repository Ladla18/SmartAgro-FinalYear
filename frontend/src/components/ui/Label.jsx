import React from "react";
import cn from "classnames";

export const Label = ({ htmlFor, children, className, ...props }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("block text-sm font-medium text-gray-700 mb-1", className)}
      {...props}
    >
      {children}
    </label>
  );
};
