import { Sun, Moon } from "lucide-react";
import React from "react";

const getTimeIcon = () => {
    const currentHour = new Date().getHours();
    const isDaytime = currentHour >= 6 && currentHour < 18; // 6 AM to 6 PM
    
    if (isDaytime) {
      return <Sun size={18} className="text-amber-500 mr-2" />;
    } else {
      return <Moon size={18} className="text-indigo-400 mr-2" />;
    }
  };