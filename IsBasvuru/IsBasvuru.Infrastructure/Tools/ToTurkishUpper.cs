using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Infrastructure.Tools
{
    public static class StringTools
    {
        /// <summary>
        /// Metni Türkçe karakter kurallarına uygun şekilde büyük harfe çevirir.
        /// </summary>
        public static string ToTurkishUpper(this string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return string.Empty;

            return value.Trim().ToUpper(new CultureInfo("tr-TR"));
        }

        /// <summary>
        /// Metni İngilizce/Uluslararası (en-US / Invariant) kurallara göre büyük harfe çevirir.
        /// Örnek: "izmir" -> "IZMIR", "shim" -> "SHIM"
        /// </summary>
        public static string ToEnglishUpper(this string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return string.Empty;

            // InvariantCulture genelde İngilizce davranışı sergiler (i -> I)
            return value.Trim().ToUpper(CultureInfo.InvariantCulture);
        }
    }
}
