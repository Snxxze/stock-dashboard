import { ApiError } from "./errors";

// API Client
// ทุก HTTP request ผ่านตัวนี้หมด → เปลี่ยน base URL ที่เดียว

// เปลี่ยน NEXT_PUBLIC_API_URL ใน .env ชี้ไป backend จริง

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // GET 
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }

    const res = await fetch(url.toString(), {
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(res);
  }

  // POST 
  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(res);
  }

  // PUT 
  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(res);
  }

  // DELETE
  async delete<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(res);
  }

  // Shared
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    // const token = localStorage.getItem("auth_token");
    // if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new ApiError(
        res.status,
        body.code || "UNKNOWN_ERROR",
        body.message || body.error || "Request failed",
      );
    }

    return res.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
