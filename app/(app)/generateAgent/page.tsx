'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch, Text, Flex } from '@radix-ui/themes';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/hooks';
import { usePrivy } from '@privy-io/react-auth';
import { Copy, Plus, Trash } from 'lucide-react';

const GenerateAgentPage: React.FC = () => {
  const [description, setDescription] = useState('');
  const [createAfterGeneration, setCreateAfterGeneration] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [generatedCharacter, setGeneratedCharacter] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const { user } = useLogin();
  const { getAccessToken } = usePrivy();

  // Form state for editable fields
  const [formState, setFormState] = useState({
    name: '',
    bio: '',
    lore: '',
    topics: [] as string[],
    knowledge: [] as string[],
    adjectives: [] as string[],
    style: {
      all: [] as string[],
      chat: [] as string[],
      post: [] as string[]
    },
    messageExamples: [{ user: 'Hello, I would like to know more about...', agent: 'Sure, I can help you with...' }],
    postExamples: [] as string[]
  });

  // Update form state when a character is generated
  useEffect(() => {
    if (generatedCharacter) {
      setFormState({
        name: generatedCharacter.name || '',
        bio: Array.isArray(generatedCharacter.bio) ? generatedCharacter.bio.join('\n\n') : generatedCharacter.bio || '',
        lore: Array.isArray(generatedCharacter.lore) ? generatedCharacter.lore.join('\n\n') : generatedCharacter.lore || '',
        topics: generatedCharacter.topics || [],
        knowledge: generatedCharacter.knowledge || [],
        adjectives: generatedCharacter.adjectives || [],
        style: {
          all: generatedCharacter.style?.all || [],
          chat: generatedCharacter.style?.chat || [],
          post: generatedCharacter.style?.post || []
        },
        messageExamples: generatedCharacter.messageExamples?.map((example: any) => {
          const userMsg = example[0]?.content?.text || '';
          const agentMsg = example[1]?.content?.text || '';
          return { user: userMsg, agent: agentMsg };
        }) || [{ user: '', agent: '' }],
        postExamples: generatedCharacter.postExamples || []
      });
    }
  }, [generatedCharacter]);

  // Step 1: Generate character based on description
  const handleGenerateCharacter = async () => {
    if (!description.trim()) {
      return;
    }

    setIsLoading(true);
    setGeneratedCharacter(null);
    setResult(null);

    try {
      const accessToken = await getAccessToken();
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/agents/generate-character', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          description,
          modelProvider: "google",
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.character) {
        // Store the generated character
        setGeneratedCharacter(data.character);
        setResult(data);
        
        // If createAfterGeneration is checked, automatically create the agent
        if (createAfterGeneration) {
          // Small delay to ensure state is updated
          setTimeout(() => {
            handleCreateAgent(data.character);
          }, 100);
        }
      } else {
        const errorMessage = data.message || 'Failed to generate character. Please try again.';
        window.alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error generating character:', error);
      window.alert('Error: Unable to generate character. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Create agent using the generated (and possibly edited) character
  const handleCreateAgent = async (characterToUse = null) => {
    // Use either the passed character (for auto-creation) or the edited character
    const character = characterToUse || generatedCharacter;
    
    if (!character) {
      window.alert('No character data available. Please generate a character first.');
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Transform form state to API format if we're using edited character
      const configData = characterToUse ? character : {
        ...character,
        name: formState.name,
        bio: formState.bio.split('\n\n').filter(Boolean),
        lore: formState.lore.split('\n\n').filter(Boolean),
        topics: formState.topics,
        knowledge: formState.knowledge,
        adjectives: formState.adjectives,
        style: formState.style,
        messageExamples: formState.messageExamples.map(example => [
          { user: "{{user1}}", content: { text: example.user } },
          { user: formState.name, content: { text: example.agent } }
        ]),
        postExamples: formState.postExamples,
        settings: {
          secrets: {},
        },
      };
      
      const accessToken = await getAccessToken();
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/agents/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          config: configData,
          ownerAddress: user?.wallet?.address
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store creation result and show success message
        setResult({ ...result, createdAgent: data });
        window.alert('Agent created successfully!');
        
        // Reset form
        setGeneratedCharacter(null);
        setDescription('');
        setCreateAfterGeneration(false);
      } else {
        const errorMessage = data.message || 'Failed to create agent. Please try again.';
        window.alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error creating agent:', error);
      window.alert('Error: Unable to create agent. Please try again later.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStyleChange = (styleType: 'all' | 'chat' | 'post', value: string) => {
    setFormState(prev => ({
      ...prev,
      style: {
        ...prev.style,
        [styleType]: value.split(',').map(item => item.trim())
      }
    }));
  };

  const handleAddItem = (field: string, value: string) => {
    if (!value.trim()) return;
    
    setFormState(prev => {
      if (field === 'topics' || field === 'knowledge' || field === 'adjectives') {
        return {
          ...prev,
          [field]: [...prev[field], value.trim()]
        };
      } else if (field === 'postExamples') {
        return {
          ...prev,
          postExamples: [...prev.postExamples, value.trim()]
        };
      }
      return prev;
    });
  };

  const handleRemoveItem = (field: string, index: number) => {
    setFormState(prev => {
      if (field === 'topics' || field === 'knowledge' || field === 'adjectives') {
        const newItems = [...prev[field]];
        newItems.splice(index, 1);
        return {
          ...prev,
          [field]: newItems
        };
      } else if (field === 'postExamples') {
        const newExamples = [...prev.postExamples];
        newExamples.splice(index, 1);
        return {
          ...prev,
          postExamples: newExamples
        };
      } else if (field === 'messageExamples') {
        const newExamples = [...prev.messageExamples];
        newExamples.splice(index, 1);
        return {
          ...prev,
          messageExamples: newExamples
        };
      }
      return prev;
    });
  };

  const handleAddMessageExample = () => {
    setFormState(prev => ({
      ...prev,
      messageExamples: [
        ...prev.messageExamples,
        { user: '', agent: '' }
      ]
    }));
  };

  const handleMessageExampleChange = (index: number, type: 'user' | 'agent', value: string) => {
    setFormState(prev => {
      const newExamples = [...prev.messageExamples];
      newExamples[index] = {
        ...newExamples[index],
        [type]: value
      };
      return {
        ...prev,
        messageExamples: newExamples
      };
    });
  };

  return (
    <div className="container mx-auto p-6">
      {!generatedCharacter || createAfterGeneration ? (
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Generate Agent</h1>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Agent Description
              </label>
              <Textarea
                id="description"
                placeholder="Describe the agent you want to generate..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[150px]"
              />
            </div>

            <Flex align="center" gap="2">
              <Switch 
                checked={createAfterGeneration}
                onCheckedChange={setCreateAfterGeneration}
                size="2"
              />
              <Text size="2">Create agent after generation</Text>
            </Flex>

            <Button
              onClick={handleGenerateCharacter}
              disabled={isLoading || !description.trim()}
              className="w-full"
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-6">Edit Generated Agent</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="agent-name" className="block text-sm font-medium mb-2">
                AI Agent Name
              </label>
              <Input
                id="agent-name"
                value={formState.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full"
                placeholder="Agent Name"
              />
            </div>
            
            <div>
              <label htmlFor="model-provider" className="block text-sm font-medium mb-2">
                Model provider to use <span className="text-gray-400">(Non-editable)</span>
              </label>
              <Input
                id="model-provider"
                value="Google"
                disabled
                className="w-full bg-gray-50"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="agent-biography" className="block text-sm font-medium">
                  Agent Biography
                </label>
                <Button variant="ghost" size="sm" onClick={() => {}} className="text-xs">
                  <Copy size={14} className="mr-1" /> Copy
                </Button>
              </div>
              <Textarea
                id="agent-biography"
                value={formState.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="w-full min-h-[120px]"
              />
              <Button variant="outline" size="sm" className="mt-2 w-full">Add</Button>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="agent-lore" className="block text-sm font-medium">
                  Agent Background lore
                </label>
                <Button variant="ghost" size="sm" onClick={() => {}} className="text-xs">
                  <Copy size={14} className="mr-1" /> Copy
                </Button>
              </div>
              <Textarea
                id="agent-lore"
                value={formState.lore}
                onChange={(e) => handleInputChange('lore', e.target.value)}
                className="w-full min-h-[120px]"
              />
              <Button variant="outline" size="sm" className="mt-2 w-full">Add</Button>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="topics" className="block text-sm font-medium">
                  Topics
                </label>
              </div>
              <div className="flex gap-2 mb-2">
                <Input
                  id="topics"
                  placeholder="Add topics..."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddItem('topics', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const input = document.getElementById('topics') as HTMLInputElement;
                    handleAddItem('topics', input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formState.topics.map((topic, index) => (
                  <div key={index} className="flex items-center bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md px-2 py-1">
                    <span className="text-sm">{topic}</span>
                    <button 
                      className="ml-2 text-gray-500 hover:text-red-500"
                      onClick={() => handleRemoveItem('topics', index)}
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="knowledge" className="block text-sm font-medium">
                  Knowledge
                </label>
              </div>
              <div className="flex gap-2 mb-2">
                <Input
                  id="knowledge"
                  placeholder="Add knowledge..."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddItem('knowledge', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const input = document.getElementById('knowledge') as HTMLInputElement;
                    handleAddItem('knowledge', input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formState.knowledge.map((item, index) => (
                  <div key={index} className="flex items-center bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md px-2 py-1">
                    <span className="text-sm">{item}</span>
                    <button 
                      className="ml-2 text-gray-500 hover:text-red-500"
                      onClick={() => handleRemoveItem('knowledge', index)}
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="adjectives" className="block text-sm font-medium">
                  Adjectives
                </label>
              </div>
              <div className="flex gap-2 mb-2">
                <Input
                  id="adjectives"
                  placeholder="Add adjectives..."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddItem('adjectives', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const input = document.getElementById('adjectives') as HTMLInputElement;
                    handleAddItem('adjectives', input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formState.adjectives.map((item, index) => (
                  <div key={index} className="flex items-center bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md px-2 py-1">
                    <span className="text-sm">{item}</span>
                    <button 
                      className="ml-2 text-gray-500 hover:text-red-500"
                      onClick={() => handleRemoveItem('adjectives', index)}
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="style-all" className="block text-sm font-medium mb-2">
                Style for All
              </label>
              <Input
                id="style-all"
                value={formState.style.all.join(', ')}
                onChange={(e) => handleStyleChange('all', e.target.value)}
                className="w-full"
                placeholder="Friendly, Professional, Engaging"
              />
              <Button variant="outline" size="sm" className="mt-2 w-full">Add</Button>
            </div>
            
            <div>
              <label htmlFor="style-chat" className="block text-sm font-medium mb-2">
                Chat Style
              </label>
              <Input
                id="style-chat"
                value={formState.style.chat.join(', ')}
                onChange={(e) => handleStyleChange('chat', e.target.value)}
                className="w-full"
                placeholder="Helpful, Knowledgeable, Supportive"
              />
              <Button variant="outline" size="sm" className="mt-2 w-full">Add</Button>
            </div>
            
            <div>
              <label htmlFor="style-post" className="block text-sm font-medium mb-2">
                Post Style
              </label>
              <Input
                id="style-post"
                value={formState.style.post.join(', ')}
                onChange={(e) => handleStyleChange('post', e.target.value)}
                className="w-full"
                placeholder="Informative, Engaging, Fun"
              />
              <Button variant="outline" size="sm" className="mt-2 w-full">Add</Button>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">
                  Message Examples
                </label>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleAddMessageExample}
                  className="text-xs flex items-center"
                >
                  <Plus size={14} className="mr-1" /> Add Example
                </Button>
              </div>
              
              {formState.messageExamples.map((example, index) => (
                <div key={index} className="mb-6 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-sm">Message Example {index + 1}</span>
                    <button 
                      className="text-gray-500 hover:text-red-500"
                      onClick={() => handleRemoveItem('messageExamples', index)}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-sm mb-1">User:</label>
                    <Textarea
                      value={example.user}
                      onChange={(e) => handleMessageExampleChange(index, 'user', e.target.value)}
                      placeholder="User message..."
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">Agent:</label>
                    <Textarea
                      value={example.agent}
                      onChange={(e) => handleMessageExampleChange(index, 'agent', e.target.value)}
                      placeholder="Agent response..."
                      className="w-full"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="post-example" className="block text-sm font-medium">
                  Post Example
                </label>
              </div>
              <div className="flex gap-2 mb-2">
                <Textarea
                  id="post-example"
                  placeholder="Add post example..."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      handleAddItem('postExamples', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  const textarea = document.getElementById('post-example') as HTMLTextAreaElement;
                  handleAddItem('postExamples', textarea.value);
                  textarea.value = '';
                }}
                className="w-full"
              >
                Add
              </Button>
              
              {formState.postExamples.map((example, index) => (
                <div key={index} className="mt-2 p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                  <div className="flex justify-between">
                    <p className="text-sm">{example}</p>
                    <button 
                      className="ml-2 text-gray-500 hover:text-red-500"
                      onClick={() => handleRemoveItem('postExamples', index)}
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-4">
            <Button variant="outline" onClick={() => setGeneratedCharacter(null)}>
              Cancel
            </Button>
            <Button 
              onClick={() => handleCreateAgent()}
              disabled={isCreating}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isCreating ? 'Creating...' : 'Create AI Agent'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateAgentPage; 