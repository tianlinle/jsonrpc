import { JsonRpcResult } from "./JsonRpcResult";
import { JsonRpcError } from "./JsonRpcError";

export class JsonRpcHandler {
    private methods: { [key: string]: { method: Function, context?: Object } } = {};
    private onUnexpectedError: (error: any) => any;

    setHandler(methodName: string, method: Function, context?: Object) {
        this.methods[methodName] = {
            method,
            context: context
        }
    }

    setOnUnexpectedError(onUnexpectedError: (error: any) => any) {
        this.onUnexpectedError = onUnexpectedError;
    }

    getMethods() {
        return this.methods;
    }

    async handle(body) {
        try {
            if (Object.prototype.toString.call(body) == '[object String]') {
                body = JSON.parse(body);
            }
        } catch (error) {
            return JsonRpcResult.error(null, JsonRpcError.invalidRequest());
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
                    throw JsonRpcError.invalidRequest();
                }
                if (!this.methods[item.method]) {
                    throw JsonRpcError.methodNotFound();
                }
                let description = this.methods[item.method];
                let itemResult = await description.method.call(description.context, item.params);
                if (item.id != undefined) {
                    resultList.push(JsonRpcResult.success(item.id, itemResult));
                }
            } catch (error) {
                if (error instanceof JsonRpcError) {
                    if (item.id != undefined) {
                        resultList.push(JsonRpcResult.error(item.id, error));
                    }
                } else {
                    let unexpectedErrorData;
                    if (this.onUnexpectedError) {
                        unexpectedErrorData = this.onUnexpectedError(error);
                    }
                    if (item.id != undefined) {
                        resultList.push(JsonRpcResult.error(item.id, JsonRpcError.internalError(unexpectedErrorData)));
                    }
                }
            }
        }
        if (bodyIsArray) {
            return resultList;
        }
        return resultList[0] || null;
    }
}