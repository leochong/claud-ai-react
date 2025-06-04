'use client';

import { useState } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { Button } from '@aws-amplify/ui-react';

export const FileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Upload to the private folder of the authenticated user
      const result = await uploadData({
        key: `private/${file.name}`,
        data: file,
        options: {
          accessLevel: 'private',
          contentType: file.type
        }
      });
      
      console.log('Upload successful:', result);
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        id="file-upload"
        disabled={isUploading}
      />
      <label htmlFor="file-upload">
        <Button
          as="span"
          isLoading={isUploading}
          loadingText="Uploading..."
          variation="primary"
        >
          Upload File
        </Button>
      </label>
    </div>
  );
};

export default FileUpload;