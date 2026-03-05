namespace IsBasvuru.Domain.DTOs.SirketYapisiDtos.PersonelEhliyetDtos
{
    public class PersonelEhliyetListDto
    {
        public int Id { get; set; }
        public int PersonelId { get; set; }

        public int EhliyetTuruId { get; set; }
        public required string EhliyetTuruAdi { get; set; } // Mapping ile dolacak
    }
}