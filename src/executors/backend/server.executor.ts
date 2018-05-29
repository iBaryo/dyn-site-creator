import {CodeExecutor} from "../../CodeExecutor";
import {ConfigNode} from "../../ConfigurationTypes";
import {Express} from "express";

export type ServerFn = (app: Express.Application, config: ConfigNode) => Promise<any>;

export class ServerExecutor extends CodeExecutor {
    protected setupFunction(fn : ServerFn, options) {
        console.log(`setup of ${options.type} node: ${options.desc}`);
        return fn(this._context.app, this._context.config);
    }
}