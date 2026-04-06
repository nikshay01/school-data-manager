import React from "react";

const DashboardSkeleton = () => {
  return (
    <div className="w-full h-full flex flex-col pt-8 px-10 relative overflow-hidden animate-pulse">
      {/* Header Placeholder */}
      <div className="h-[48px] w-[50%] bg-white/5 rounded-2xl mb-8 mx-auto self-center" />

      {/* Main Container Placeholder */}
      <div className="bg-black/20 border border-white/10 rounded-[32px] p-8 backdrop-blur-md w-full max-w-4xl mx-auto h-[600px] flex flex-col">
        {/* Top Controls Placeholder */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 h-12 bg-white/5 rounded-lg" />
          <div className="flex-1 h-12 bg-white/5 rounded-lg" />
        </div>

        {/* Stats Grid Placeholder */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white/5 rounded-2xl" />
          ))}
        </div>

        {/* Table Content Placeholder */}
        <div className="flex-1 bg-white/5 rounded-2xl mt-4" />
      </div>
    </div>
  );
};

export default DashboardSkeleton;
