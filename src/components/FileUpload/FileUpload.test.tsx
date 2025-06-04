import { render, screen, fireEvent } from '@testing-library/react';
import { FileUpload } from './FileUpload';
import { uploadData } from 'aws-amplify/storage';

// Mock the storage module
jest.mock('aws-amplify/storage', () => ({
  uploadData: jest.fn()
}));

describe('FileUpload', () => {
  beforeEach(() => {
    // Clear mock before each test
    jest.clearAllMocks();
  });

  it('renders upload button', () => {
    render(<FileUpload />);
    expect(screen.getByText('Upload File')).toBeInTheDocument();
  });

  it('handles file upload', async () => {
    const mockUploadResult = { key: 'test-file.txt' };
    (uploadData as jest.Mock).mockResolvedValueOnce(mockUploadResult);

    render(<FileUpload />);
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('Upload File');

    fireEvent.change(input, { target: { files: [file] } });

    expect(uploadData).toHaveBeenCalledWith({
      key: 'private/test.txt',
      data: file,
      options: {
        accessLevel: 'private',
        contentType: 'text/plain'
      }
    });
  });

  it('shows loading state during upload', async () => {
    (uploadData as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<FileUpload />);
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('Upload File');

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText('Uploading...')).toBeInTheDocument();
  });
});