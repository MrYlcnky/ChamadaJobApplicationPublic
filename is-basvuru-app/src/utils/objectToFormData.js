export function objectToFormData(obj, form, namespace) {
  const fd = form || new FormData();
  let formKey;

  for (const property in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, property)) {
      const value = obj[property];

      // Anahtar (Key) Oluşturma: "KisiselBilgiler.Ad" gibi
      if (namespace) {
        formKey = namespace + "." + property;
      } else {
        formKey = property;
      }

      // 1. Değer Tanımsız veya Null ise -> Atla (Backend null kabul eder)
      if (value === undefined || value === null) {
        continue;
      }

      // 2. Tarih (Date) -> ISO formatında gönder
      if (value instanceof Date) {
        fd.append(formKey, value.toISOString());
      }
      // 3. Dosya (File / Blob) -> Olduğu gibi gönder
      else if (value instanceof File || value instanceof Blob) {
        fd.append(formKey, value);
      }
      // 4. Dizi (Array) -> EgitimBilgileri[0].OkulAdi formatına çevir
      else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          // ASP.NET Core için liste formatı: PropName[0]
          const arrayKey = `${formKey}[${index}]`;

          if (item instanceof File || item instanceof Blob) {
            fd.append(arrayKey, item);
          } else if (item instanceof Date) {
            fd.append(arrayKey, item.toISOString());
          } else if (typeof item === "object" && item !== null) {
            // Dizi içindeki nesneler için RECURSION (Kendini tekrar çağır)
            objectToFormData(item, fd, arrayKey);
          } else {
            fd.append(arrayKey, item);
          }
        });
      }
      // 5. Nesne (Object) -> KisiselBilgiler.Ad formatına çevir (RECURSION)
      else if (typeof value === "object" && value !== null) {
        objectToFormData(value, fd, formKey);
      }
      // 6. Basit Değerler (String, Number)
      else {
        fd.append(formKey, value);
      }
    }
  }

  return fd;
}
