namespace IsBasvuru.Domain.DTOs.TanimlamalarDtos.IlceDtos
{
    public class IlceListDto
    {
        public int Id { get; set; }
        public required string IlceAdi { get; set; }

        // İlişkiler
        public int SehirId { get; set; }
        public required string SehirAdi { get; set; }
        public required string UlkeAdi { get; set; }
    }
}