import {CodeComponent} from "../CodeComponent";
import {ConfigNode} from "../../ConfigurationTypes";
import {Express} from "express";

export type ServerCodeFn = (app: Express.Application, config: ConfigNode) => Promise<any>;

export class ServerCodeComponent extends CodeComponent {
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