'use client';

import React, { Suspense } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { SavedContentComponent } from '@defikitdotnet/education-module-ai/frontend';
import { useSearchParams } from 'next/navigation';


const SavedContentPageContent = () => {
  const searchParams = useSearchParams();
  const agentId = searchParams.get('agentId');

  return (
    <div className="container">
      <Head>
        <title>Quiz Generator | Education Module</title>
        <meta name="description" content="AI-powered quiz generator" />
      </Head>

      <main>
        <h1 className="title">Quiz Generator</h1>
        
        <p className="description">
          Generate a quiz on any topic to test your knowledge
        </p>

        <div className="content-area">
          <SavedContentComponent
            apiBaseUrl={process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}
          />
        </div>

        {/* <div className="back-link">
          <Link href={} className="back-link-text">← Back to Education</Link>
        </div> */}
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
        }

        main {
          padding: 3rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          max-width: 1200px;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 3rem;
          text-align: center;
          color: #333;
        }

        .description {
          text-align: center;
          line-height: 1.5;
          font-size: 1.2rem;
          margin: 1rem 0 2rem;
          color: #666;
        }

        .content-area {
          width: 100%;
          max-width: 900px;
          background-color: #f9f9f9;
          border-radius: 10px;
          padding: 2rem;
        }

        .back-link {
          margin-top: 2rem;
          text-align: center;
        }

        .back-link-text {
          color: #FFB000;
          font-size: 1rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }

        .back-link-text:hover {
          text-decoration: underline;
        }

        @media (max-width: 600px) {
          .title {
            font-size: 2rem;
          }
          
          .content-area {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

const SavedContentPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SavedContentPageContent />
    </Suspense>
  );
};

export default SavedContentPage;