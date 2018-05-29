import {EndpointExecutor, EndpointNode} from "./endpoint.executor";
import {CodeNode, ConfigNode} from "../../ConfigurationTypes";
import {Express,Response} from "express";

export interface HtmlNode extends EndpointNode {
    head: CodeNode[],
    body: CodeNode[]
}

export type HtmlGeneratorFn = (req: Express.Request, config: ConfigNode, codeContent: { head: string[], body: string[] }) => Promise<string>;
const defaultHtmlFn: HtmlGeneratorFn = async (req, config, codeContent) => {
    return `<!DOCTYPE html>
<html>
    <head>
       ${codeContent.head.join('\n\r\r')}         
    </head>
    <body>
       ${codeContent.body.join('\n\r\r')}             
    </body>
</html>
            `;
};


export class HtmlExecutor extends EndpointExecutor {

    protected validate(node: HtmlNode) {
        if (!node.name) {
            throw 'html page missing a name';
        }
        // disabling previous endpoint validations by not calling super
    }

    protected getFn(code: string) {
        if (!code) {
            return defaultHtmlFn;
        }
        return super.getFn(code);
    }

    protected setupFunction(htmlGenFn: HtmlGeneratorFn, options: HtmlNode) {
        return super.setupFunction(async (req, res : Response, config) => {
            const codeContent = {
                head: await this.getFrontendCodes(options.head, req),
                body: await this.getFrontendCodes(options.body, req),
            };

            const html = await htmlGenFn(req, config, codeContent);
            res.send(html);
        }, options);
    }

    private getFrontendCodes(frontendCodeNodes: CodeNode[], req: Express.Request) : Promise<string[]> {
        return Promise.all(frontendCodeNodes.map(async (node) => {
            try {
                return await this._context.getFrontendCode(node, req);
            }
            catch (e) {
                return `<!-- ${e} -->`;
            }
        }));
    }
}