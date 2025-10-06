/**
 * Genera un número aleatorio dentro de un rango y lo redondea a un número específico de decimales.
 * @param {number} min - El valor mínimo del rango.
 * @param {number} max - El valor máximo del rango.
 * @param {number} decimals - El número de decimales para el redondeo.
 * @returns {number} - El número aleatorio generado.
 */
function rand(min, max, decimals) {
  // Genera un número aleatorio en el rango [min, max)
  const v = Math.random() * (max - min) + min;
  // Calcula el factor para el redondeo (ej. 10, 100, 1000)
  const f = Math.pow(10, decimals || 0);
  // Redondea el valor al número de decimales especificado
  return Math.round(v * f) / f;
}

/**
 * Función principal que maneja la solicitud a la API /api/sensor.
 * @param {object} r - El objeto de la solicitud (request) de NGINX.
 */
function sensor(r) {
  // Lee el parámetro de consulta '?units=C|F'. Por defecto es 'C'.
  const units = (r.args.units || 'C').toUpperCase();

  // Genera una temperatura base aleatoria en Celsius
  let tempC = rand(18, 30, 1);

  // Si se piden unidades Fahrenheit, convierte el valor
  if (units === 'F') {
    tempC = (tempC * 9/5) + 32;
  }

  // Crea el objeto JSON que se enviará como respuesta
  const payload = {
    sensor: "GCE-virtual-01",
    timestamp: new Date().toISOString(),
    temperature: tempC,
    temperature_units: units === 'F' ? '°F' : '°C',
    humidity: rand(35, 80, 1),
    humidity_units: '%',
    region: "us-central1-a",
    source: "nginx+njs"
  };

  // --- Configura las cabeceras de la respuesta HTTP ---

  // Indica que la respuesta es un JSON en formato UTF-8
  r.headersOut['Content-Type'] = 'application/json; charset=utf-8';
  // Permite que cualquier dominio (origen) acceda a esta API (CORS)
  r.headersOut['Access-Control-Allow-Origin'] = '*';

  // Envía la respuesta: código 200 (OK) y el objeto JSON convertido a texto
  r.return(200, JSON.stringify(payload));
}

// Exporta la función 'sensor' para que NGINX pueda llamarla
export default { sensor };