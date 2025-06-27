# buda
Repositorio para entrevista técnica

## Instalación
Requiere tener node.js instalado

```bash
npm install
```
Correr en dev (con nodemon):
```bash
npm run dev
```
Correr en prod (con node):
```bash
npm run start
```

Correr tests (jest):
```bash
npm run test
```

## API de Cotizaciones

### Endpoint: `/cotizaciones`

#### Descripción
Este endpoint permite calcular el valor total de un portafolio de criptomonedas en una moneda fiduciaria específica. Utiliza la API de Buda.com para obtener las cotizaciones actuales del mercado.

#### Método
`GET`

#### Cuerpo de la Solicitud
```json
{
  "portfolio": {
    "BTC": 0.5,
    "ETH": 2.0,
    "USDT": 1000
  },
  "fiat_currency": "CLP"
}
```

- `portfolio`: Objeto que contiene las criptomonedas y sus cantidades respectivas.
- `fiat_currency`: Moneda fiduciaria en la que se desea obtener el valor total (ej: CLP, PEN, ARS).

#### Respuesta Exitosa
```json
{
  "message": "Cotizaciones obtenidas",
  "portfolioValue": 56000000,
  "fiat_currency": "CLP"
}
```

- `message`: Mensaje de confirmación.
- `portfolioValue`: Valor total del portafolio en la moneda fiduciaria especificada.
- `fiat_currency`: Moneda fiduciaria utilizada para la cotización.

#### Errores
- **404**: Si no se encuentra un mercado para alguna de las criptomonedas en la moneda fiduciaria especificada.
- **500**: Error interno del servidor al procesar la solicitud.

#### Ejemplo de Uso
```bash
curl -X GET http://localhost:3000/cotizaciones \
  -H "Content-Type: application/json" \
  -d '{"portfolio":{"BTC":0.5,"ETH":2.0,"USDT":1000},"fiat_currency":"CLP"}'
```
