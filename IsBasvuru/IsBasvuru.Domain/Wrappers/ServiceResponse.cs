using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace IsBasvuru.Domain.Wrappers
{
    public class ServiceResponse<T>
    {
        public T? Data { get; set; }

        public bool Success { get; set; }

        public string? Message { get; set; }

        public List<string>? Errors { get; set; }

        public int StatusCode { get; set; }

        // --- FACTORY METHODS ---

        public static ServiceResponse<T> SuccessResult(T data, int statusCode = 200)
        {
            return new ServiceResponse<T>
            {
                Data = data,
                Success = true,
                StatusCode = statusCode,
                Errors = null,
                Message = null
            };
        }

        public static ServiceResponse<T> SuccessResult(int statusCode = 200)
        {
            return new ServiceResponse<T>
            {
                Data = default, // T? olduğu için null olabilir
                Success = true,
                StatusCode = statusCode,
                Errors = null,
                Message = null
            };
        }

        public static ServiceResponse<T> SuccessResult(T data, string message, int statusCode = 200)
        {
            return new ServiceResponse<T>
            {
                Data = data,
                Success = true,
                Message = message,
                StatusCode = statusCode,
                Errors = null
            };
        }

        public static ServiceResponse<T> FailureResult(string error, int statusCode = 400)
        {
            return new ServiceResponse<T>
            {
                Data = default,
                Success = false,
                Message = error,
                StatusCode = statusCode,
                Errors = new List<string> { error }
            };
        }

        public static ServiceResponse<T> FailureResult(List<string> errors, int statusCode = 400)
        {
            return new ServiceResponse<T>
            {
                Data = default,
                Success = false,
                StatusCode = statusCode,
                Errors = errors,
                Message = null
            };
        }
    }
}