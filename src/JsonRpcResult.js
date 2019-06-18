module.exports = class JsonRpcResult {
  static success(id, result) {
    return { jsonrpc: '2.0', id, result };
  }

  static error(id, error) {
    return { jsonrpc: '2.0', id, error: error.toJSON() };
  }
};