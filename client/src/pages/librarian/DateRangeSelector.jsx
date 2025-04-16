import React from 'react';

const DateRangeSelector = ({ activeRange, onRangeChange }) => {
  const dateRangeOptions = [
    { id: "week", name: "Week" },
    { id: "month", name: "Month" },
    { id: "quarter", name: "Quarter" },
    { id: "year", name: "Year" },
    { id: "all", name: "All Time" }
  ];

  // Get display text for current date range
  const getDateRangeDisplayText = () => {
    const today = new Date();
    let startDate = new Date();
    
    switch (activeRange) {
      case "week":
        startDate.setDate(today.getDate() - 7);
        return `Past Week (${startDate.toLocaleDateString()} - ${today.toLocaleDateString()})`;
      case "month":
        startDate.setMonth(today.getMonth() - 1);
        return `Past Month (${startDate.toLocaleDateString()} - ${today.toLocaleDateString()})`;
      case "quarter":
        startDate.setMonth(today.getMonth() - 3);
        return `Past Quarter (${startDate.toLocaleDateString()} - ${today.toLocaleDateString()})`;
      case "year":
        startDate.setFullYear(today.getFullYear() - 1);
        return `Past Year (${startDate.toLocaleDateString()} - ${today.toLocaleDateString()})`;
      case "all":
        return "All Time";
      default:
        return "Custom Range";
    }
  };

  return (
    <div className="date-range-selector">
      <div className="date-range-display">
        {getDateRangeDisplayText()}
      </div>
      
      <div className="date-range-buttons">
        {dateRangeOptions.map(range => (
          <button 
            key={range.id}
            className={`date-range-button ${activeRange === range.id ? 'active' : ''}`}
            onClick={() => onRangeChange(range.id)}
          >
            {range.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateRangeSelector;