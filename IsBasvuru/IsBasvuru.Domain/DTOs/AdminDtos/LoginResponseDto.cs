using System;
using IsBasvuru.Domain.DTOs.AdminDtos.PanelKullaniciDtos;

namespace IsBasvuru.Domain.DTOs.AdminDtos
{
    public class LoginResponseDto
    {
        public required string Token { get; set; }
        public DateTime Expiration { get; set; }
        public virtual PanelKullaniciListDto? UserInfo { get; set; }
    }
}