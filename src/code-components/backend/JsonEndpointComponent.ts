import {EndpointComponent, EndpointNode} from "./EndpointComponent";
import {Response} from "express";

export type JsonEndpointFn = (req, config) => Promise<any>;

export class JsonEndpointComponent extends EndpointComponent {
    protected run(options: EndpointNode, fn: JsonEndpointFn): Promise<any> {
        return super.run(options, async (req, res: Response, config) => {
            let output: any;
            try {
                output = await fn(req, config);
            }
            catch (e) {
                const msg = `error while invoking endpoint ${options.name}`;
                console.log(msg, e);
                output = {msg, e};
            }
            res.contentType('application/json');
            res.send(JSON.stringify(output));
        });
    }
}