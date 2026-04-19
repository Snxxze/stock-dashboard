// API Error
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message?: string,
  ) {
    super(message || code);
    this.name = "ApiError";
  }

  get isUnauthorized() { return this.status === 401; }
  get isForbidden()    { return this.status === 403; }
  get isNotFound()     { return this.status === 404; }
  get isRateLimit()    { return this.status === 429; }
}
