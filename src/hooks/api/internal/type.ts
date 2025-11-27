export interface FetchStates<T> {
  data: T | null | undefined;
  error: ApiError | null;
  loading: boolean;
  refetch: () => Promise<void>;
  cancel: () => void;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: unknown,
    public isRetryable: boolean = false
  ) {
    super(message);
    this.name = "ApiError";
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

export type ContentType =
  | "application/json"
  | "multipart/form-data"
  | "application/x-www-form-urlencoded"
  | "text/plain"
  | "application/xml"
  | "application/pdf"
  | "application/zip"
  | "application/vnd.ms-excel"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: BodyInit;
  timeout?: number;
  retryAttempts?: number;
  skipAuth?: boolean;
  skipRetry?: boolean;
  metadata?: Record<string, unknown>;
}

export interface RequestInterceptor {
  onRequest?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
  onRequestError?: (error: Error) => Error | Promise<Error>;
}

export interface ResponseInterceptor {
  onResponse?: <T>(response: Response, data: T) => T | Promise<T>;
  onResponseError?: (error: ApiError) => ApiError | Promise<ApiError>;
}
interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  contentType?: ContentType;
  includeContentType?: boolean;
  additionalHeaders?: Record<string, string>;
  tokenType?: "Bearer" | "Basic" | "Digest";
  acceptType?: string;
  cacheControl?: "no-cache" | "no-store" | "must-revalidate" | "max-age=0";
  body?: BodyInit;
  timeout?: number;
  skipToken?: boolean;
}

export type { RequestOptions };


export interface SuccessResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  status_code? : number;
}



export interface PaginationResponse<T> {
  data: T[];
  total_page: number;
};