class JsonRpcError extends Error {
  /**
   * 
   * @param {Number} code
   * @param {String} message 
   * @param {*} [data] 
   */
  constructor(code, message, data) {
    super(message);
    this.code = code;
    this.data = data;
  }

  toJSON() {
    return Object.assign({}, this, { message: this.message });
  }
}

JsonRpcError.ParseError = class ParseError extends JsonRpcError {
  /**
   * Constructor
   * @param {any} [data]
   */
  constructor(data) {
    super(-32700, 'Parse error', data);
  }
};

JsonRpcError.InvalidRequest = class InvalidRequest extends JsonRpcError {
  /**
   * Constructor
   * @param {any} [data]
   */
  constructor(data) {
    super(-32600, 'Invalid Request', data);
  }
};

JsonRpcError.MethodNotFound = class MethodNotFound extends JsonRpcError {
  /**
   * Constructor
   * @param {any} [data]
   */
  constructor(data) {
    super(-32601, 'Method not found', data);
  }
};

JsonRpcError.InvalidParams = class InvalidParams extends JsonRpcError {
  /**
   * Constructor
   * @param {any} [data]
   */
  constructor(data) {
    super(-32602, 'Invalid params', data);
  }
};

JsonRpcError.InternalError = class InternalError extends JsonRpcError {
  /**
   * Constructor
   * @param {any} [data]
   */
  constructor(data) {
    super(-32603, 'Internal error', data);
  }
};

module.exports = JsonRpcError;