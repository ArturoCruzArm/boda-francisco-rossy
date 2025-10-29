# ☁️ Configuración Cloudflare para Múltiples Eventos

## Información del VPS

- **IP Pública:** `74.208.166.234`
- **Zona Principal:** `invitados.org`
- **Subdominio Base:** `rossy-francisco.invitados.org`
- **Tipo:** Hosting de múltiples eventos

## Paso 1: Configuración Inicial (Una sola vez)

### 1.1 Acceder a Cloudflare Dashboard

1. Inicia sesión en https://dash.cloudflare.com
2. Selecciona tu zona: `invitados.org`
3. Ve a la sección **DNS**

### 1.2 Crear Registros DNS para el Evento Actual

Para el evento actual (rossy-francisco):

**Registro A Principal:**
- **Tipo:** A
- **Nombre:** rossy-francisco
- **Valor (IPv4):** `74.208.166.234`
- **Proxy:** OFF (Gris - DNS Only)
- **TTL:** Auto

**Registro CNAME para www:**
- **Tipo:** CNAME
- **Nombre:** www.rossy-francisco
- **Objetivo:** rossy-francisco.invitados.org
- **Proxy:** OFF (Gris)
- **TTL:** Auto

Alternativamente, si quieres que invitados.org (raíz) también apunte:

**Registro A para raíz (opcional):**
- **Tipo:** A
- **Nombre:** @ (raíz)
- **Valor:** `74.208.166.234`
- **Proxy:** OFF
- **TTL:** Auto

### 1.4 Configurar SSL/TLS

#### SSL Mode
1. Ve a **SSL/TLS** → **Overview**
2. Selecciona **Full** o **Full (strict)**
3. Espera propagación

#### HSTS (Opcional pero Recomendado)
1. Ve a **SSL/TLS** → **Edge Certificates**
2. Habilita **HTTP Strict Transport Security (HSTS)**
3. Configura:
   - **Max Age:** 12 meses
   - **Include Subdomains:** ON
   - **Preload:** ON

### 1.5 Configurar WAF (Firewall)

1. Ve a **Security** → **WAF**
2. **Managed Rules:** ON
3. Configura:
   - OWASP ModSecurity Core Rule Set: ON
   - Cloudflare Managed Ruleset: ON

### 1.6 Rate Limiting

1. Ve a **Security** → **Rate limiting**
2. Crea una regla:
   - **Threshold:** 100 requests
   - **Time Period:** 10 seconds
   - **Mitigation Action:** Block
   - **Path:** `/api/*`

### 1.7 Bot Management (Opcional)

1. Ve a **Security** → **Bots**
2. Habilita:
   - **Super Bot Fight Mode:** ON
   - **Definitely Automated:** Block
   - **Likely Automated:** Challenge

## Paso 2: Agregar Nuevos Eventos

### 2.1 Para cada nuevo evento, crear un registro

Ejemplo para "evento-quince":

1. Ve a **DNS**
2. Crea un nuevo registro:
   - **Tipo:** A
   - **Nombre:** evento-quince
   - **Valor:** `74.208.166.234`
   - **Proxy:** OFF (Gris)
   - **TTL:** Auto

3. (Opcional) Crear alias para www:
   - **Tipo:** CNAME
   - **Nombre:** www.evento-quince
   - **Objetivo:** evento-quince.invitados.org
   - **Proxy:** OFF

### 2.2 Esperar Propagación

- Normalmente 5-10 minutos
- Máximo 48 horas en casos excepcionales

### 2.3 Probar Acceso

```bash
# Verificar DNS
nslookup evento-quince.invitados.org

# Probar acceso
curl http://evento-quince.invitados.org
```

## Paso 3: Optimización de Rendimiento

### 3.1 Caching

1. Ve a **Caching** → **Cache Rules**

2. Crear regla para APIs (NO cachear):
   - **Path:** `/api/*`
   - **Cache Level:** Bypass Cache
   - **Browser Cache:** No Store

3. Crear regla para assets (cachear):
   - **Path:** `*.css` OR `*.js`
   - **Cache Level:** Cache Everything
   - **Browser Cache:** 1 month
   - **Edge Cache:** 1 month

4. Crear regla para imágenes (NO cachear):
   - **Path:** `/api/images/*`
   - **Cache Level:** Bypass Cache
   - **Browser Cache:** No Store

### 3.2 Minificación

