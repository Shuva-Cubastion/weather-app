const test = require('node:test');
const assert = require('node:assert');
const { calculate, toF, dewPointC, condition } = require('../calc');

test('celsius to fahrenheit', () => assert.strictEqual(toF(100), 212));

test('calculate returns all conversions', () => {
  const r = calculate({ temp: 25, humidity: 50, wind: 10 });
  assert.strictEqual(r.fahrenheit, 77);
  assert.strictEqual(r.kelvin, 298.2);
  assert.strictEqual(r.condition, 'sunny');
});

test('dew point equals temp at 100% humidity', () => {
  assert.ok(Math.abs(dewPointC(20, 100) - 20) < 0.01);
});

test('hot and humid feels hotter', () => {
  assert.ok(calculate({ temp: 35, humidity: 70, wind: 5 }).feelsLike > 35);
});

test('cold and windy feels colder', () => {
  assert.ok(calculate({ temp: 2, humidity: 50, wind: 30 }).feelsLike < 2);
});

test('conditions', () => {
  assert.strictEqual(condition(-3, 50, 0), 'snow');
  assert.strictEqual(condition(20, 90, 0), 'rain');
  assert.strictEqual(condition(20, 50, 50), 'windy');
  assert.strictEqual(condition(20, 65, 0), 'cloudy');
});

test('invalid input throws', () => {
  assert.throws(() => calculate({ temp: 'abc', humidity: 50, wind: 0 }));
  assert.throws(() => calculate({ temp: 20, humidity: 0, wind: 0 }));
});
