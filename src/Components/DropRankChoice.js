import React from 'react';
import { useDroppable } from '@dnd-kit/core';

// DropRankChoice component represents a droppable area where draggable items can be placed
const DropRankChoice = ({ children, id, onRankUpdate }) => {
  // useDroppable hook is used to make an element droppable, accepting an id for tracking
  const { setNodeRef } = useDroppable({ id });

  // Handle rank update logic when a draggable item is dropped onto this component
  const handleRankUpdate = () => {
    // Convert children elements to an array and extract their ids to determine the new order
    const newOrder = React.Children.toArray(children).map(child => child.props.id);
    // Call the onRankUpdate callback function, passing the new order of items
    onRankUpdate(newOrder);
  };

  // Render the droppable area
  return (
    <>
      {/* The div element is the actual droppable area, setNodeRef attaches a ref to the DOM node for dnd-kit to manage */}
      <div ref={setNodeRef} className="ranked-choices border p-4" onDrop={handleRankUpdate}>
        {/* Conditional rendering: if there are children elements, display them with their rank */}
        {children.length > 0 ? (
          // Map through each child, wrap it with additional markup, and display its rank
          React.Children.map(children, (child, index) => (
            <div className="flex items-center space-x-2">
              {/* Display the rank number before the child */}
              <div className="font-bold">{index + 1}.</div>
              {/* Clone each child element to potentially modify props, in this case, no modifications are made */}
              {React.cloneElement(child)}
            </div>
          ))
        ) : (
          // If there are no children elements, display a placeholder message
          "Click, Drag, Drop, and Order your Candidates here!"
        )}
      </div>
    </>
  );
};

export default DropRankChoice;
