import {CodeComponent} from "../CodeComponent";
import {ConfigNode} from "../../ConfigurationTypes";
import {Express} from "express";
import {IBackendCodeComponent} from "../interfaces";

export type ServerCodeFn = (app: Express.Application, config: ConfigNode) => Promise<any>;

export class ServerCodeComponent extends CodeComponent implements IBackendCodeComponent{
    protected async run(options, fn: ServerCodeFn) {
        console.log(`setup of ${options.type} node: ${options.desc}`);
        try {
            return await fn(this.context.app, this.context.config);
        }
        catch (e) {
            const msg = `error executing ${options.type} node: ${options.desc}`;
            console.log(msg, e);
            throw msg;
        }
    }
}