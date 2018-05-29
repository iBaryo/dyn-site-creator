import {ServerExecutor} from "./server.executor";
import {CodeNode, ConfigNode} from "../../ConfigurationTypes";
import {Application, Express} from "express";

export interface EndpointNode extends CodeNode {
    name: string;
}

export type EndpointFn = (req: Express.Request, res: Express.Response, config: ConfigNode) => Promise<any>;

export class EndpointExecutor extends ServerExecutor {
    protected validate(node: EndpointNode) {
        if (!node.name) {
            throw 'missing endpoint name';
        }
        super.validate(node);
    }

    protected setupFunction(fn: Function|EndpointFn, options: EndpointNode) {
        return super.setupFunction(async (app : Application, config) => {
            app.get(`/${options.name}`, (req: Express.Request, res: Express.Response) => {
                console.log(`received call to endpoint: ${options.name}`);
                (fn as EndpointFn)(req, res, config);
            });
        }, options);
    }
}