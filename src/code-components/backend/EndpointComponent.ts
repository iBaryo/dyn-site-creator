import {ServerCodeComponent} from "./ServerCodeComponent";
import {CodeNode, ConfigNode} from "../../ConfigurationTypes";
import {Application, Express} from "express";

export interface EndpointNode extends CodeNode {
    name: string;
}

export type EndpointFn = (req: Express.Request, res: Express.Response, config: ConfigNode) => Promise<any>;

export class EndpointComponent extends ServerCodeComponent {
    protected validate(node: EndpointNode) {
        if (!node.name) {
            throw 'missing endpoint name';
        }
        super.validate(node);
    }

    protected run(fn: Function|EndpointFn, options: EndpointNode) {
        return super.run(async (app : Application, config) => {
            app.get(`/${options.name}`, (req, res) => {
                console.log(`received call to endpoint: ${options.name}`);
                try {
                    (fn as EndpointFn)(req, res, config);
                }
                catch (e) {
                    console.log(`error executing request for endpoint ${options.name}`, e);
                }
            });
        }, options);
    }
}