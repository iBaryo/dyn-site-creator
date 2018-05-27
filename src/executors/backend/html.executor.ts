import {EndpointExecutor, EndpointNode} from "./endpoint.executor";

export interface HtmlNode extends EndpointNode {
    head: any[],
    body: any[]
}

export class HtmlExecutor extends EndpointExecutor {
    public setup(options: HtmlNode, /*not in used*/ fn: Function) {
        return super.setup(options, async (req, res, config) => {
            res.send(`<!DOCTYPE html>
<html>
    <head>
       ${options.head.map(code => code.toString()).join('\n\r\r')}         
    </head>
    <body>
       ${options.body.map(code => code.toString()).join('\n\r\r')}             
    </body>
</html>
            `);
        });
    }
}