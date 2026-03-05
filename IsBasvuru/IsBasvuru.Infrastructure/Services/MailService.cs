using IsBasvuru.Domain.Interfaces;
using IsBasvuru.Domain.Wrappers;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using MimeKit;
using System;
using System.Globalization;
using System.Threading.Tasks;

namespace IsBasvuru.Infrastructure.Services
{
    public class MailService : IMailService
    {
        private readonly IConfiguration _configuration;

        public MailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<ServiceResponse<bool>> DogrulamaKoduGonderAsync(string aliciEposta, string kod)
        {
            try
            {
                var emailSettings = _configuration.GetSection("EmailSettings");

                var smtpServer = GetRequiredSetting(emailSettings, "SmtpServer");
                var senderEmail = GetRequiredSetting(emailSettings, "SenderEmail");
                var senderPassword = GetRequiredSetting(emailSettings, "Password");
                var portValue = GetRequiredSetting(emailSettings, "Port");
                if (!int.TryParse(portValue, NumberStyles.Integer, CultureInfo.InvariantCulture, out var smtpPort))
                {
                    return ServiceResponse<bool>.FailureResult("SMTP port değeri geçerli değil.");
                }


                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("Chamada Group Başvuru Doğrulama Kodu", senderEmail));
                message.To.Add(new MailboxAddress("", aliciEposta));
                message.Subject = "Başvuru Doğrulama Kodu";

                message.Body = new TextPart("html")
                {
                    Text = $@"
                        <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;'>
                            <h2 style='color: #333;'>Merhaba,</h2>
                            <p>İşlemlerinize devam etmek için doğrulama kodunuz:</p>
                            <h1 style='color: #007bff; letter-spacing: 5px;'>{kod}</h1>
                            <p style='color: #666; font-size: 12px;'>Bu kod 3 dakika süreyle geçerlidir.</p>
                        </div>"
                };

                using (var client = new SmtpClient())
                {
                    await client.ConnectAsync(smtpServer, smtpPort, false);
                    await client.AuthenticateAsync(senderEmail, senderPassword);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }

                return ServiceResponse<bool>.SuccessResult(true, "Mail başarıyla gönderildi.");
            }
            catch (Exception ex)
            {
                return ServiceResponse<bool>.FailureResult($"Mail gönderim hatası: {ex.Message}");
            }
        }
        private static string GetRequiredSetting(IConfigurationSection section, string key)
        {
            var value = section[key];
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new InvalidOperationException($"EmailSettings:{key} yapılandırması bulunamadı veya boş.");
            }

            return value;
        }
    }
}