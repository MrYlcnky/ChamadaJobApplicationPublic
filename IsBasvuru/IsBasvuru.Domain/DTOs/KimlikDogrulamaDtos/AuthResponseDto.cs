namespace IsBasvuru.Domain.DTOs.KimlikDogrulamaDtos
{
    public class AuthResponseDto
    {
        public required string Token { get; set; }
        public required string Eposta { get; set; }
    }
}