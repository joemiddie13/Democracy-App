import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// DragCandidate component is designed to be a draggable element in the drag-and-drop context
const DragCandidate = ({ id, children }) => {
  // useSortable hook provides the necessary handlers and properties to make this component sortable within a dnd-kit context
  const {
    attributes, // contains attributes necessary for accessibility and other functionalities
    listeners, // contains event listeners like onMouseDown, onTouchStart to initiate the drag action
    setNodeRef, // function to set the ref on the DOM element, used by dnd-kit to track the element
    transform, // contains the CSS transform properties (x, y, scaleX, scaleY) reflecting the element's movement
    transition, // CSS transition property to smoothly animate the drag movement
  } = useSortable({ id }); // id is a unique identifier for the draggable item

  // style object applies the transform and transition to the component, making it move and animate
  const style = {
    transform: CSS.Transform.toString(transform), // Converts transform properties to a CSS-compatible string
    transition, // Applies CSS transition property to animate changes
  };

  // The component returns a div that wraps the children (content of the draggable item)
  // The div is made draggable by applying the setNodeRef, style, attributes, and listeners
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children} {/* children prop allows for flexible content inside the draggable element */}
    </div>
  );
};

// Exporting DragCandidate component for use in other parts of the application
export default DragCandidate;
