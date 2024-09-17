import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <main className="bg-landingimg w-full min-h-screen text-white flex items-center">
        <div className="max-w-md text-left mx-24 p-6 max-md:mx-8 max-md:p-2 ">
          <h1 className="text-4xl gradient-text font-bold mb-4 max-md:text-2xl max-md:mb-2">Ace Your Next Interview</h1>
          <p className="text-lg mb-6 max-md:text-sm max-md:mb-2">
          Prepare with realistic interview questions and get instant feedback. Our platform helps you practice, improve, and succeed in your next job interview.
          </p>
          <Link to='/category' className="bg-rose-500 text-white mt-4 py-3 px-3 rounded-lg hover:bg-gradient-to-tr hover:from-rose-600 hover:to-transparent max-md:mt-2">
            Get Started
          </Link>
        </div>
      </main>
    
    </>
  );
}
