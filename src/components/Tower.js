import React from 'react';

const Tower = ({ position, onClick }) => {
  const handleClick = () => {
    onClick(position);
  };

  return (
    <div className="tower" onClick={handleClick}>
      {/* Render the tower component */}
    </div>
  );
};

export default Tower;

