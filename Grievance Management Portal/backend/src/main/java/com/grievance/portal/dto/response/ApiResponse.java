package com.grievance.portal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Generic API response wrapper.
 *
 * Every endpoint returns this shape — ensures the React frontend
 * receives consistent JSON regardless of the operation.
 *
 * Matches the Express response pattern:
 *   res.status(200).json({ success: true, message: "...", data: {...} })
 *   res.status(400).json({ success: false, message: "Error description" })
 *
 * React frontend checks: response.data.success and response.data.data
 *
 * @param <T> Type of the data payload
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T> {

    /**
     * true = operation succeeded, false = operation failed.
     * Used by React axios interceptors to detect errors.
     */
    private boolean success;

    /**
     * Human-readable message — shown in UI toast/alert.
     */
    private String message;

    /**
     * The actual response payload.
     * null for error responses (Jackson excludes null fields).
     */
    private T data;

    // ─── Static Factory Methods ───────────────────────────────────────

    /**
     * Success response with data payload.
     */
    public static <T> ApiResponse<T> ok(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    /**
     * Success response without data (e.g., delete operations).
     */
    public static <T> ApiResponse<T> ok(String message) {
        return new ApiResponse<>(true, message, null);
    }

    /**
     * Error response — data will be null (omitted by Jackson).
     */
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }
}
