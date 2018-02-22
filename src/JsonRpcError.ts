export class JsonRpcError extends Error {
    code: number;
    data: any;

    static readonly CODE_ALERT = 30001;

    constructor(code, message, data?) {
        super(message);
        this.code = code;
        this.data = data;
    }

    static parseError() {
        return new JsonRpcError(-32700, 'Parse error');
    }

    static invalidRequest(data?) {
        return new JsonRpcError(-32600, 'Invalid Request', data);
    }

    static methodNotFound() {
        return new JsonRpcError(-32601, 'Method not found');
    }

    static invalidParams(data?) {
        return new JsonRpcError(-32602, 'Invalid params', data);
    }

    static internalError(data?) {
        return new JsonRpcError(-32603, 'Internal error', data);
    }

    static alert(message: string, data?) {
        return new JsonRpcError(this.CODE_ALERT, message, data);
    }

    toJSON() {
        return { code: this.code, message: this.message, data: this.data };
    }
}