'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CopyIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DisplayMode } from '@/lib/embed/types';

interface CodeSnippetProps {
  agentId: string;
  token: string;
}

const CodeSnippet = ({ agentId, token }: CodeSnippetProps) => {
  const [isCopied, setIsCopied] = useState(false);
  
  const code = `
    <!-- Add this to your <head> -->
    <link rel="stylesheet" href="${process.env.NEXT_PUBLIC_WIDGET_SERVICE_URL}/widget.css" />
    <script src="${process.env.NEXT_PUBLIC_WIDGET_SERVICE_URL}/widget.js"></script>

    <!-- Add this before </body> -->
    <script
      dangerouslySetInnerHTML={{
        __html: \`AIChatWidget.init({
          agentId: '${agentId}',
          serverUrl: '${process.env.NEXT_PUBLIC_WIDGET_SERVICE_URL}',
          authToken: '${token}' // Your authentication token
        });
      }\` }
    />
  `;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Authentication Token:
          </p>
          <code className="px-2 py-1 bg-gray-100 dark:bg-neutral-700 rounded text-sm">
            {token}
          </code>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={copyToClipboard}
          className="gap-2"
        >
          {isCopied ? (
            <>✓ Copied</>
          ) : (
            <>Copy Code</>
          )}
        </Button>
      </div>
      
      <pre className="bg-gray-100 dark:bg-neutral-700 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm whitespace-pre-wrap">{code}</code>
      </pre>
    </div>
  );
};