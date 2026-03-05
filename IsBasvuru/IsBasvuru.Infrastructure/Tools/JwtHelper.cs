using IsBasvuru.Domain.Entities.AdminBilgileri;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace IsBasvuru.Infrastructure.Tools
{
    public class JwtHelper
    {
        private readonly IConfiguration _configuration;

        public JwtHelper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // 1. MEVCUT ADMIN PANEL İÇİN TOKEN METODU 
        public string GenerateToken(PanelKullanici user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = Encoding.ASCII.GetBytes(GetRequiredSetting(jwtSettings, "SecurityKey"));
            var issuer = GetRequiredSetting(jwtSettings, "Issuer");
            var audience = GetRequiredSetting(jwtSettings, "Audience");
            var durationValue = GetRequiredSetting(jwtSettings, "DurationInMinutes");
            if (!double.TryParse(durationValue, NumberStyles.Float, CultureInfo.InvariantCulture, out var durationInMinutes))
            {
                throw new InvalidOperationException("JwtSettings:DurationInMinutes geçerli bir sayı değil.");
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.KullaniciAdi),
                new Claim("AdSoyad", $"{user.Adi} {user.Soyadi}"),
                // Rol null gelirse varsayılan olarak User ata
                new Claim(ClaimTypes.Role, user.Rol?.RolAdi ?? "User")
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                // Admin için süre (appsettings'den okunuyor, genelde 60 dk)
                Expires = DateTime.UtcNow.AddMinutes(durationInMinutes),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        // 2. YENİ BAŞVURU YAPAN İÇİN GEÇİCİ TOKEN METODU
        public string BasvuruTokenUret(string eposta)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = Encoding.ASCII.GetBytes(GetRequiredSetting(jwtSettings, "SecurityKey"));
            var issuer = GetRequiredSetting(jwtSettings, "Issuer");
            var audience = GetRequiredSetting(jwtSettings, "Audience");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, eposta),        // Kimliği E-posta ile tutuyoruz
                new Claim(ClaimTypes.Role, "BasvuruYapan") // Özel Kısıtlı Rol
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(30), // Sadece 30 dakika geçerli
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        private static string GetRequiredSetting(IConfigurationSection section, string key)
        {
            var value = section[key];
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new InvalidOperationException($"JwtSettings:{key} yapılandırması bulunamadı veya boş.");
            }

            return value;
        }
    }
}