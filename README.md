# jsonrpc
A simple implementation of jsonrpc2

### example

```js
import { JsonRpcHandler, JsonRpcError } from 'tian-jsonrpc';

let jsonRpc = new JsonRpcHandler();

//add a single method like this...
jsonRpc.setHandler('sayHello', function ({ name }) {
    if (!name) {
        throw JsonRpcError.alert('parameter `name` is required');
    }
    return `hello ${name}`;
});

//... or add multi methods from an object...
class Api {
    static async doSomething() {
        return await new Promise(resolve => {
            setTimeout(() => {
                resolve('do async thing result');
            }, 1000);
        });
    }
}
jsonRpc.extractHandler(Api);

//now you can handle jsonrpc request
jsonRpc.handle('{"jsonrpc":"2.0","method":"doSomething","id":"1"}');

//await to get result
(async () => {
    let result2 = await jsonRpc.handle([
        { jsonrpc: '2.0', method: 'unexisted method', id: 1 },
        { jsonrpc: '2.0', method: 'sayHello', id: 2, params: { name: 'world' } },
        { jsonrpc: '2.0', method: 'doAsyncThing', id: 3, params: { value: 'params...' } }
    ]);
})();
```

### api
+ JsonRpcError
    + static JsonRpcError.constructor(code, message, data?)
    + static JsonRpcError.parseError()
    + static JsonRpcError.invalidRequest(data?)
    + static JsonRpcError.methodNotFound()
    + static JsonRpcError.invalidParams(data?)
    + static JsonRpcError.internalError(data?)
    + static JsonRpcError.alert(message: string, data?)
    + JsonRpcError.toJSON()
+ JsonRpcResult
    + static JsonRpcResult.success(id, result)
    + static JsonRpcResult.error(id, error: JsonRpcError)
+ JsonRpcHandler
    + JsonRpcHandler.constructor()
    + JsonRpcHandler.setHandler(methodName: string, method: Function, context?: Object)
    + JsonRpcHandler.extractHandler(object: Object)
    + JsonRpcHandler.setOnUnexpectedError(onUnexpectedError: Function)
    + JsonRpcHandler.getMethods()
    + async JsonRpcHandler.handle(body)