import {CodeComponent} from "../CodeComponent";
import {ConfigNode} from "../../ConfigurationTypes";
import {Express} from "express";
import {IBackendCodeComponent} from "../interfaces";

export type ServerCodeFn = (app: Express.Application, config: ConfigNode) => Promise<any>;

export class ServerCodeComponent extends CodeComponent implements IBackendCodeComponent{
    protected run(fn: ServerCodeFn, options) {
        console.log(`setup of ${options.type} node: ${options.desc}`);
        try {
            return fn(this.context.app, this.context.config);
        }
        catch (e) {
            console.log(`error executing ${options.type} node: ${options.desc}`, e);
            return Promise.resolve();
        }
    }
}