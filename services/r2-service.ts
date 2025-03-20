import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// R2 configuration
interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  bucketUrl: string;
}

// Initialize with environment variables or config
const R2_CONFIG: R2Config = {
  accountId: process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID || '',
  accessKeyId: process.env.NEXT_PUBLIC_CLOUDFLARE_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.NEXT_PUBLIC_CLOUDFLARE_SECRET_ACCESS_KEY || '',
  bucketName: process.env.NEXT_PUBLIC_CLOUDFLARE_BUCKET_NAME || '',
  bucketUrl: process.env.NEXT_PUBLIC_CLOUDFLARE_BUCKET_URL || '',
};

// Create S3 client for R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_CONFIG.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_CONFIG.accessKeyId,
    secretAccessKey: R2_CONFIG.secretAccessKey,
  },
  // Add these parameters to fix checksum validation issues with R2
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

/**
 * Upload a file to Cloudflare R2 using presigned URL to avoid CORS issues
 * @param file The file to upload
 * @param customPath Optional custom path/filename in the bucket
 * @returns The URL of the uploaded file
 */
export async function uploadFileToR2(file: File, customPath?: string): Promise<string> {
  try {
    // Generate a unique file path if not provided
    const filePath = customPath || `uploads/${Date.now()}-${file.name}`;
    // Create a command for the PutObject operation
    const command = new PutObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: filePath,
      ContentType: file.type,
    });
    
    // Generate a presigned URL for the upload
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    // Use fetch to upload the file using the presigned URL
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }
    
    // Return the public URL to the uploaded file using R2.dev bucket URL
    return `${R2_CONFIG.bucketUrl}/${filePath}`;
  } catch (error) {
    console.error('Error uploading file to R2:', error);
    throw new Error('Failed to upload file to Cloudflare R2');
  }
} 