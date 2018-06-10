import {CodeComponent} from "../CodeComponent";
import {ConfigNode} from "../../ConfigurationTypes";
import {Express} from "express";
import {IBackendCodeComponent} from "../interfaces";

export type ServerCodeFn = (app: Express.Application, config: ConfigNode) => Promise<any>;

export class ServerCodeComponent extends CodeComponent implements IBackendCodeComponent{
    public static get typeName() { return 'server'; }

    protected async run(options, fn: ServerCodeFn) {
        // this.context.logger.log(`installing ${options.type} node: ${options.desc}`);

        try {
            const res = await fn(this.context.app, this.context.config);
            this.context.logger.log(`installed ${options.type} node: ${options.desc}`);
            return res;
        }
        catch (e) {
            const msg = `error executing ${options.type} node: ${options.desc}`;
            this.context.logger.log(msg, e);
            throw msg;
        }
    }
}