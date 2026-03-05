namespace IsBasvuru.Domain.DTOs.TanimlamalarDtos.IlceDtos
{
    public class IlceUpdateDto
    {
        public int Id { get; set; }
        public int SehirId { get; set; }
        public required string IlceAdi { get; set; }
    }
}