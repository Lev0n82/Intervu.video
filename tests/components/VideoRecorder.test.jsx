
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../tests/utils';
import VideoRecorder from '@/components/VideoRecorder';

// Mock MediaDevices and MediaRecorder
const mockGetUserMedia = vi.fn();
const mockMediaRecorder = {
  start: vi.fn(),
  stop: vi.fn(),
  ondataavailable: null,
  onstop: null,
  state: 'inactive',
};

// Mock global navigator using globalThis
Object.defineProperty(globalThis.navigator, 'mediaDevices', {
  value: {
    getUserMedia: mockGetUserMedia,
    enumerateDevices: vi.fn().mockResolvedValue([]),
  },
  writable: true,
});

// Mock MediaRecorder constructor
globalThis.MediaRecorder = vi.fn(() => mockMediaRecorder);
globalThis.MediaRecorder.isTypeSupported = vi.fn(() => true);

// Mock URL.createObjectURL
globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
globalThis.URL.revokeObjectURL = vi.fn();

// Mock Supabase storage
const mockUpload = vi.fn();
const mockGetPublicUrl = vi.fn();

vi.mock('@/lib/customSupabaseClient', () => ({
  supabase: {
    storage: {
      from: () => ({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      }),
    },
  },
}));

describe('VideoRecorder Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUserMedia.mockResolvedValue({
      getTracks: () => [{ stop: vi.fn(), kind: 'video' }, { stop: vi.fn(), kind: 'audio' }],
      getVideoTracks: () => [{ getSettings: () => ({}) }],
      getAudioTracks: () => [{}],
    });
    mockUpload.mockResolvedValue({ data: { path: 'test/path' }, error: null });
    mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://example.com/video.mp4' } });
  });

  it('initializes camera when opened', async () => {
    render(<VideoRecorder open={true} onOpenChange={vi.fn()} onUploadComplete={vi.fn()} />);
    
    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalled();
    });
    
    expect(screen.getByText('Studio Recorder')).toBeInTheDocument();
  });

  it('starts and stops recording correctly', async () => {
    render(<VideoRecorder open={true} onOpenChange={vi.fn()} onUploadComplete={vi.fn()} />);
    
    // Wait for init
    await waitFor(() => expect(screen.getByLabelText(/record/i)).toBeEnabled());

    // Start Recording
    const recordBtn = screen.getByLabelText(/record/i);
    fireEvent.click(recordBtn);

    expect(mockMediaRecorder.start).toHaveBeenCalled();
    expect(screen.getByText(/recording/i)).toBeInTheDocument();

    // Stop Recording
    const stopBtn = screen.getByLabelText(/stop/i);
    fireEvent.click(stopBtn);

    // Simulate recorder stop event
    if (mockMediaRecorder.onstop) {
        mockMediaRecorder.onstop();
    }

    await waitFor(() => {
      expect(screen.getByText('Studio Editor')).toBeInTheDocument();
    });
  });

  it('uploads video successfully', async () => {
    const onUploadComplete = vi.fn();
    const onOpenChange = vi.fn();
    
    render(<VideoRecorder open={true} onOpenChange={onOpenChange} onUploadComplete={onUploadComplete} />);
    
    // Simulate flow to get to review state
    await waitFor(() => screen.getByLabelText(/record/i));
    fireEvent.click(screen.getByLabelText(/record/i));
    fireEvent.click(screen.getByLabelText(/stop/i));
    if (mockMediaRecorder.onstop) mockMediaRecorder.onstop();

    // Click Save
    const saveBtn = await screen.findByText(/save video/i);
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockUpload).toHaveBeenCalled();
      expect(onUploadComplete).toHaveBeenCalledWith(expect.objectContaining({
        url: 'https://example.com/video.mp4'
      }));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
