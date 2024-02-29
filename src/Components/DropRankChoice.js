import React from 'react';
import { useDroppable } from '@dnd-kit/core';

const DropRankChoice = ({ children, id, onRankUpdate }) => {
  const { setNodeRef } = useDroppable({ id });

  // Call the onRankUpdate callback with the new order whenever it changes
  const handleRankUpdate = () => {
    const newOrder = React.Children.toArray(children).map(child => child.props.id);
    onRankUpdate(newOrder);
  };

  return (
    <>
      <div ref={setNodeRef} className="ranked-choices border p-4" onDrop={handleRankUpdate}>
        {children.length > 0 ? (
          React.Children.map(children, (child, index) => (
            <div className="flex items-center space-x-2">
              <div className="font-bold">{index + 1}.</div>
              {React.cloneElement(child)}
            </div>
          ))
        ) : (
          "Click, Drag, Drop, and Order your Candidates here!"
        )}
      </div>
      {/* Hidden form fields would be updated by the parent component, which holds the state of the ranking */}
    </>
  );
};

export default DropRankChoice;
