import React from 'react';
import democracyTable from '../assets/Democracy-Table.jpg';

const HomePage = () => {
  return (
    <>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center my-8">Welcome to the Democracy App 🤝🏽</h1>
        <p className="text-xl text-center mb-8">
          Explore candidates, make informed decisions, and cast your vote with confidence.
        </p>
        <img className="h-75 w-75" src={democracyTable} alt="description" />
      </div>
    </>
  );
};

export default HomePage;
