// service/upload.ts
import axios, { AxiosProgressEvent } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API;
const MAX_REGULAR_UPLOAD = 100 * 1024 * 1024; // 100MB
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024; // 10GB

export interface UploadProgress {
  uploadedChunks: number;
  totalChunks: number;
  percentage: number;
}

export interface UploadResult {
  id: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  originalName: string;
  location?: string; // Optional location in "City, State" format
}

export interface ChunkedUploadState {
  uploadId: string;
  fileName: string;
  chunkSize: number;
  totalChunks: number;
}

/**
 * Validates file type and size
 */
export function validateFile(file: File, allowedTypes: string[]): void {
  // Check type
  const isValidType = allowedTypes.some((type) => {
    if (type.endsWith("/*")) {
      return file.type.startsWith(type.replace("/*", ""));
    }

    return file.type === type;
  });

  if (!isValidType) {
    throw new Error(
      `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
    );
  }

  // Check size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds 10GB limit`);
  }

  if (file.size === 0) {
    throw new Error("File is empty");
  }
}

/**
 * Formats bytes to human-readable format
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  const kb = bytes / 1024;

  if (kb < 1024) return kb.toFixed(2) + " KB";
  const mb = kb / 1024;

  if (mb < 1024) return mb.toFixed(2) + " MB";
  const gb = mb / 1024;

  return gb.toFixed(2) + " GB";
}

/**
 * Calculates number of chunks needed
 */
export function calculateChunks(fileSize: number): number {
  return Math.ceil(fileSize / CHUNK_SIZE);
}

/**
 * Regular upload for files <= 100MB
 */
export async function uploadRegular(
  file: File,
  token: string,
  onProgress?: (percentage: number) => void,
  location?: string,
): Promise<UploadResult> {
  const formData = new FormData();

  formData.append("file", file);

  // eslint-disable-next-line no-console
  console.log("Location received in uploadRegular:", location);

  if (location) {
    formData.append("location", location);
    // eslint-disable-next-line no-console
    console.log("📍 Uploading file with location:", location);
  } else {
    // eslint-disable-next-line no-console
    console.warn("⚠️ No location provided for upload");
  }

  try {
    const response = await axios.post<{ data: UploadResult }>(
      `${API_BASE_URL}/files/upload`,
      formData,
      {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total && onProgress) {
            const percentage =
              (progressEvent.loaded / progressEvent.total) * 100;

            onProgress(percentage);
          }
        },
      },
    );

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || error.message || "Upload failed";

      throw new Error(message);
    }

    throw new Error("Network error occurred");
  }
}

/**
 * Initiates chunked upload session
 */
async function initiateChunkedUpload(
  file: File,
  token: string,
  location?: string,
): Promise<ChunkedUploadState> {
  const totalChunks = calculateChunks(file.size);

  if (location) {
    // eslint-disable-next-line no-console
    console.log("📍 Initiating chunked upload with location:", location);
  } else {
    // eslint-disable-next-line no-console
    console.warn("⚠️ No location provided for chunked upload");
  }

  try {
    const response = await axios.post<{
      data: { uploadId: string; fileName: string; chunkSize: number };
    }>(`${API_BASE_URL}/files/chunk/initiate`, {
      originalName: file.name,
      mimeType: file.type,
      totalSize: file.size,
      totalChunks,
      location,
    });

    return {
      uploadId: response.data.data.uploadId,
      fileName: response.data.data.fileName,
      chunkSize: response.data.data.chunkSize,
      totalChunks,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "Failed to initiate upload";

      throw new Error(message);
    }

    throw new Error("Network error occurred");
  }
}

/**
 * Uploads a single chunk with retry logic
 */
async function uploadChunkWithRetry(
  chunk: Blob,
  uploadId: string,
  partNumber: number,
  _token: string,
  maxRetries = 3,
): Promise<{
  partNumber: number;
  uploadedChunks: number;
  totalChunks: number;
}> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const formData = new FormData();

      formData.append("uploadId", uploadId);
      formData.append("partNumber", String(partNumber));
      formData.append("chunk", chunk);

      const response = await axios.post<{
        data: {
          partNumber: number;
          uploadedChunks: number;
          totalChunks: number;
        };
      }>(`${API_BASE_URL}/files/chunk/upload`, formData);

      return response.data.data;
    } catch (error) {
      if (attempt === maxRetries) {
        const message =
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : "Chunk upload failed";

        throw new Error(
          `Failed to upload chunk ${partNumber} after ${maxRetries} attempts: ${message}`,
        );
      }
      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)),
      );
    }
  }

  throw new Error("Upload failed");
}

/**
 * Completes chunked upload
 */
async function completeChunkedUpload(
  uploadId: string,
  token: string,
): Promise<UploadResult> {
  try {
    const response = await axios.post<{ data: UploadResult }>(
      `${API_BASE_URL}/files/chunk/complete`,
      { uploadId },
    );

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "Failed to complete upload";

      throw new Error(message);
    }

    throw new Error("Network error occurred");
  }
}

/**
 * Chunked upload for files > 100MB
 */
export async function uploadChunked(
  file: File,
  token: string,
  onProgress?: (progress: UploadProgress) => void,
  onChunkUploaded?: (chunkNumber: number, totalChunks: number) => void,
  location?: string,
): Promise<UploadResult> {
  // Step 1: Initiate
  const uploadState = await initiateChunkedUpload(file, token, location);
  const { uploadId, totalChunks } = uploadState;

  // Step 2: Upload chunks
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    const result = await uploadChunkWithRetry(chunk, uploadId, i + 1, token);

    const progress: UploadProgress = {
      uploadedChunks: result.uploadedChunks,
      totalChunks: result.totalChunks,
      percentage: (result.uploadedChunks / result.totalChunks) * 100,
    };

    onProgress?.(progress);
    onChunkUploaded?.(i + 1, totalChunks);
  }

  // Step 3: Complete
  const uploadResult = await completeChunkedUpload(uploadId, token);

  return uploadResult;
}

/**
 * Smart upload - automatically chooses regular or chunked based on file size
 */
export async function uploadFile(
  file: File,
  token: string,
  onProgress?: (progress: UploadProgress | number) => void,
  location?: string,
): Promise<UploadResult> {
  if (file.size <= MAX_REGULAR_UPLOAD) {
    // Regular upload - convert percentage to UploadProgress format
    return uploadRegular(
      file,
      token,
      (percentage) => {
        onProgress?.(percentage);
      },
      location,
    );
  } else {
    // Chunked upload
    return uploadChunked(
      file,
      token,
      (progress) => {
        onProgress?.(progress);
      },
      undefined,
      location,
    );
  }
}

/**
 * Aborts chunked upload
 */
export async function abortUpload(
  uploadId: string,
  _token: string,
): Promise<void> {
  try {
    await axios.post(`${API_BASE_URL}/files/chunk/abort`, { uploadId });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Failed to abort upload";

      throw new Error(message);
    }

    throw new Error("Network error occurred");
  }
}

/**
 * Checks upload status
 */
export async function checkUploadStatus(
  uploadId: string,
  _token: string,
): Promise<{ uploadedChunks: number; totalChunks: number; status: string }> {
  try {
    const response = await axios.get<{
      data: { uploadedChunks: number; totalChunks: number; status: string };
    }>(`${API_BASE_URL}/files/chunk/status/${uploadId}`);

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "Failed to check upload status";

      throw new Error(message);
    }

    throw new Error("Network error occurred");
  }
}
