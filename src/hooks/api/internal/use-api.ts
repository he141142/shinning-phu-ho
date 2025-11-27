
// import { subjectService, semesterService, paperService } from '../api/services';


// Types
export interface FetchStates<T> {
  data: T | null | undefined;
  error: Error | null;
  loading: boolean;
  refetch: () => Promise<void>;
  cancel: () => void;
}



interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// API Error class
  export class ApiError extends Error {
    constructor(
      message: string,
      public status?: number,
      public code?: string,
      public details?: unknown,
      public isRetryable: boolean = false
    ) {
      super(message);
      this.name = 'ApiError';
    }

    static fromResponse(response: Response, message?: string): ApiError {
      const isRetryable = response.status >= 500 || response.status === 429;
      return new ApiError(
        message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        undefined,
        undefined,
        isRetryable
      );
    }
  }

type ContentType =
  | 'application/json'
  | 'multipart/form-data'
  | 'application/x-www-form-urlencoded'
  | 'text/plain'
  | 'application/xml'
  | 'application/pdf'
  | 'application/zip'
  | 'application/vnd.ms-excel'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

interface AuthHeaderOptions {
  contentType?: ContentType;
  includeContentType?: boolean;
  additionalHeaders?: Record<string, string>;
  tokenType?: 'Bearer' | 'Basic' | 'Digest';
  acceptType?: string;
  cacheControl?: 'no-cache' | 'no-store' | 'must-revalidate' | 'max-age=0';
}

const getAuthHeaders = (options: AuthHeaderOptions = {}) => {
  const {
    contentType = 'application/json',
    includeContentType = true,
    additionalHeaders = {},
    tokenType = 'Bearer',
    acceptType,
    cacheControl
  } = options;

  const token = localStorage.getItem("token");
  if (!token) throw new ApiError("No authentication token found", 401);

  const headers: Record<string, string> = {
    // Base authentication header
    Authorization: `${tokenType} ${token}`,

    // Optional content type
    ...(includeContentType && { 'Content-Type': contentType }),

    // Accept type for response
    ...(acceptType && { 'Accept': acceptType }),

    // Cache control
    ...(cacheControl && { 'Cache-Control': cacheControl }),

    // Additional headers
    ...additionalHeaders
  };

  return headers;
};

// Helper functions for common header configurations
export const headerConfigs = {
  json: () => getAuthHeaders({
    contentType: 'application/json',
    acceptType: 'application/json'
  }),

  formData: () => {
    // For FormData, we only send Authorization header
    // Let the browser handle the Content-Type with boundary
    const token = localStorage.getItem("token");
    if (!token) throw new ApiError("No authentication token found", 401);

    return {
      Authorization: `Bearer ${token}`
    };
  },

  fileUpload: (fileType: string) => {
    // For file uploads, we only send Authorization header
    // Let the browser handle the Content-Type with boundary
    const token = localStorage.getItem("token");
    if (!token) throw new ApiError("No authentication token found", 401);

    return {
      Authorization: `Bearer ${token}`,
      Accept: fileType
    };
  },

  download: (fileType: ContentType) => getAuthHeaders({
    contentType: fileType,
    acceptType: fileType,
    cacheControl: 'no-store'
  }),

  noCache: () => getAuthHeaders({
    cacheControl: 'no-cache',
    additionalHeaders: {
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  })
};

export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(
      errorText || 'API request failed',
      response.status
    );
  }

  const data = await response.json();
  return data;
}


export function useFetchStates<T>(fetchHookResult: {
  data: T | undefined;
  error: Error | null; // TanStack Query returns Error, not ApiError
  loading: boolean;
  refetch: any; // TanStack's refetch has complex return type
  cancel: () => void;
}): FetchStates<T> {
  const apiError = fetchHookResult.error
    ? new ApiError(
        fetchHookResult.error.message,
        undefined, // status
        undefined, // code
        fetchHookResult.error, // details
        false // isRetryable - you can customize this logic
      )
    : null;

  return {
    data: fetchHookResult.data || null,
    error: apiError,
    loading: fetchHookResult.loading,
    refetch: async () => {
      await fetchHookResult.refetch();
    },
    cancel: fetchHookResult.cancel,
  };
}


