// Weather calculations. Inputs: temp in °C, humidity in %, wind in km/h.
const round1 = (n) => Math.round(n * 10) / 10;
const toF = (c) => c * 9 / 5 + 32;
const toC = (f) => (f - 32) * 5 / 9;
const toK = (c) => c + 273.15;

// Rothfusz regression (NWS) – works in °F
function heatIndexC(c, rh) {
  const T = toF(c);
  const hi = -42.379 + 2.04901523 * T + 10.14333127 * rh - 0.22475541 * T * rh
    - 0.00683783 * T * T - 0.05481717 * rh * rh + 0.00122874 * T * T * rh
    + 0.00085282 * T * rh * rh - 0.00000199 * T * T * rh * rh;
  return toC(hi);
}

// Wind chill – metric
function windChillC(c, kmh) {
  const v = Math.pow(kmh, 0.16);
  return 13.12 + 0.6215 * c - 11.37 * v + 0.3965 * c * v;
}

// Magnus formula
function dewPointC(c, rh) {
  const a = 17.62, b = 243.12;
  const g = Math.log(rh / 100) + (a * c) / (b + c);
  return (b * g) / (a - g);
}

function feelsLikeC(c, rh, kmh) {
  if (c >= 27 && rh >= 40) return heatIndexC(c, rh);
  if (c <= 10 && kmh > 4.8) return windChillC(c, kmh);
  return c;
}

function condition(c, rh, kmh) {
  if (c <= 0) return 'snow';
  if (rh >= 85) return 'rain';
  if (kmh >= 40) return 'windy';
  if (rh >= 60) return 'cloudy';
  return 'sunny';
}

function calculate({ temp, humidity, wind }) {
  const t = Number(temp), h = Number(humidity), w = Number(wind);
  if ([t, h, w].some(Number.isNaN)) throw new Error('temp, humidity and wind must be numbers');
  if (h < 1 || h > 100) throw new Error('humidity must be between 1 and 100');
  if (w < 0) throw new Error('wind must be 0 or more');
  return {
    celsius: round1(t),
    fahrenheit: round1(toF(t)),
    kelvin: round1(toK(t)),
    feelsLike: round1(feelsLikeC(t, h, w)),
    dewPoint: round1(dewPointC(t, h)),
    condition: condition(t, h, w)
  };
}

module.exports = { toF, toC, toK, heatIndexC, windChillC, dewPointC, feelsLikeC, condition, calculate };
