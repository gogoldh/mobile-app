import React, { createContext, useContext, useState } from "react";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [language, setLanguage] = useState("nl");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <SettingsContext.Provider
      value={{
        language,
        setLanguage,
        darkMode,
        setDarkMode,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);