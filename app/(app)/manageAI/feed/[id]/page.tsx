'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { Box, Button, Card, Flex, Text, Badge, Dialog } from '@radix-ui/themes';
import { Upload, Info, ChevronLeft, ChevronRight, X, RefreshCw } from 'lucide-react';
// import { usePrivy } from '@privy-io/react-auth';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { uploadFileToR2 } from '@/services/r2-service';

interface FeedHistory {
  id: string;
  type: string;
  content: string;
  originalContent: string;
  status: string;
  createdAt: number;
  processStarted: number;
  processCompleted: number;
  processing: boolean;
  completed: boolean;
  failed: boolean;
  url?: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function FeedDataPage({ params }: { params: { id: string } }) {
  const [documentData, setDocumentData] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [history, setHistory] = useState<FeedHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingToR2, setUploadingToR2] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const searchParams = useSearchParams();
  const agentName = searchParams.get('name') || '';
  // const { getAccessToken } = usePrivy();

  const fetchHistory = async (page = 1) => {
    setHistoryLoading(true);
    try {
      // const accessToken = await getAccessToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/agents/feed/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          agentId: params.id,
          limit: 10,
          ...(page > 1 ? { page } : {}),
        }),
      });
      const data = await response.json();
      if (data.success) {
        setHistory(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    // fetchHistory(currentPage);
  }, [params.id, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const getDocumentType = (document: string, file: File | null): 'search' | 'link' | 'image' | 'video' | 'file' | 'plaintext' | 'pdf' | 'audio' => {
    // If there's a file, determine its type based on extension
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      
      // Image types
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension)) {
        return 'image';
      }
      
      // Video types
      if (['mp4', 'webm', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(extension)) {
        return 'video';
      }
      
      // Audio types
      if (['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'].includes(extension)) {
        return 'audio';
      }
      
      // PDF
      if (extension === 'pdf') {
        return 'pdf';
      }
      
      // Plain text
      if (['txt', 'md', 'rtf', 'csv', 'json', 'xml', 'html', 'css', 'js'].includes(extension)) {
        return 'plaintext';
      }
      
      // Default file type for other extensions
      return 'file';
    }
    
    // If there's a document string, check if it's a URL or keywords
    if (document) {
      // Simple URL validation
      const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
      if (urlPattern.test(document)) {
        return 'link';
      }
      
      // Default to search/keywords
      return 'search';
    }
    
    // Default case
    return 'search';
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // const accessToken = await getAccessToken();
      
      // Prioritize document data over file
      if (documentData) {
        const documentType = getDocumentType(documentData, null);
        const formData = new FormData();
        formData.append('document', documentData);
        formData.append('agentId', params.id);
        formData.append('type', documentType);

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/agents/feed`, {
          method: 'POST',
          headers: {
            // Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        });
        
        if (response.ok) {
          setDocumentData('');
          // fetchHistory(currentPage);
          toast.success('Document submitted successfully');
        } else {
          toast.error('Failed to submit document');
        }
      } 
      // Handle file upload if no document data
      else if (selectedFile) {
        try {
          setUploadingToR2(true);
          // Upload file to R2 and get URL
          // Create a sanitized filename
          const sanitizedFileName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const fileUrl = await uploadFileToR2(selectedFile, `ai-feeds/${Date.now()}-${sanitizedFileName}`);
          setUploadingToR2(false);
          
          const documentType = getDocumentType('', selectedFile);
          
          // Submit file URL to backend using FormData
          const formData = new FormData();
          formData.append('document', fileUrl);
          formData.append('agentId', params.id);
          formData.append('type', documentType);
          formData.append('originalFilename', selectedFile.name);

          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/agents/feed`, {
            method: 'POST',
            headers: {
              // Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          });
          
          if (response.ok) {
            setSelectedFile(null);
            // fetchHistory(currentPage);
            toast.success('File uploaded successfully');
          } else {
            toast.error('Failed to process uploaded file');
          }
        } catch (error) {
          console.error('Error uploading to R2:', error);
          toast.error('Failed to upload file to storage');
        } finally {
          setUploadingToR2(false);
        }
      } else {
        toast.error('Please provide either a document or a file');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      toast.error('Failed to submit data');
    }
    setLoading(false);
  };

  return (
    <Box className="container mx-auto py-8">
      <Flex direction="column" gap="4" mb="6">
        <Text size="8" weight="bold">{agentName}</Text>
        <Text size="3" color="gray">Feed Data Management</Text>
      </Flex>
      <Card className="mb-8">
        <Flex direction="column" gap="4">
          <Text size="5" weight="bold">Feed Data</Text>
          <Flex gap="4" align="center">
            <input
                type="text"
                placeholder="Enter URL or keyword"
                value={documentData}
                onChange={(e) => setDocumentData(e.target.value)}
                className="input block w-full mt-1 focus:outline-none focus:ring-brand-600 focus:border-brand-600 focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg"
                disabled={loading || uploadingToR2}
            />
            <Text size="2" color="gray">Or</Text>
            <Button
              onClick={() => document.getElementById('file-upload')?.click()}
              variant="soft"
              disabled={loading || uploadingToR2}
            >
              <Upload className="mr-2" />
              Attach File
            </Button>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedFile(file);
                  setDocumentData(''); // Clear text input when file is selected
                }
              }}
              disabled={loading || uploadingToR2}
            />
            <Button onClick={handleSubmit} disabled={loading || uploadingToR2}>
              {uploadingToR2 ? 'Uploading to Storage...' : loading ? 'Submitting...' : 'Submit'}
            </Button>
          </Flex>
          {selectedFile && (
            <Flex 
              align="center" 
              gap="2" 
              className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg"
            >
              <Text size="2" weight="medium">
                Selected file: {selectedFile.name}
              </Text>
              <Button 
                variant="soft" 
                color="red" 
                size="1"
                onClick={() => setSelectedFile(null)}
                disabled={loading || uploadingToR2}
              >
                <X size={14} />
                Remove
              </Button>
            </Flex>
          )}
        </Flex>
      </Card>

      <Box>
        <Flex justify="between" align="center" className="mb-4">
          <Text size="4" weight="bold">History</Text>
          <Button 
            variant="soft" 
            onClick={() => fetchHistory(currentPage)}
            disabled={historyLoading}
          >
            <RefreshCw size={16} className={historyLoading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </Flex>
        <Box className="relative">
          <Flex direction="column" gap="3">
            {history.map((item) => (
              <Card key={item.id}>
                <Flex justify="between" align="center">
                  <Flex direction="column" gap="2" style={{ flex: 1 }}>
                    <Flex gap="2" align="center">
                      <Text weight="medium">ID: {item.id.slice(0, 8)}...</Text>
                      <Badge>{item.type}</Badge>
                    </Flex>
                    <Flex gap="4">
                      <Text size="1" color="gray">Created: {new Date(item.createdAt).toLocaleString()}</Text>
                      {item.processCompleted && (
                        <Text size="1" color="gray">
                          Completed: {new Date(item.processCompleted).toLocaleString()}
                        </Text>
                      )}
                    </Flex>
                    <Badge color={item.completed ? 'green' : item.failed ? 'red' : 'yellow'}>
                      {item.completed ? 'Completed' : item.failed ? 'Failed' : 'Processing'}
                    </Badge>
                  </Flex>
                  <Dialog.Root>
                    <Dialog.Trigger>
                      <Button variant="soft" size="1">
                        <Info size={16} />
                        Details
                      </Button>
                    </Dialog.Trigger>
                    <Dialog.Content>
                      <Dialog.Title>Feed Details</Dialog.Title>
                      <Flex direction="column" gap="4">
                        {item.url && (
                          <Flex direction="column" gap="1">
                            <Text weight="bold">URL/Keyword</Text>
                            <Text>{item.url}</Text>
                          </Flex>
                        )}
                        <Flex direction="column" gap="1">
                          <Text weight="bold">Content</Text>
                          <Text>{item.content}</Text>
                        </Flex>
                        <Flex direction="column" gap="1">
                          <Text weight="bold">Original Content</Text>
                          <Text>{item.originalContent}</Text>
                        </Flex>
                      </Flex>
                    </Dialog.Content>
                  </Dialog.Root>
                </Flex>
              </Card>
            ))}
          </Flex>
          {historyLoading && (
            <Box className="absolute inset-0 bg-black/10 dark:bg-white/10 backdrop-blur-[2px] flex items-center justify-center">
              <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <RefreshCw size={28} className="animate-spin text-brand-600" />
              </Box>
            </Box>
          )}
        </Box>
        {pagination && (
          <Flex justify="between" align="center" mt="4">
            <Text size="2">
              Page {pagination.page} of {pagination.totalPages}
            </Text>
            <Flex gap="2">
              <Button 
                variant="soft" 
                disabled={!pagination.hasPrev || historyLoading}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                <ChevronLeft size={16} />
                Previous
              </Button>
              <Button 
                variant="soft" 
                disabled={!pagination.hasNext || historyLoading}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next
                <ChevronRight size={16} />
              </Button>
            </Flex>
          </Flex>
        )}
      </Box>
    </Box>
  );
} 