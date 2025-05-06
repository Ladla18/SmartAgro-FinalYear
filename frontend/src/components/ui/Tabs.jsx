// src/components/ui/Tabs.jsx
import React, { useState } from "react";
import classNames from "classnames";

export const Tabs = ({ children, defaultValue, className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={`w-full ${className}`}>
      {React.Children.map(children, (child) => {
        if (child.type.displayName === "TabsList") {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        if (child.type.displayName === "TabsContent") {
          return React.cloneElement(child, { activeTab });
        }
        return child;
      })}
    </div>
  );
};

export const TabsList = ({ children, activeTab, setActiveTab, className }) => (
  <div className={`flex ${className}`}>
    {React.Children.map(children, (child) =>
      React.cloneElement(child, { activeTab, setActiveTab })
    )}
  </div>
);

TabsList.displayName = "TabsList";

export const TabsTrigger = ({
  children,
  value,
  activeTab,
  setActiveTab,
  className,
}) => {
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={classNames(
        "px-4 py-2 -mb-px text-sm font-medium focus:outline-none",
        isActive
          ? "border-b-2 border-green-600 text-green-600"
          : "text-gray-600 hover:text-green-600"
      )}
    >
      {children}
    </button>
  );
};

TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = ({ children, value, activeTab, className }) => {
  if (activeTab !== value) return null;
  return <div className={`mt-4 ${className || ""}`}>{children}</div>;
};

TabsContent.displayName = "TabsContent";
