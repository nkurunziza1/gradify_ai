import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="relative w-10 h-10">
        <div className="absolute w-6 h-6 border border-white rounded-full"></div>
        <div className="absolute w-6 h-6 border border-[#854836] rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default Loading;