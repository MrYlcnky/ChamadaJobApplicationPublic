namespace IsBasvuru.Domain.DTOs.TanimlamalarDtos.IlceDtos
{
    public class IlceCreateDto
    {
        public int SehirId { get; set; }
        public required string IlceAdi { get; set; }
    }
}