1. Ve a **Speed** → **Optimization**
2. Habilita:
   - ✅ Minify CSS
   - ✅ Minify JavaScript
   - ✅ Minify HTML

### 3.3 Compression

1. Ve a **Speed** → **Optimization**
2. Habilita:
   - ✅ Brotli (Compression)
   - ✅ Polish (Image Optimization) - Opcional

### 3.4 HTTP/3

1. Ve a **Network**
2. Habilita:
   - ✅ HTTP/3 (QUIC)
   - ✅ gRPC

## Paso 4: Monitoreo

### 4.1 Analytics

1. Ve a **Analytics & Logs**
2. Monitorea:
   - **Requests:** Cantidad y origen
   - **Cache:** Hit/Miss ratio
   - **Security:** Eventos bloqueados
   - **Errors:** 4xx y 5xx

### 4.2 Page Rules (Alternativa a Cache Rules)

Si tu plan tiene Page Rules, puedes usar:

```
https://evento-*.rossy-francisco.invitados.org/*

- Cache Level: Cache Everything
- Browser Cache: 1 month
- Edge Cache: 30 days
```

## Configuración Recomendada Completa

### DNS Records

| Tipo | Nombre | Valor | Proxy | TTL |
|------|--------|-------|-------|-----|
| A | @ | 74.208.166.234 | OFF | Auto |
| CNAME | www | rossy-francisco.invitados.org | OFF | Auto |
| A | evento-1 | 74.208.166.234 | OFF | Auto |
| CNAME | www.evento-1 | evento-1.rossy-francisco.invitados.org | OFF | Auto |
| A | evento-2 | 74.208.166.234 | OFF | Auto |
| CNAME | www.evento-2 | evento-2.rossy-francisco.invitados.org | OFF | Auto |

### Security Settings

- SSL Mode: Full (strict)
- HSTS: 12 months, incluir subdomains, preload
- WAF: Habilitado
- Rate Limiting: 100 req/10s para `/api/*`
- DDoS: Habilitado
- Bot Management: Habilitado (si disponible)

### Performance Settings

- Minify: CSS, JS, HTML
- Brotli: Habilitado
- HTTP/3: Habilitado
- Polish: Habilitado (si disponible)

## Troubleshooting Cloudflare

### DNS no se propaga

1. Verificar registro está en "DNS Only" (gris)
2. Esperar 10-15 minutos
3. Limpiar cache: `https://dash.cloudflare.com/cache/purge`

### HTTPS no funciona

1. Verificar SSL Mode es "Full" o "Full (strict)"
2. Verificar certificado Let's Encrypt en VPS: `certbot certificates`
3. Esperar 10 minutos para propagación

### Imágenes se cachean cuando no deben

1. Ve a **Caching** → **Cache Rules**
2. Crear/actualizar regla para `/api/images/*`
3. Establecer **Cache Level:** Bypass Cache

### Performance lento

1. Ve a **Analytics** → **Performance**
2. Verificar Cache Hit Ratio
3. Crear Cache Rules para assets estáticos
4. Habilitar minificación

## Script para Crear Registros DNS (Usando API de Cloudflare)

Si manejas muchos eventos, puedes automatizar con:

```bash
#!/bin/bash

CLOUDFLARE_API_TOKEN="tu-token-aqui"
ZONE_ID="tu-zone-id"
EVENTO=$1

curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "type":"A",
    "name":"'$EVENTO'",
    "content":"74.208.166.234",
    "ttl":"Auto",
    "proxied":false
  }'
```

Uso:
```bash
./add-dns-record.sh evento-boda
```

## Información Importante

### IPs de Cloudflare

Estos son rangos que Cloudflare usa. Si necesitas whitelist:
- IPv4: https://www.cloudflare.com/ips-v4
- IPv6: https://www.cloudflare.com/ips-v6

### Certificados SSL

- **Origen:** Let's Encrypt en el VPS
  - Dominio: `invitados.org`
  - Wildcard: `*.invitados.org`
- **Edge:** Cloudflare (automático)
- **Renovación:** Automática cada 90 días

### Backups y Recuperación

Los registros DNS están sincronizados. En caso de emergencia:
```bash
# Ver registros actuales
curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CF_TOKEN" | jq
```

## Soporte

Para problemas:
1. Cloudflare Status: https://www.cloudflarestatus.com/
2. Cloudflare Community: https://community.cloudflare.com/
3. Logs del VPS: `tail -f /var/log/boda.log`
