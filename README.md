# jsonrpc
A simple implementation of jsonrpc2

### example

```js
const { JsonRpcHandler, JsonRpcError } = require('tian-jsonrpc');

let jsonRpc = new JsonRpcHandler();

//add a single method like this...
jsonRpc.setMethodHandler('sayHello', function ({ name }) {
    if (!name) {
        throw JsonRpcError.InvalidParams('parameter `name` is required');
    }
    return `hello ${name}`;
});

//now you can handle jsonrpc request
jsonRpc.handle('{"jsonrpc":"2.0","method":"doSomething","id":"1"}');

//await to get result
(async () => {
    let result2 = await jsonRpc.handle([
        { jsonrpc: '2.0', method: 'unexisted method', id: 1 },
        { jsonrpc: '2.0', method: 'sayHello', id: 2, params: { name: 'world' } }
    ]);
})();
```

### api
+ JsonRpcError
JsonRpcError.constructor(code, message, data?)
    + JsonRpcError.toJSON()
    + JsonRpcError.ParseError.constructor(data?)
    + JsonRpcError.InvalidRequest.constructor(data?)
    + JsonRpcError.MethodNotFound.constructor(data?)
    + JsonRpcError.InvalidParams.constructor(data?)
    + JsonRpcError.InternalError.constructor(data?)
+ JsonRpcResult
    + static JsonRpcResult.success(id, result)
    + static JsonRpcResult.error(id, error)
+ JsonRpcHandler
    + JsonRpcHandler.constructor()
    + JsonRpcHandler.setMethodHandler(method: string, handler: Function, context?: Object)
    + async JsonRpcHandler.handle(body)