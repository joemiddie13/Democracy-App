import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext'; // Custom hook to access authentication context
import { useNavigate } from 'react-router-dom'; // Hook for programmatically navigating between routes
// Importing DnD (Drag and Drop) Kit for implementing drag-and-drop features
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
// Custom components for draggable candidates and the drop area for rank choices
import DragCandidate from './DragCandidate';
import DropRankChoice from './DropRankChoice';

const Account = () => {
  // State management for user details, list of all candidates, and list of ranked candidates
  const [userDetails, setUserDetails] = useState({ firstName: '', lastName: '' });
  const [candidates, setCandidates] = useState([]);
  const [rankedCandidates, setRankedCandidates] = useState([]);

  // Accessing the authentication state and functions from the AuthContext
  const { authState } = useAuth();
  // Hook for navigating to different routes programmatically
  const navigate = useNavigate();

  // Effect hook to fetch user details upon component mount or when auth state changes
  useEffect(() => {
    // Redirect to login if the user is not authenticated
    if (!authState.isLoggedIn) {
      navigate('/login');
      return;
    }

    // Asynchronous function to fetch user details from the server
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/user-details?email=${authState.userEmail}`, {
          method: 'GET',
        });
        const data = await response.json();
        // Update state with user details if fetch is successful
        if (response.ok) {
          setUserDetails({ firstName: data.firstName, lastName: data.lastName });
        } else {
          alert('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [authState.isLoggedIn, authState.userEmail, navigate]);

  // Effect hook to fetch the list of candidates from the server
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/candidates');
        const data = await response.json();
        // Update state with the list of candidates if fetch is successful
        if (response.ok) {
          setCandidates(data);
        } else {
          alert('Failed to fetch candidates');
        }
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };

    fetchCandidates();
  }, []);

  // Function to handle the end of a drag event
  const handleDragEnd = (event) => {
    const { active, over } = event;

    // Only proceed if the drag ended over a droppable area
    if (over) {
      const activeIndex = candidates.findIndex((candidate) => `draggable-${candidate.id}` === active.id);
      const overIndex = rankedCandidates.findIndex((candidate) => `droppable-${candidate.id}` === over.id);

      // Handle moving from unranked to ranked list
      if (activeIndex !== -1) {
        const activeCandidate = candidates[activeIndex];
        let newRankedCandidates = [...rankedCandidates];
        if (overIndex !== -1) {
          // Insert at specific position if dropped over another candidate
          newRankedCandidates.splice(overIndex, 0, activeCandidate);
        } else {
          // Add to the end if not dropped over a specific candidate
          newRankedCandidates.push(activeCandidate);
        }
        // Update state with the new list of ranked candidates and remove the moved candidate from the unranked list
        setRankedCandidates(newRankedCandidates);
        setCandidates(candidates.filter((_, index) => index !== activeIndex));
      } else if (overIndex !== -1) {
        // Handle reordering within the ranked list
        setRankedCandidates((currentRanked) => arrayMove(currentRanked, overIndex, rankedCandidates.findIndex((candidate) => `droppable-${candidate.id}` === active.id)));
      }
    }
  };

  // Function to submit the ranked choices to the server
  const submitRankChoices = async () => {
    const rankChoiceData = {
      first_choice: rankedCandidates[0]?.id,
      second_choice: rankedCandidates[1]?.id,
      third_choice: rankedCandidates[2]?.id,
      fourth_choice: rankedCandidates[3]?.id,
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/submit-rank-choice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rankChoiceData),
        credentials: 'include', // Ensures cookies are included in the request
      });

      const data = await response.json();
      // Log success or failure based on the server's response
      if (response.ok) {
        console.log('Submission successful', data);
      } else {
        console.error('Submission failed', data.errors);
      }
    } catch (error) {
      console.error('Error submitting rank choices:', error);
    }
  };

  // Render the component UI
  return (
    <div className="min-h-screen bg-slate-800 text-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mt-4 mb-8">Welcome, {userDetails.firstName} {userDetails.lastName}!</h1>
      </div>
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-10">
            {/* List of candidates that can be dragged */}
            <SortableContext items={candidates.map(candidate => `draggable-${candidate.id}`)} strategy={verticalListSortingStrategy}>
              <div className="candidates-list w-1/3">
                {candidates.map((candidate) => (
                  <DragCandidate key={candidate.id} id={`draggable-${candidate.id}`}>
                    <div className="p-4 border rounded my-2 bg-slate-700">
                      <h3 className="text-xl font-bold">{candidate.full_name}</h3>
                      <p>Party Affiliation: {candidate.party_affiliation}</p>
                      <p>Political Ideology: {candidate.political_ideology}</p>
                    </div>
                  </DragCandidate>
                ))}
              </div>
            </SortableContext>
            {/* Drop area for ranked choices */}
            <SortableContext items={rankedCandidates.map(candidate => `droppable-${candidate.id}`)} strategy={verticalListSortingStrategy}>
              <DropRankChoice id="drop-area" className="rank-choice-area w-1/3">
                {rankedCandidates.map((candidate) => (
                  <DragCandidate key={candidate.id} id={`droppable-${candidate.id}`}>
                    <div className="p-4 border rounded my-2 bg-slate-700">
                      <h3 className="text-xl font-bold">{candidate.full_name}</h3>
                      <p>Party Affiliation: {candidate.party_affiliation}</p>
                      <p>Political Ideology: {candidate.political_ideology}</p>
                    </div>
                  </DragCandidate>
                ))}
              </DropRankChoice>
            </SortableContext>
          </div>
        </div>
      </DndContext>
      {/* Submit button for ranked choices */}
      <div className="container mx-auto px-4 flex justify-center items-center">
        <button onClick={submitRankChoices} className="submit-button mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
          Submit Rank Choices
        </button>
      </div>
    </div>
  );
};

export default Account;
