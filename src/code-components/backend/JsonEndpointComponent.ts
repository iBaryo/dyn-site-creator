import {EndpointFn, EndpointComponent, EndpointNode} from "./EndpointComponent";
import {Response} from "express";

export type JsonEndpointFn = (req, config) => Promise<any>;

export class JsonEndpointComponent extends EndpointComponent {
    protected run(fn: JsonEndpointFn, options: EndpointNode) {
        return super.run(async (req, res: Response, config) => {
            res.contentType('application/json');
            let output: any;
            try {
                output = await fn(req, config);
            }
            catch (e) {
                const msg = `error while invoking endpoint ${options.name}`;
                console.log(msg, e);
                output = {msg, e};
            }

            res.send(JSON.stringify(output));
        }, options);
    }
}