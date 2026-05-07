
export const SENSITIVE_REGEX = {
  // Teléfonos colombianos: 3xx xxx xxxx, +57, etc.
  phone: /(\+?57)?\s?3\d{2}\s?\d{3}\s?\d{4}|\b\d{7,10}\b/g,
  
  // Emails
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  
  // Direcciones (Calle, Carrera, etc con números)
  address: /\b(calle|carrera|cll|cra|barrio|diagonal|transversal|avenida|av|apartamento|apto|conjunto|edificio|urbanizacion|manzana|casa|lote)\b\s*#?\s*\d*\w*/gi,
  
  // Palabras clave de contacto
  contact: /(llamar|escribir|whatsapp|cel|tel|contáctame al|mi número es|mi cel es)\s*[:\-\s]*\d+/gi
};

export const detectSensitiveInfo = (text: string): boolean => {
  if (!text) return false;
  return (
    SENSITIVE_REGEX.phone.test(text) ||
    SENSITIVE_REGEX.email.test(text) ||
    SENSITIVE_REGEX.address.test(text) ||
    SENSITIVE_REGEX.contact.test(text)
  );
};

export const maskSensitiveInfo = (text: string): string => {
  if (!text) return '';
  
  let filtered = text;
  
  // Reset lastIndex for all global regexes
  Object.values(SENSITIVE_REGEX).forEach(re => re.lastIndex = 0);

  filtered = filtered.replace(SENSITIVE_REGEX.phone, '[TELÉFONO OCULTO]');
  filtered = filtered.replace(SENSITIVE_REGEX.email, '[EMAIL OCULTO]');
  filtered = filtered.replace(SENSITIVE_REGEX.contact, '$1 [INFO OCULTA]');
  filtered = filtered.replace(SENSITIVE_REGEX.address, '[UBICACIÓN OCULTA]');
  
  return filtered;
};
