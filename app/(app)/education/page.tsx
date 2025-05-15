'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

// Create a wrapper component that uses searchParams
const EducationContent = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [apiStatus, setApiStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  const searchParams = useSearchParams();
  const [subjects] = useState<string[]>([
    'mathematics',
    'science',
    'history',
    'language_arts',
    'computer_science',
    'art',
    'music'
  ]);

  // Create a URLSearchParams object to pass query params to other pages
  const createQueryString = () => {
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      params.append(key, value);
    });
    return params.toString();
  };

  // Get the query string for links
  const queryString = createQueryString();
  
  // Function to append query params to a path
  const appendQueryParams = (path: string) => {
    return queryString ? `${path}?${queryString}` : path;
  };

  useEffect(() => {
    // Check if the API is online
    const checkApiStatus = async () => {
      try {
        // Try to fetch educational contents to see if the API is running
        const response = await fetch(`${apiBaseUrl}/api/educational-contents`);
        if (response.ok) {
          setApiStatus('online');
        } else {
          setApiStatus('offline');
        }
      } catch (error) {
        setApiStatus('offline');
        console.error('Error checking API status:', error);
      }
    };

    checkApiStatus();
  }, [apiBaseUrl]);

  return (
    <div className="container">
      <Head>
        <title>Education Module</title>
        <meta name="description" content="AI-powered educational platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Welcome to the Education Module
        </h1>

        <p className="description">
          An AI-powered educational platform
        </p>

        <div className="api-status">
          API Status: {' '}
          {apiStatus === 'loading' ? (
            <span className="loading">Checking...</span>
          ) : apiStatus === 'online' ? (
            <span className="online">Online</span>
          ) : (
            <span className="offline">Offline - Make sure to run the backend with &apos;pnpm run backend&apos;</span>
          )}
        </div>

        <div className="grid">
          <div className="card">
            <h2>Educational Content</h2>
            <p>Explore educational content in various subjects:</p>
            <ul className="subjects-list">
              {subjects.map((subject) => (
                <li key={subject}>{subject.replace('_', ' ')}</li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h2>Learning Sessions</h2>
            <p>Start an interactive learning session with our AI tutor!</p>
            <button className="button" disabled={apiStatus !== 'online'}>
              Start Session
            </button>
          </div>
          
          <div className="card">
            <h2>AI Quiz Generator</h2>
            <p>Test your knowledge with AI-generated quizzes on any topic of your choice.</p>
            {apiStatus === 'online' ? (
              <Link href={appendQueryParams("/education/quiz")} className="button">
                Generate Quiz
              </Link>
            ) : (
              <button className="button" disabled>Generate Quiz</button>
            )}
          </div>
          
          <div className="card">
            <h2>Ask Educational Questions</h2>
            <p>Get answers to your educational questions with detailed explanations from our AI tutor.</p>
            {apiStatus === 'online' ? (
              <Link href={appendQueryParams(`${window.location.pathname}/questions`)} className="button">
                Ask Questions
              </Link>
            ) : (
              <button className="button" disabled>Ask Questions</button>
            )}
          </div>
          
          <div className="card featured">
            <h2>AI Learning Path Generator</h2>
            <p>Get a personalized learning path for any topic, complete with resources and step-by-step guidance.</p>
            {apiStatus === 'online' ? (
              <Link href={appendQueryParams(`${window.location.pathname}/learning-path`)} className="button">
                Generate Learning Path
              </Link>
            ) : (
              <button className="button" disabled>Generate Learning Path</button>
            )}
          </div>
          
          <div className="card">
            <h2>Saved Content</h2>
            <p>View and manage all your saved quizzes, answers, and learning paths in one place.</p>
            {apiStatus === 'online' ? (
              <Link href={appendQueryParams(`${window.location.pathname}/saved-content`)} className="button">
                View Saved Content
              </Link>
            ) : (
              <button className="button" disabled>View Saved Content</button>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
          text-align: center;
          color: #FFB000;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
          margin: 1rem 0;
        }

        .api-status {
          margin: 2rem 0;
          font-size: 1.2rem;
        }

        .loading {
          color: #f0ad4e;
        }

        .online {
          color: #5cb85c;
          font-weight: bold;
        }

        .offline {
          color: #d9534f;
          font-weight: bold;
        }

        .grid {
          display: flex;
          align-items: stretch;
          justify-content: center;
          flex-wrap: wrap;
          width: 100%;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 30%;
          padding: 1.5rem;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease, transform 0.2s ease;
          min-height: 220px;
          display: flex;
          flex-direction: column;
        }

        .card h2 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
          color: #333;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
          flex-grow: 1;
        }

        .card.featured {
          border-color: #FFB000;
          background-color: #FFF8E0;
        }

        .button {
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background-color: #FFB000;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
          text-align: center;
          display: inline-block;
          text-decoration: none;
        }

        .button:hover:not([disabled]) {
          background-color: #E67E22;
        }

        .button[disabled] {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .subjects-list {
          padding-left: 1.5rem;
          margin-top: 0.5rem;
        }

        .subjects-list li {
          margin-bottom: 0.25rem;
          text-transform: capitalize;
        }

        @media (max-width: 900px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

// Main component with Suspense boundary
const EducationModule = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EducationContent />
    </Suspense>
  );
};

export default EducationModule; 
