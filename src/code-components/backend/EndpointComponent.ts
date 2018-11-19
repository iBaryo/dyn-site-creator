import {ServerCodeComponent} from "./ServerCodeComponent";
import {CodeNode, ConfigNode} from "../../ConfigurationTypes";
import {Application, Express} from "express";
import {IActivatorsReducerCtor, IBackendActivator, ICodeActivator} from "../interfaces";

export type EndpointFn = (req: Express.Request, res: Express.Response, config: ConfigNode) => Promise<any>;

export interface EndpointNode extends CodeNode {
    name: string;
    code: string | EndpointFn
}

export const endPointActivators = new Map<string, IBackendActivator>();

export class EndpointComponent extends ServerCodeComponent {
    public static get typeName() {
        return 'organicEndpoint';
    }


    public install(node: EndpointNode) {
        const activator = super.install(node);
        endPointActivators.set(node.name, activator);
        return activator;
    }

    public validate(node: EndpointNode) {
        if (!node.name) {
            throw 'missing endpoint name';
        }
        super.validate(node);
    }

    public run(options: EndpointNode, fn: Function | EndpointFn) {
        return super.run(options, async (app: Application, config) => {
            return app.get(`/${options.name}`, async (req, res) => {
                this.context.logger.log(`received call to endpoint: ${options.name}`);
                try {
                    await (fn as EndpointFn)(req, res, config);
                }
                catch (e) {
                    this.context.logger.log(`error executing request for endpoint ${options.name}`, e);
                }
            });
        });
    }
}