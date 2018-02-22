import { JsonRpcError } from "./JsonRpcError";

export class JsonRpcResult {
    static success(id, result) {
        return { jsonrpc: '2.0', id, result };
    }

    static error(id, error: JsonRpcError) {
        return { jsonrpc: '2.0', id, error: error.toJSON() }
    }
}