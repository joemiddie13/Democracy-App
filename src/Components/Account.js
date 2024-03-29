import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DragCandidate from './DragCandidate';
import DropRankChoice from './DropRankChoice';

const Account = () => {
  const [userDetails, setUserDetails] = useState({ firstName: '', lastName: '' });
  const [candidates, setCandidates] = useState([]);
  const [rankedCandidates, setRankedCandidates] = useState([]);
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authState.isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/user-details?email=${authState.userEmail}`, {
          method: 'GET',
        });
        const data = await response.json();
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

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/candidates');
        const data = await response.json();
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

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over) {
      const activeIndex = candidates.findIndex((candidate) => `draggable-${candidate.id}` === active.id);
      const overIndex = rankedCandidates.findIndex((candidate) => `droppable-${candidate.id}` === over.id);

      if (activeIndex !== -1) {
        // Moving from un-ranked to ranked
        const activeCandidate = candidates[activeIndex];
        let newRankedCandidates = [...rankedCandidates];
        if (overIndex !== -1) {
          // Insert into specific position
          newRankedCandidates.splice(overIndex, 0, activeCandidate);
        } else {
          // Add to the end if not over a specific droppable
          newRankedCandidates.push(activeCandidate);
        }
        setRankedCandidates(newRankedCandidates);
        setCandidates(candidates.filter((_, index) => index !== activeIndex));
      } else if (overIndex !== -1) {
        // Reordering within ranked
        setRankedCandidates((currentRanked) => arrayMove(currentRanked, overIndex, rankedCandidates.findIndex((candidate) => `droppable-${candidate.id}` === active.id)));
      }
    }
  };

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
        body: JSON.stringify(rankChoiceData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Submission successful', data);
      } else {
        console.error('Submission failed', data.errors);
      }
    } catch (error) {
      console.error('Error submitting rank choices:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 text-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mt-4 mb-8">Welcome, {userDetails.firstName} {userDetails.lastName}!</h1>
      </div>
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-10">
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
            <SortableContext items={rankedCandidates.map(candidate => `droppable-${candidate.id}`)} strategy={verticalListSortingStrategy}>
              <DropRankChoice id="drop-area" className="rank-choice-area w-1/3">
                {rankedCandidates.map((candidate) => (
                  <DragCandidate key={candidate.id} id={`droppable-${candidate.id}`}>
                    <div className="p-4 border rounded my-2 bg-slate-700"> {/* Updated classes for background */}
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
      <div className="container mx-auto px-4 flex justify-center items-center">
        <button onClick={submitRankChoices} className="submit-button mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
          Submit Rank Choices
        </button>
      </div>
    </div>
  );
};

export default Account;