const JsonRpcResult = require('./JsonRpcResult');
const JsonRpcError = require('./JsonRpcError');

module.exports = class JsonRpcHandler {
  constructor() {
    this.methods = {};
  }

  /**
   * Set method handler
   * @param {string} method 
   * @param {Function} handler 
   * @param {any} [context]
   */
  setMethodHandler(method, handler, context) {
    this.methods[method] = {
      handler,
      context
    };
  }

  async handle(body) {
    try {
      if (Object.prototype.toString.call(body) == '[object String]') {
        body = JSON.parse(body);
      }
    } catch (error) {
      return JsonRpcResult.error(null, new JsonRpcError.InvalidRequest());
    }
    let bodyIsArray = true;
    if (Object.prototype.toString.call(body) != '[object Array]') {
      body = [body];
      bodyIsArray = false;
    }
    let resultList = [];
    for (let item of body) {
      try {
        if (Object.prototype.toString.call(item) != '[object Object]'
          || item.jsonrpc != '2.0'
          || Object.prototype.toString.call(item.method) != '[object String]') {
          throw new JsonRpcError.InvalidRequest();
        }
        if (!this.methods[item.method]) {
          throw new JsonRpcError.MethodNotFound();
        }
        let description = this.methods[item.method];
        let itemResult = await description.handler.call(description.context, item);
        if (item.id != undefined) {
          resultList.push(JsonRpcResult.success(item.id, itemResult));
        }
      } catch (error) {
        if (item.id !== undefined) {
          if (error instanceof JsonRpcError) {
            resultList.push(JsonRpcResult.error(item.id, error));
          } else {
            resultList.push(JsonRpcResult.error(item.id, new JsonRpcError.InternalError(error)));
          }
        }
      }
    }
    if (bodyIsArray) {
      return resultList;
    }
    return resultList[0] || null;
  }
};