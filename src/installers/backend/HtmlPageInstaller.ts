import {EndpointInstaller, EndpointNode} from "./EndpointInstaller";
import {CodeNode, ConfigNode} from "../../ConfigurationTypes";
import {Express, Response} from "express";
import {IFrontendActivator} from "../CodeInstaller";

export interface HtmlNode extends EndpointNode {
    head: CodeNode[],
    body: CodeNode[]
}

export type HtmlGeneratorFn = (req: Express.Request, config: ConfigNode, codeContent: { head: string[], body: string[] }) => Promise<string>;
const defaultHtmlFn: HtmlGeneratorFn = async (req, config, codeContent) => {
    return `<!DOCTYPE html>
<html>
    <head>
        <script>
            window.config = ${JSON.stringify(config)}
        </script>
       ${codeContent.head.join('\n\r\r')}         
    </head>
    <body>
       ${codeContent.body.join('\n\r\r')}             
    </body>
</html>
            `;
};


export class HtmlPageInstaller extends EndpointInstaller {

    protected validate(node: HtmlNode) {
        if (!node.name) {
            throw 'html page missing a name';
        }
        // disabling previous validations by not calling super
    }

    protected getFn(code: string) {
        if (!code) {
            return defaultHtmlFn;
        }
        return super.getFn(code);
    }

    protected run(htmlGenFn: HtmlGeneratorFn, options: HtmlNode) {
        const codeActivators = {
            head: this.getFrontendActivators(options.head),
            body: this.getFrontendActivators(options.body),
        };

        return super.run(async (req, res: Response, config) => {
            const codeContent = {
                head: await codeActivators.head.getCode(req),
                body: await codeActivators.body.getCode(req)
            };

            let html : string;
            try {
                html = await htmlGenFn(req, config, codeContent);
            }
            catch (e) {
                const msg = `error generating html page '${options.name}': ${e}`;
                console.log(msg);
                html = msg;
            }
            res.contentType('application/html');
            res.send(html);
        }, options);
    }

    private getFrontendActivators(frontendCodeNodes: CodeNode[] = []) {
        const activators = frontendCodeNodes.map((node) => {
            try {
                return this.context.installFrontendCode(node);
            }
            catch (e) {
                return {activate: () => Promise.resolve(`<!-- ${e} -->`)} as IFrontendActivator;
            }
        });

        return {
            getCode: (req: Express.Request) =>
                Promise.all(activators.map(front => front.activate(req)))
        };
    }
}