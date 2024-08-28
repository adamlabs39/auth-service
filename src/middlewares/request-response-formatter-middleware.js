const requestResponseFormatterMidddleware = (request, response, nextFunction) => {
  request.body = toCamelCase(request.body);
  const resp = response.json;
  response.json = function (data) {
    resp.call(this, camelToSnake(data));
  };
  nextFunction();
};

function camelToSnake(object) {
  if (typeof object !== "object" || object === null) return object;
  if (Array.isArray(object)) return object.map(camelToSnake);
  return Object.keys(object).reduce((acc, key) => {
    const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
    acc[snakeKey] = camelToSnake(object[key]);
    return acc;
  }, {});
}

function toCamelCase(object) {
  if (typeof object !== "object" || object === null) return object;
  if (Array.isArray(object)) return object.map(toCamelCase);
  return Object.keys(object).reduce((acc, key) => {
    const camelKey = key.replace(/(_\w)/g, (matches) => matches[1].toUpperCase());
    acc[camelKey] = toCamelCase(object[key]);
    return acc;
  }, {});
}
export default requestResponseFormatterMidddleware;
