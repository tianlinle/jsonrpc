import { JsonRpcHandler } from "../JsonRpcHandler";

let methods = {
    something: 'a big thing',
    doSomething() {
        return `do ${this.something}`;
    },
    async doAsyncThing(params) {
        return await new Promise(resolve => {
            setTimeout(() => {
                resolve('do async thing result');
            }, 1000);
        });
    }
};

(async () => {
    let jsonRpc = new JsonRpcHandler();
    jsonRpc.extractHandler(methods);
    jsonRpc.setHandler('sayHello', function ({ name }) {
        return `hello ${name}`;
    });
    console.log(jsonRpc.getMethods());

    let result1 = await jsonRpc.handle('{"jsonrpc":"2.0","method":"doSomething","id":"1"}');
    console.log('result1', result1);

    let result2 = await jsonRpc.handle([
        { jsonrpc: '2.0', method: 'unexisted method', id: 1 },
        { jsonrpc: '2.0', method: 'sayHello', id: 2, params: { name: 'world' } },
        { jsonrpc: '2.0', method: 'doAsyncThing', id: 3, params: { value: 'params...' } }
    ]);
    console.log('result2', result2);
})();