import { CALENDAR_HOST, HOST } from "@/static/env";
import { InterceptorManager } from "./interceptor";
import { apiLogger } from "./logger";
import { ApiError, RequestInterceptor, RequestOptions, ResponseInterceptor } from "./type";

export class ApiClient {
  private baseUrl: string;
  private interceptors: InterceptorManager;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.interceptors = new InterceptorManager();
    this.setupDefaultInterceptors();
  }

  private setupDefaultInterceptors() {
    this.interceptors.addRequestInterceptor({
      onRequest: (config) => {
        apiLogger.debug("Request interceptor processing", config);
        return config;
      },
    });

    this.interceptors.addResponseInercteptor({
      onResponse: async (response, data) => {
        apiLogger.debug("Response interceptor processing", {
          status: response.status,
        });
        return data;
      },
    });
  }

  addRequestInterceptor(interceptor: RequestInterceptor) {
    return this.interceptors.addRequestInterceptor(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    return this.interceptors.addResponseInercteptor(interceptor);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage: string;
      let errorDetails: unknown;

      try {
        const errorData = await response.json();
        errorMessage =
          errorData.message || errorData.error || "API request failed";
        errorDetails = errorData;
      } catch {
        errorMessage =
          (await response.text()) ||
          `HTTP ${response.status}: ${response.statusText}`;
      }

      const error = ApiError.fromResponse(response, errorMessage);
      error.details = errorDetails;
      throw error;
    }

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      try {
        return await response.json();
      } catch (error) {
        throw new ApiError(
          `Failed to parse JSON response: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          500,
          "JSON_PARSE_ERROR"
        );
      }
    }

    if (contentType?.includes("text/")) {
      return (await response.text()) as unknown as T;
    }

    return (await response.blob()) as unknown as T;
  }

  private createAbortController(timeout?: number): AbortController {
    const controller = new AbortController();
    const timeoutMs = timeout || 30000;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    // Clear timeout if request completes normally
    const originalSignal = controller.signal;
    controller.signal.addEventListener("abort", () => {
      clearTimeout(timeoutId);
    });

    return controller;
  }

  private getAuthHeaders(
    token: string | null,
    options: RequestOptions = {}
  ): Record<string, string> {
    const {
      contentType = "application/json",
      includeContentType = true,
      additionalHeaders = {},
      tokenType = "Bearer",
      acceptType,
      cacheControl,
    } = options;

    if (!token) {
      throw new ApiError(
        "Authentication token not found",
        401,
        "MISSING_TOKEN"
      );
    }

    const headers: Record<string, string> = {
      Authorization: `${tokenType} ${token}`,
      ...additionalHeaders,
    };

    if (includeContentType && contentType) {
      headers["Content-Type"] = contentType;
    }

    if (acceptType) {
      headers["Accept"] = acceptType;
    }

    if (cacheControl) {
      headers["Cache-Control"] = cacheControl;
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    token: string | null,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      method = "GET",
      body,
      timeout,
      skipToken,
      ...headerOptions
    } = options;
    const controller = this.createAbortController(timeout);

    try {
      const headers =
        method === "GET"
          ? token
            ? { Authorization: `Bearer ${token}` }
            : {}
          : skipToken
          ? {}
          : this.getAuthHeaders(token, headerOptions);

      console.log("method", method);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers,
        body,
        signal: controller.signal,
        credentials: "include",
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new ApiError("Request timeout", 408, "TIMEOUT");
      }

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        `Network error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        0,
        "NETWORK_ERROR"
      );
    }
  }

  async get<T>(endpoint: string, token: string | null): Promise<T> {
    return this.request<T>(endpoint, token, { method: "GET" });
  }

  async post<T>(
    endpoint: string,
    token: string | null,
    data?: unknown
  ): Promise<T> {
    return this.request<T>(endpoint, token, {
      method: "POST",
      body: JSON.stringify(data),
      contentType: "application/json",
    });
  }

  async postFormData<T>(
    endpoint: string,
    token: string | null,
    formData: FormData
  ): Promise<T> {
    return this.request<T>(endpoint, token, {
      method: "POST",
      body: formData,
      includeContentType: false, // Let browser set Content-Type with boundary
    });
  }

  async put<T>(
    endpoint: string,
    token: string | null,
    data?: unknown
  ): Promise<T> {
    return this.request<T>(endpoint, token, {
      method: "PUT",
      body: JSON.stringify(data),
      contentType: "application/json",
    });
  }

  async delete<T>(endpoint: string, token: string | null): Promise<T> {
    return this.request<T>(endpoint, token, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient(CALENDAR_HOST);
