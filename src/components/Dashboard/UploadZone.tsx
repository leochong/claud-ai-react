"use client";
import React, { useState, useRef, useCallback } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { FiUpload, FiFile, FiCheck, FiX } from 'react-icons/fi';
import './UploadZone.css';

interface UploadZoneProps {
  onUploadComplete?: (files: string[]) => void;
  acceptedTypes?: string[];
  maxFileSize?: number; // in MB
  maxFiles?: number;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onUploadComplete,
  acceptedTypes = ['image/*', 'application/pdf', '.txt', '.doc', '.docx'],
  maxFileSize = 10,
  maxFiles = 5
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File "${file.name}" is too large. Maximum size is ${maxFileSize}MB.`;
    }
    
    const isValidType = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      if (type.includes('*')) {
        const baseType = type.split('/')[0];
        return file.type.startsWith(baseType);
      }
      return file.type === type;
    });
    
    if (!isValidType) {
      return `File "${file.name}" has an unsupported format.`;
    }
    
    return null;
  }, [acceptedTypes, maxFileSize]);

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    const fileKey = `${Date.now()}-${file.name}`;
    
    try {
      setUploadProgress(prev => ({ ...prev, [fileKey]: 0 }));
      
      await uploadData({
        key: `private/${fileKey}`,
        data: file,
        options: {
          accessLevel: 'private',
          contentType: file.type,
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (totalBytes) {
              const progress = Math.round((transferredBytes / totalBytes) * 100);
              setUploadProgress(prev => ({ ...prev, [fileKey]: progress }));
            }
          }
        }
      });
      
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileKey];
        return newProgress;
      });
      
      return fileKey;
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileKey];
        return newProgress;
      });
      return null;
    }
  }, []);

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    const newErrors: string[] = [];
    
    if (fileArray.length > maxFiles) {
      newErrors.push(`Too many files selected. Maximum is ${maxFiles} files.`);
      setErrors(newErrors);
      return;
    }
    
    // Validate files
    const validFiles: File[] = [];
    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push(file);
      }
    });
    
    setErrors(newErrors);
    
    if (validFiles.length === 0) return;
    
    // Upload valid files
    const uploadPromises = validFiles.map(uploadFile);
    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter((result): result is string => result !== null);
    
    if (successfulUploads.length > 0) {
      setUploadedFiles(prev => [...prev, ...successfulUploads]);
      onUploadComplete?.(successfulUploads);
    }
  }, [validateFile, uploadFile, maxFiles, onUploadComplete]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFiles]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const isUploading = Object.keys(uploadProgress).length > 0;

  return (
    <div className="upload-zone-container">
      <div
        className={`upload-zone glass ${isDragOver ? 'upload-zone--drag-over' : ''} ${isUploading ? 'upload-zone--uploading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="upload-zone__input"
          aria-label="File upload"
        />
        
        <div className="upload-zone__content">
          <div className="upload-zone__icon">
            <FiUpload />
          </div>
          
          <div className="upload-zone__text">
            <h3 className="upload-zone__title">
              {isUploading ? 'Uploading Files...' : 'Drop files here or click to upload'}
            </h3>
            <p className="upload-zone__description">
              Support for {acceptedTypes.join(', ')} up to {maxFileSize}MB each
            </p>
          </div>
          
          {Object.keys(uploadProgress).length > 0 && (
            <div className="upload-zone__progress">
              {Object.entries(uploadProgress).map(([fileKey, progress]) => (
                <div key={fileKey} className="progress-item">
                  <div className="progress-item__info">
                    <FiFile className="progress-item__icon" />
                    <span className="progress-item__name">
                      {fileKey.split('-').slice(1).join('-')}
                    </span>
                    <span className="progress-item__percent">{progress}%</span>
                  </div>
                  <div className="progress-item__bar">
                    <div 
                      className="progress-item__fill"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {errors.length > 0 && (
        <div className="upload-zone__errors">
          <div className="error-list">
            {errors.map((error, index) => (
              <div key={index} className="error-item">
                <FiX className="error-item__icon" />
                <span>{error}</span>
              </div>
            ))}
            <button onClick={clearErrors} className="error-clear">
              Clear errors
            </button>
          </div>
        </div>
      )}
      
      {uploadedFiles.length > 0 && (
        <div className="upload-zone__success">
          <div className="success-list">
            <div className="success-header">
              <FiCheck className="success-header__icon" />
              <span>Successfully uploaded {uploadedFiles.length} file(s)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};