import { describe, expect, it } from "vitest";
import { ApiError } from "../error.js";

describe("ApiError", () => {
  it("sets statusCode, code, and message from the factory used", () => {
    const err = ApiError.notFound("Widget not found");

    expect(err.statusCode).toBe(404);
    expect(err.code).toBe("NOT_FOUND");
    expect(err.message).toBe("Widget not found");
  });

  it("falls back to sensible default messages", () => {
    expect(ApiError.unauthorized().message).toBe("Authentication required");
    expect(ApiError.forbidden().message).toBe("You do not have access to this resource");
    expect(ApiError.tooManyRequests().message).toBe("Too many requests");
  });

  it("toJSON only includes details when present", () => {
    const withDetails = ApiError.badRequest("Invalid input", { field: "email" });
    const withoutDetails = ApiError.badRequest("Invalid input");

    expect(withDetails.toJSON()).toEqual({
      error: { code: "BAD_REQUEST", message: "Invalid input", details: { field: "email" } },
    });
    expect(withoutDetails.toJSON()).toEqual({
      error: { code: "BAD_REQUEST", message: "Invalid input" },
    });
  });

  it("is an instanceof Error so it works with normal error handling", () => {
    const err = ApiError.conflict("Duplicate");
    expect(err instanceof Error).toBe(true);
    expect(err instanceof ApiError).toBe(true);
  });
});
