import {EndpointComponent} from "../EndpointComponent";
import {CodeNode} from "../../../ConfigurationTypes";
import {IFrontendActivator} from "../../interfaces";
import {Express, Response} from "express";
import {defaultHtmlFn} from "./defaults";
import {
    HtmlNode,
    HtmlGeneratorFn,
    IHtmlPageSections,
    IHtmlPageActivator,
    IHtmlPageFrontendActivators, IRequestActivated
} from "./interfaces";
import {FrontendActivatorsCollection} from "./FrontendActivators";

const pretty = require('pretty');

export class HtmlPageComponent extends EndpointComponent {
    public static get typeName() {
        return 'html';
    }

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

    protected getActivator(fn, options: HtmlNode): IHtmlPageActivator {
        const frontendInstaller = this.context.installers.frontend;
        const frontendActivators: IHtmlPageFrontendActivators = {
            head: new FrontendActivatorsCollection(frontendInstaller, options.head),
            body: new FrontendActivatorsCollection(frontendInstaller, options.body),
            activateFor: async function (this: IHtmlPageSections<FrontendActivatorsCollection>, req: Express.Request) {
                return {
                    head: await this.head.activateFor(req),
                    body: await this.body.activateFor(req)
                };
            }
        };

        return {
            frontendActivators,
            activate: (req?) => this.run(options, fn, frontendActivators)
        };
    }

    protected run(options: HtmlNode, fn: HtmlGeneratorFn, frontendActivators?: IRequestActivated<IHtmlPageSections<string[]>>) {
        return super.run(options, async (req, res: Response, config) => {
            const codeContent = await frontendActivators.activateFor(req);

            let html: string;
            try {
                html = await fn(req, config, codeContent);
            }
            catch (e) {
                const msg = `error generating html page '${fn.name}': ${e}`;
                console.log(msg);
                html = msg;
            }
            res.contentType('text/html');
            res.send(pretty(html));
        });
    }
}