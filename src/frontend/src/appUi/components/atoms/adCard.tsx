import React, { useState } from "react";

import { X } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";

const AdCard = () => {
  const currentYear = 2025;
  const [isVisible, setIsVisible] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  if (!isVisible) return null;

  return (
    <Card
      className=" my-10 ml-1 w-full max-w-[200px] h-90 rounded-lg overflow-hidden shadow-lg relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isHovering && (
        <button
          className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 transition-all"
          onClick={() => setIsVisible(false)}
          aria-label="Close"
        >
          <X size={20} />
        </button>
      )}

      <CardContent className="p-0 relative h-full">
        <img
          src="/images/students_ads.jpg"
          alt="Top Students"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 text-white p-6">
          <a
            href="https://www.nesa.gov.rw/updates/latest-news"
            target="_blank"
            rel="noreferrer noopener"
            className="flex flex-col items-center justify-center"
          >
            <h2 className="text-xl underline font-bold mb-2">TOP STUDENTS</h2>
            <h1 className="text-2xl underline font-extrabold">{currentYear}</h1>
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdCard;
