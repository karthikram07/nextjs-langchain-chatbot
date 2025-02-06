'use client';
import { useState } from 'react';
import DEFAULT_RETRIEVAL_TEXT from '@/data/DefaultRetrievalText';
import { CircleLoader } from 'react-spinners';

export function UploadDocumentsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [document, setDocument] = useState(DEFAULT_RETRIEVAL_TEXT);

  // Function to get a presigned URL and upload the file to S3
  const uploadToS3 = async (file: File): Promise<string | null> => {
    try {
      // Request a presigned URL from your API route
      const res = await fetch('/api/s3-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename: file.name, contentType: file.type })
      });
      console.log('res', res);
      const { url, key } = await res.json();
      if (!url || !key) {
        throw new Error('Could not get presigned URL');
      }

      // Upload the file to S3 using the presigned URL
      const uploadResponse = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type
        },
        body: file
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload to S3 failed');
      }
      // Construct the public URL of the file (assuming your bucket is public or the ingestion API can access it)
      const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;
      return `https://${bucketName}.s3.amazonaws.com/${key}`;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  // Call your ingestion endpoint with the S3 URL
  const ingest = async (fileUrl: string) => {
    setIsLoading(true);
    const response = await fetch('/api/retrieval/ingest', {
      method: 'POST',
      body: JSON.stringify({ url: fileUrl })
    });
    if (response.status === 200) {
      setDocument('Uploaded!');
    } else {
      const json = await response.json();
      setDocument(json.error || 'Ingestion failed');
    }
    setIsLoading(false);
  };

  // Handle the file input change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsLoading(true);
      const file = e.target.files[0];
      const fileUrl = await uploadToS3(file);
      if (fileUrl) {
        await ingest(fileUrl);
      } else {
        setDocument('Upload failed.');
      }
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-12">
        <div className="flex space-x-2">
          <CircleLoader size={20} />
          Ingesting data. Please wait!
        </div>
      </div>
    );

  if (!isLoading && document === 'Uploaded!')
    return (
      <div className="flex items-center justify-center h-12">
        <div className="flex space-x-2">Data ingestion successful. You can now query the data.</div>
      </div>
    );

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
    </div>
  );
}
