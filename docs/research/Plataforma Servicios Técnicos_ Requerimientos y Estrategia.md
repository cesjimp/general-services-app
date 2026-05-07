# **Documento de Requerimientos y Estrategia: Plataforma de Servicios Técnicos**

## **1\. Resumen Ejecutivo y Propuesta de Valor**

La plataforma se establece como un **Portal de Contacto** (intermediario tecnológico) diseñado para conectar la oferta técnica local con la creciente demanda residencial y vacacional en el eje Girardot-Ricaurte-Melgar-Ibagué. El objetivo es eliminar la fricción de la informalidad y la desconfianza mediante un sistema de verificación y reputación digital.

## **2\. Definición del Producto (Línea Base)**

* **Naturaleza:** Portal de contacto bajo la Ley 1480 de 2011\.  
* **Intervención:** La plataforma es únicamente un puente de comunicación. No interviene en la negociación de precios, ejecución de trabajos, cobros directos ni garantías.  
* **Precios:** No existen tarifas estandarizadas; el valor es pactado libremente entre el profesional y el cliente.

## **3\. Análisis de Mercado y Público Objetivo**

* **Segmento Vacacional (Girardot, Ricaurte, Melgar):** Propietarios ausentes y anfitriones de Airbnb (más de 520 alojamientos activos) que requieren soluciones inmediatas para mantener la rentabilidad de sus activos.  
* **Segmento Residencial/Industrial (Ibagué):** Familias y empresas que buscan mantenimiento preventivo y especializado.  
* **Demografía Clave:** Usuarios de 23 a 35 años (26% de los compradores de vivienda en la zona), con alta dependencia de soluciones digitales.  
* **Contexto de Demanda:** La inestabilidad de los servicios públicos en nuevos desarrollos inmobiliarios (Ricaurte) actúa como un disparador constante de necesidades técnicas de reparación.

## **4\. Gestión de Usuarios y Roles**

* **Registro:** Email y contraseña con validación obligatoria de número celular mediante OTP (WhatsApp).  
* **Cuenta Dual:** Un único perfil que permite alternar entre **Modo Cliente** y **Modo Profesional** mediante un interruptor (Toggle) en la interfaz.  
* **Validación de Identidad:** Carga de fotos de documento de identidad, Selfie-ID y verificación manual de antecedentes penales por parte del administrador antes de habilitar el perfil profesional.  
* **Control de Disponibilidad:** Los profesionales pueden activarse o desactivarse temporalmente (ej. domingos o feriados) para no recibir notificaciones push.

## **5\. Dinámicas de Contacto**

El cliente dispone de tres modalidades para encontrar soporte técnico:

1. **Contacto Directo:** Selección de un profesional específico basado en su perfil y calificaciones. El profesional paga el crédito solo si acepta la solicitud.  
2. **Contacto Masivo:** El cliente publica una necesidad y el sistema notifica a los profesionales mejor calificados o destacados en la zona. Solo los primeros 3 profesionales que compren el acceso pueden ver los datos del cliente.  
3. **Selección Múltiple:** El cliente elige hasta 3 profesionales específicos. Cada uno de ellos decide si gasta su crédito para competir por el trabajo.

## **6\. Sistema de Monetización (Créditos)**

* **Venta de Leads:** El modelo de negocio principal es la venta de paquetes de créditos a los profesionales.  
* **Uso de Créditos:** Los créditos se descuentan al visualizar los datos de contacto del cliente.  
* **Transparencia:** El profesional debe conocer cuántos colegas han comprado ya el contacto antes de decidir gastar su crédito.

## **7\. Sistema de Reputación y Verificación (Antifraude)**

* **Trazabilidad:** La calificación solo es posible si existe un registro previo de contacto a través de la aplicación.  
* **Confirmación de Cierre:** El profesional debe marcar el servicio como Exitoso o Fallido.  
* **Feedback Loop de Reenganche:** Si el profesional reporta un trato fallido, la aplicación contacta al cliente de forma empática: *"Notamos que no se concretó el servicio. ¿Aún tienes la necesidad? ¿Deseas contactar a otros expertos?"*.  
* **Validación Cruzada:** Si el cliente indica que el servicio sí se realizó, se descuenta el crédito, se habilita la calificación y se penaliza al profesional por información falsa.  
* **Evidencia Visual:** Las reseñas requieren obligatoriamente una fotografía del trabajo realizado, aportando la "evidencia digital" que demanda el mercado vacacional.

## **8\. Requerimientos Técnicos (Mobile-First)**

* **Tecnología PWA:** WebApp de acceso instantáneo que elimina la barrera de descarga, optimizada para funcionar con baja conectividad en zonas rurales o sótanos.  
* **WhatsApp API:** Integración para notificaciones push automáticas a los profesionales sobre nuevas oportunidades de trabajo.  
* **Optimización de Datos:** Compresión de imágenes (formato WebP) para reducir el consumo en planes prepago.

## **9\. Estrategia de Lanzamiento Regional**

* **Prioridad Geográfica:** Lanzamiento inicial en el eje **Ricaurte-Girardot** para capturar el segmento de alta disposición de pago, seguido de expansión a Ibagué.  
* **Filtro de Seguridad:** Posicionamiento del "Sello de Seguridad" como el valor diferencial frente a directorios informales.  
* **Alianzas con Terceros:** Inclusión de banners para ferreterías locales como fuente de ingresos adicional y beneficio para el usuario.

---

**Nota para Desarrollo:** La aplicación debe ser ligera, intuitiva y centrada en la acción de "conectar". Toda la lógica de negocio y reputación debe estar blindada para incentivar la honestidad del profesional y la recurrencia del cliente.