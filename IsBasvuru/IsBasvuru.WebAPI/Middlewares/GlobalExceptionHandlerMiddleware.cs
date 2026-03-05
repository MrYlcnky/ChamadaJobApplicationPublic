using IsBasvuru.Domain.DTOs.Shared; 
using IsBasvuru.Domain.Wrappers;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting; 
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic; 
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

namespace IsBasvuru.WebAPI.Middlewares
{
    public class GlobalExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public GlobalExceptionHandlerMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlerMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Sistemde yakalanan hata: {ex.Message}");

                await HandleExceptionAsync(httpContext, ex);
            }
        }

        private Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            int statusCode = (int)HttpStatusCode.InternalServerError;
            string message = "Sunucu kaynaklı beklenmedik bir hata oluştu.";

            switch (exception)
            {
                case KeyNotFoundException:
                    statusCode = (int)HttpStatusCode.NotFound; // 404
                    message = "İstenilen kayıt bulunamadı.";
                    break;

                case UnauthorizedAccessException:
                    statusCode = (int)HttpStatusCode.Unauthorized; // 401
                    message = "Bu işlem için yetkiniz bulunmamaktadır.";
                    break;

                case ArgumentException:
                case InvalidOperationException:
                    // İş kuralları hatası (örn: "Personel yaşı 18'den küçük olamaz")
                    statusCode = (int)HttpStatusCode.BadRequest; // 400
                    message = exception.Message; // Bu mesajlar güvenlidir, kullanıcıya gösterilebilir.
                    break;

                default:
                    statusCode = (int)HttpStatusCode.InternalServerError; // 500

                    
                    // Development ortamındaysak hatayı detaylı göster (Debug kolaylığı).
                    // Production (Canlı) ortamındaysak hatayı gizle (Güvenlik).
                    if (_env.IsDevelopment())
                    {
                        message = $"DEV ERROR: {exception.Message}";
                    }
                    else
                    {
                        // Canlı ortamda kullanıcıya teknik detay vermiyoruz.
                        message = "İşleminiz sırasında beklenmedik bir hata oluştu. Lütfen destek ekibiyle iletişime geçiniz.";
                    }
                    break;
            }

            context.Response.StatusCode = statusCode;

            // Cevap modelini oluştur
            var responseModel = ServiceResponse<NoContent>.FailureResult(message, statusCode);

            // JSON ayarları
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var json = JsonSerializer.Serialize(responseModel, options);

            return context.Response.WriteAsync(json);
        }
    }
}