# Upload Feature Documentation

## Overview

This document describes the chunked upload feature implementation for the Memorly client application. The feature supports uploading images and videos with automatic routing between regular and chunked uploads based on file size.

## Features

- **Smart Upload Routing**: Automatically uses regular upload for files ≤100MB and chunked upload for larger files
- **Progress Tracking**: Real-time progress updates with chunk-level granularity
- **Drag & Drop**: Intuitive drag-and-drop interface for file selection
- **Multi-file Support**: Upload multiple files simultaneously
- **Retry Logic**: Automatic retry with exponential backoff for failed chunks
- **File Validation**: Type and size validation before upload
- **Tabbed Interface**: Separate tabs for images and videos
- **Cancel & Retry**: Cancel ongoing uploads or retry failed ones

## Architecture

### Components

#### 1. `UploadModal` ([components/upload-modal.tsx](components/upload-modal.tsx))
Main modal component with tabbed interface for images and videos.

**Props:**
```typescript
interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: (results: UploadResult[]) => void;
  authToken: string;
}
```

**Features:**
- Tabs for images and videos
- Upload queue management
- Progress tracking
- Error handling and retry

#### 2. `FileUploadZone` ([components/file-upload-zone.tsx](components/file-upload-zone.tsx))
Drag-and-drop file upload zone component.

**Props:**
```typescript
interface FileUploadZoneProps {
  accept: string;
  multiple?: boolean;
  maxSize?: number;
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  type: "image" | "video";
}
```

**Features:**
- Drag and drop support
- Click to browse
- File validation
- Visual feedback

#### 3. `UploadProgress` ([components/upload-progress.tsx](components/upload-progress.tsx))
Progress indicator component for individual uploads.

**Props:**
```typescript
interface UploadProgressProps {
  fileName: string;
  fileSize: number;
  progress: UploadProgress | number;
  status: "uploading" | "completed" | "error";
  error?: string;
  onCancel?: () => void;
  onRetry?: () => void;
  onRemove?: () => void;
}
```

**Features:**
- Progress bar with percentage
- Chunk count display
- Status indicators
- Action buttons (cancel, retry, remove)

#### 4. `UploadButton` ([components/upload-button.tsx](components/upload-button.tsx))
Simple button component that opens the upload modal.

**Props:**
```typescript
interface UploadButtonProps {
  authToken: string;
  onUploadComplete?: (results: UploadResult[]) => void;
  variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost";
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
}
```

### Services

#### Upload Service ([service/upload.ts](service/upload.ts))

Main service file with all upload-related functions.

**Key Functions:**

##### `uploadFile(file, token, onProgress)`
Smart upload function that automatically routes to regular or chunked upload.

```typescript
const result = await uploadFile(file, authToken, (progress) => {
  console.log(progress);
});
```

##### `uploadRegular(file, token, onProgress)`
Regular upload for files ≤100MB.

##### `uploadChunked(file, token, onProgress, onChunkUploaded)`
Chunked upload for files >100MB.

```typescript
const result = await uploadChunked(
  file,
  authToken,
  (progress) => {
    console.log(`${progress.percentage}%`);
  },
  (chunkNumber, totalChunks) => {
    console.log(`Chunk ${chunkNumber}/${totalChunks} uploaded`);
  }
);
```

##### `validateFile(file, allowedTypes)`
Validates file type and size.

```typescript
validateFile(file, ["image/jpeg", "image/png"]);
```

##### `formatBytes(bytes)`
Formats bytes to human-readable format.

```typescript
formatBytes(1024 * 1024); // "1.00 MB"
```

##### `calculateChunks(fileSize)`
Calculates number of chunks needed.

```typescript
const chunks = calculateChunks(500 * 1024 * 1024); // 100 chunks for 500MB
```

##### `abortUpload(uploadId, token)`
Aborts an ongoing chunked upload.

```typescript
await abortUpload(uploadId, authToken);
```

##### `checkUploadStatus(uploadId, token)`
Checks the status of an upload.

```typescript
const status = await checkUploadStatus(uploadId, authToken);
console.log(`${status.uploadedChunks}/${status.totalChunks} chunks uploaded`);
```

## Usage

### Basic Usage

```tsx
import { UploadButton } from "@/components/upload-button";

function MyComponent() {
  const authToken = "your-auth-token";

  const handleUploadComplete = (results) => {
    console.log("Uploaded files:", results);
  };

  return (
    <UploadButton
      authToken={authToken}
      onUploadComplete={handleUploadComplete}
    />
  );
}
```

### Custom Modal Integration

```tsx
import { useState } from "react";
import { useDisclosure } from "@heroui/react";
import { UploadModal } from "@/components/upload-modal";

function MyComponent() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const authToken = "your-auth-token";

  const handleUploadComplete = (results) => {
    console.log("Uploaded files:", results);
  };

  return (
    <>
      <button onClick={onOpen}>Open Upload</button>

      <UploadModal
        isOpen={isOpen}
        onClose={onClose}
        onUploadComplete={handleUploadComplete}
        authToken={authToken}
      />
    </>
  );
}
```

