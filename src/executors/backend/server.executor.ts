import {CodeExecutor} from "../../CodeExecutor";
import {CodeNode, ConfigNode} from "../../ConfigurationTypes";
import {Application} from "express";

export type ServerExecutorFn = (app: Application, config: ConfigNode) => Promise<any>;

export class ServerExecutor extends CodeExecutor {
    public async setup(options: CodeNode, fn: ServerExecutorFn) {
        console.log(`setup of ${options.type} node: ${options.desc}`);
        return await fn(this._app, this._config);
    }
}