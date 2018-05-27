import {ServerExecutor} from "./server.executor";
import {CodeNode, ConfigNode} from "../../ConfigurationTypes";
import {Request, Response} from "express";

export interface EndpointNode extends CodeNode {
    name: string;
}

export type EndpointExecutorFn = (req: Request, res: Response, config: ConfigNode) => Promise<any>;

export class EndpointExecutor extends ServerExecutor {
    public validate(options: EndpointNode) {
        if (!options.name) {
            throw 'missing endpoint name';
        }
        super.validate(options);
    }

    public setup(options: EndpointNode, fn: Function|EndpointExecutorFn) {
        return super.setup(options, async (app, config) => {
            app.get(`/${options.name}`, (req: Request, res: Response) => {
                console.log(`received call to ${options.name}`);
                (fn as EndpointExecutorFn)(req, res, config);
            });
        });
    }
}