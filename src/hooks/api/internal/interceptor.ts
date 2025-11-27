import { apiLogger } from "./logger";
import { ApiError, RequestConfig, RequestInterceptor, ResponseInterceptor } from "./type";

export class InterceptorManager {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  addRequestInterceptor(interceptor: RequestInterceptor): () => void {
    this.requestInterceptors.push(interceptor);
    return () => {
      const index = this.requestInterceptors.indexOf(interceptor);
      if (index > -1) {
        this.requestInterceptors.splice(index, 1);
      }
    };
  }

  addResponseInercteptor(interceptor: ResponseInterceptor): () => void {
    this.responseInterceptors.push(interceptor);
    return () => {
      const index = this.responseInterceptors.indexOf(interceptor);
      if (index > -1) {
        this.responseInterceptors.splice(index, 1);
      }
    };
  }

  async processRequest(config: RequestConfig): Promise<RequestConfig> {
    let processedConfig = { ...config };

    for (const interceptor of this.requestInterceptors) {
      try {
        if (interceptor.onRequest) {
          processedConfig = await interceptor.onRequest(processedConfig);
        }
      } catch (error) {
        if (interceptor.onRequestError) {
          throw await interceptor.onRequestError(error as Error);
        }
        throw error;
      }
    }

    return processedConfig;
  }

  async processResponse<T>(response: Response, data: T): Promise<T> {
    let processedData = data;

    for (const interceptor of this.responseInterceptors) {
      try {
        if (interceptor.onResponse) {
          processedData = await interceptor.onResponse(response, processedData);
        }
      } catch (error) {
        if (interceptor.onResponseError) {
          throw await interceptor.onResponseError(error as ApiError);
        }
        throw error;
      }
    }

    return processedData;
  }

  async processError(error: ApiError): Promise<ApiError> {
    let processedError = error;

    for (const interceptor of this.responseInterceptors) {
      try {
        if (interceptor.onResponseError) {
          processedError = await interceptor.onResponseError(processedError);
        }
      } catch (err) {
        apiLogger.debug('Error in response interceptor', err);
      }
    }

    return processedError;
  }
}