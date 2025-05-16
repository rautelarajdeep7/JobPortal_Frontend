import React, { useState } from "react";

export default function SalaryRangeSelector() {
  const [min, setMin] = useState(10000);
  const [max, setMax] = useState(500000);

  const minLimit = 10000;
  const maxLimit = 500000;

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), max - 1000);
    setMin(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), min + 1000);
    setMax(value);
  };

  const resetValues = () => {
    setMin(minLimit);
    setMax(maxLimit);
  };

  return (
    <div className="p-4 w-80 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold">Salary Range</h2>
      
      {/* Range Slider Container */}
      <div className="relative mt-6">
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={min}
          onChange={handleMinChange}
          className="absolute w-full h-1 bg-gray-300 appearance-none cursor-pointer"
          style={{ zIndex: min === max - 1000 ? 1 : 2 }}
        />
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={max}
          onChange={handleMaxChange}
          className="absolute w-full h-1 bg-gray-300 appearance-none cursor-pointer"
          style={{ zIndex: 1 }}
        />
      </div>

      {/* Min & Max Inputs */}
      <div className="flex justify-between mt-6">
        <input
          type="number"
          value={min}
          onChange={handleMinChange}
          className="border p-2 rounded w-24 text-center"
        />
        <span className="px-2">-</span>
        <input
          type="number"
          value={max}
          onChange={handleMaxChange}
          className="border p-2 rounded w-24 text-center"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-4">
        <button className="bg-black text-white px-4 py-2 rounded">APPLY</button>
        <button onClick={resetValues} className="bg-gray-200 px-4 py-2 rounded">
          RESET
        </button>
      </div>
    </div>
  );
}
