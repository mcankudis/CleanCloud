// This HttpService provides a wrapper around the native fetch function,
// simplifying the api calls and further work with the response,
// whilst also typing the response as fast as possible

// Tagged Union identified by a boolean, since only two options will ever be possible
export type ApiResponse<T> = SuccessfulApiResponse<T> | FailedApiResponse;
interface SuccessfulApiResponse<T> {
    success: true;
    data: T;
    status: number;
}

// ? should failed response also include rawResponse?
interface FailedApiResponse {
    success: false;
    errorMessage: string;
    status: number;
}

// Tagged Union identified by request method
export type HttpRequestOptions = BodyRequestOptions | NoBodyRequestOptions;

interface HttpRequestOptionsBase {
    headers?: HeadersInit;
}

interface NoBodyRequestOptions extends HttpRequestOptionsBase {
    method: HttpMethods.GET;
}

interface BodyRequestOptions extends HttpRequestOptionsBase {
    method: HttpMethods.POST | HttpMethods.PUT | HttpMethods.PATCH | HttpMethods.DELETE;
    body?: object;
}

interface APIError {
    statusCode: number;
    message: string;
}

export enum HttpMethods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

const defaultHeaders = {
    'Content-Type': 'application/json',
};

const defaultOptions: HttpRequestOptions = {
    method: HttpMethods.GET,
    headers: defaultHeaders,
};

const isRequestWithBody = (arg: HttpRequestOptions): arg is BodyRequestOptions => {
    return [HttpMethods.POST, HttpMethods.PUT, HttpMethods.PATCH, HttpMethods.DELETE].includes(
        arg.method
    );
};

// when calling the api you should have separate types for the expected api response and the internal representation
// of the data, as it is a good practice when working with DTOs. Here, you should provide the expected response type
// and wrap this function in a mapper that will map the response to the internal type

class HttpService {
    public async fetch<T>(
        url: string,
        options: HttpRequestOptions = defaultOptions
    ): Promise<ApiResponse<T>> {
        if (!options.headers) {
            options.headers = defaultHeaders;
        }
        const requestOptions: {
            credentials: RequestCredentials;
            method: HttpMethods;
            headers: HeadersInit;
            body?: string;
        } = {
            credentials: 'same-origin',
            method: options.method,
            headers: options.headers,
        };
        if (isRequestWithBody(options)) {
            requestOptions.body = JSON.stringify(options.body);
        }
        try {
            const res = await fetch(url, requestOptions);
            if (!res.ok) {
                if (!res.headers.get('content-type')?.includes('application/json')) {
                    throw { message: res.statusText, status: res.status };
                } else {
                    const data: APIError = await res.json();
                    throw { message: data.message, status: res.status };
                }
            }
            const data: T = await this._parseResponse(res);
            return { success: true, data, status: res.status };
        } catch (err: any) {
            return {
                success: false,
                status: err.status || 0,
                errorMessage: err.message || 'Unknown error',
            };
        }
    }
    private async _parseResponse<T>(res: any): Promise<T> {
        // no need to parse successful response - it's always json
        return await res.json();
    }
}

// export as singleton
export const httpService = new HttpService();
