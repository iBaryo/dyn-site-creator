import {EndpointComponent, EndpointNode} from "./EndpointComponent";
import {Request, Response} from "express";
import {ConfigNode} from "../../ConfigurationTypes";

export type JsonEndpointFn = (req: Request, config: ConfigNode) => Promise<any>|any;
export interface JsonEndpointNode extends EndpointNode {
    code: string|JsonEndpointFn
}

export class JsonEndpointComponent extends EndpointComponent {
    public static get typeName() { return 'endpoint'; }

    public run(options: JsonEndpointNode, fn: JsonEndpointFn): Promise<any> {
        return super.run(options, async (req: Request, res: Response, config) => {
            let output: any;
            try {
                output = await fn(req, config);
            }
            catch (e) {
                const msg = `error while invoking endpoint ${options.name}`;
                this.context.logger.log(msg, e);
                output = {msg, e};
            }
            res.contentType('application/json');

            res.send(JSON.stringify(output));
        });
    }
}