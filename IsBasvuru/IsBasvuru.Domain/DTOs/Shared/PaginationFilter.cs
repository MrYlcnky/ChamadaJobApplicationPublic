namespace IsBasvuru.Domain.DTOs.Shared
{
    public class PaginationFilter
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }

        public PaginationFilter()
        {
            // Varsayılan değerler: Hiçbir şey gelmezse 1. sayfa, 10 kayıt
            PageNumber = 1;
            PageSize = 10;
        }

        public PaginationFilter(int pageNumber, int pageSize)
        {
            PageNumber = pageNumber < 1 ? 1 : pageNumber;
            PageSize = pageSize > 50 ? 50 : pageSize; // Güvenlik: Bir seferde max 50 kayıt isteyebilsin
        }
    }
}