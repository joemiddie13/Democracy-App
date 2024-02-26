import React from 'react';
import { useDroppable } from '@dnd-kit/core';

const DropRankChoice = ({ children, id }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="ranked-choices border p-4">
      {children.length > 0 ? children : "Drag candidates here to rank them"}
    </div>
  );
};

export default DropRankChoice;
