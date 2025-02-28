"use client";

import { Button } from "@radix-ui/themes";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { FormFieldProps } from "./FormFieldArray";
import ReactMarkdown from 'react-markdown';

const MessageExample = ({
  name,
  fields,
  append,
  remove,
  register,
}: FormFieldProps) => {
  // Track preview state for each message
  const [previewStates, setPreviewStates] = useState<Record<string, boolean>>({});
  
  // Toggle preview for a specific message
  const togglePreview = (fieldId: string) => {
    setPreviewStates(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId]
    }));
  };

  // Get current field values for preview (needs watch from react-hook-form)
  // This is a simplified version - in real implementation, use the form's watch function
  const getFieldValue = (index: number, key: 'user' | 'agent') => {
    const input = document.querySelector(`[name="${name}.${index}.${key}"]`) as HTMLTextAreaElement;
    return input?.value || '';
  };

  return (
    <div className="flex flex-col gap-4 mb-2 p-2 bg-neutral-100 dark:bg-neutral-600 rounded-lg">
      <label className="label">
        <span className="label-text font-medium">Message Example</span>
      </label>
      {fields.map((field, index) => (
        <div className="flex gap-2 items-start" key={field.id}>
          <div className="flex flex-col gap-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg p-2 w-full">
            <div className="flex justify-between items-center">
              <label className="label">
                <span className="label-text font-medium">Message Example {index + 1}</span>
              </label>
              <Button 
                size="1" 
                variant="soft" 
                onClick={() => togglePreview(field.id)}
                className="flex items-center gap-1"
              >
                {previewStates[field.id] ? (
                  <><EyeOff size={14} /> Edit</>
                ) : (
                  <><Eye size={14} /> Preview</>
                )}
              </Button>
            </div>
            
            {/* User Message Section */}
            <div className="flex flex-col gap-2">
              <label className="label">
                <span className="label-text font-medium">User:</span>
              </label>
              
              {previewStates[field.id] ? (
                <div className="min-h-[120px] bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 prose prose-sm dark:prose-invert max-w-none overflow-auto">
                  <ReactMarkdown>{getFieldValue(index, 'user')}</ReactMarkdown>
                </div>
              ) : (
                <textarea
                  {...register(`${name}.${index}.user` as const)}
                  placeholder="Hello, I would like to know more about..."
                  className="min-h-[120px] input block w-full focus:outline-none focus:ring-brand-600 focus:border-brand-600 focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg placeholder:text-xs font-mono text-sm"
                  rows={6}
                />
              )}
            </div>
            
            {/* Agent Message Section */}
            <div className="flex flex-col gap-2">
              <label className="label">
                <span className="label-text font-medium">Agent:</span>
              </label>
              
              {previewStates[field.id] ? (
                <div className="min-h-[200px] bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 prose prose-sm dark:prose-invert max-w-none overflow-auto">
                  <ReactMarkdown>{getFieldValue(index, 'agent')}</ReactMarkdown>
                </div>
              ) : (
                <textarea
                  {...register(`${name}.${index}.agent` as const)}
                  placeholder="Okay, I can help you with..."
                  className="min-h-[200px] input block w-full focus:outline-none focus:ring-brand-600 focus:border-brand-600 focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg placeholder:text-xs font-mono text-sm whitespace-pre-wrap"
                  rows={10}
                />
              )}
            </div>
          </div>
          <Button
            size="2"
            color="tomato"
            onClick={() => remove(index)}
            disabled={fields.length === 1}
            className="h-10"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ))}
      <Button
        onClick={(e) => {
          e.preventDefault();
          append({ user: "", agent: "" });
        }}
      >
        Add
      </Button>
    </div>
  );
};

export default MessageExample;