### Direct Upload Service Usage

```tsx
import { uploadFile } from "@/service/upload";

async function handleUpload(file: File, token: string) {
  try {
    const result = await uploadFile(file, token, (progress) => {
      if (typeof progress === "number") {
        console.log(`Progress: ${progress}%`);
      } else {
        console.log(`Chunk ${progress.uploadedChunks}/${progress.totalChunks}`);
      }
    });

    console.log("Upload complete:", result.fileUrl);
  } catch (error) {
    console.error("Upload failed:", error);
  }
}
```

## API Endpoints

The upload service uses the following API endpoints:

### Regular Upload
- **POST** `{API_BASE_URL}/files/upload`
- For files ≤100MB

### Chunked Upload

#### Initiate
- **POST** `{API_BASE_URL}/files/chunk/initiate`
- Body: `{ originalName, mimeType, totalSize, totalChunks }`
- Returns: `{ uploadId, fileName, chunkSize }`

#### Upload Chunk
- **POST** `{API_BASE_URL}/files/chunk/upload`
- Body: FormData with `uploadId`, `partNumber`, `chunk`
- Returns: `{ partNumber, uploadedChunks, totalChunks }`

#### Complete
- **POST** `{API_BASE_URL}/files/chunk/complete`
- Body: `{ uploadId }`
- Returns: `{ id, fileUrl, fileSize, mimeType, originalName }`

#### Abort
- **POST** `{API_BASE_URL}/files/chunk/abort`
- Body: `{ uploadId }`

#### Status
- **GET** `{API_BASE_URL}/files/chunk/status/:uploadId`
- Returns: `{ uploadedChunks, totalChunks, status }`

## Configuration

### Environment Variables

Set the API base URL in your environment variables:

```env
NEXT_PUBLIC_API=http://localhost:4000/api
```

### Constants

You can modify these constants in [service/upload.ts](service/upload.ts):

```typescript
const MAX_REGULAR_UPLOAD = 100 * 1024 * 1024; // 100MB
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024; // 10GB
```

## Supported File Types

### Images
- JPEG (`.jpg`, `.jpeg`)
- PNG (`.png`)
- GIF (`.gif`)
- WebP (`.webp`)

### Videos
- MP4 (`.mp4`)
- WebM (`.webm`)
- QuickTime (`.mov`)

## Error Handling

The upload service handles various error scenarios:

- **Validation errors**: File type or size mismatch
- **Network errors**: Connection issues during upload
- **Server errors**: API errors (401, 400, 404, 500)
- **Upload failures**: Automatic retry with exponential backoff

Example error handling:

```tsx
try {
  await uploadFile(file, token);
} catch (error) {
  if (error.message.includes("401")) {
    // Handle authentication error
  } else if (error.message.includes("exceeds")) {
    // Handle file size error
  } else {
    // Handle generic error
  }
}
```

## Demo Page

A demo page is available at [pages/upload-demo.tsx](pages/upload-demo.tsx) that demonstrates the complete upload workflow.

To access the demo:
1. Navigate to `/upload-demo`
2. Click the "Upload" button
3. Select images or videos
4. Watch the upload progress
5. View uploaded files in the gallery

## Testing

### Test Scenarios

1. **Small Files (<100MB)**
   - Upload should use regular upload
   - Progress should update smoothly

2. **Large Files (>100MB)**
   - Upload should use chunked upload
   - Chunk count should be displayed

3. **Multiple Files**
   - All files should upload in parallel
   - Individual progress for each file

4. **Network Interruption**
   - Failed chunks should retry automatically
   - Error state should be shown after max retries

5. **File Validation**
   - Invalid file types should be rejected
   - Files exceeding size limit should be rejected

## Best Practices

1. **Authentication**: Always pass a valid auth token
2. **Error Handling**: Implement proper error handling in `onUploadComplete`
3. **Progress Feedback**: Use progress callbacks for user feedback
4. **File Validation**: Validate files before showing the upload UI
5. **Memory Management**: For very large files, consider streaming approaches

## Troubleshooting

### Upload Fails Immediately
- Check if `NEXT_PUBLIC_API` is set correctly
- Verify auth token is valid

### Progress Stuck at 99%
- Check if last chunk uploaded successfully
- Verify server can complete the upload

### "Session not found" Error
- Upload session expired (24h timeout)
- Restart upload from beginning

### Out of Memory
- Check chunk size is set to 5MB
- Verify browser has enough memory for large files

## Future Improvements

- [ ] Resume interrupted uploads
- [ ] Background upload (service worker)
- [ ] Upload queue management
- [ ] Batch upload optimization
- [ ] Image/video preview before upload
- [ ] Upload history
- [ ] Bandwidth throttling
- [ ] Compression options

## Support

For issues or questions:
- Check the [backend integration guide](FRONTEND_QUICK_REFERENCE_CARD.md)
- Contact the backend team with uploadId and error details
- Review browser console for detailed error messages
