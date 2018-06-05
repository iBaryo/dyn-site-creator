import {FrontendCodeComponent} from "./FrontendCodeComponent";
import {Express} from "express";
import {ConfigNode} from "../../ConfigurationTypes";

export type DomGeneratorFn = (req: Express.Request, config: ConfigNode) => Promise<string>;
export class DomComponent extends FrontendCodeComponent {
    protected async run(options, fn: DomGeneratorFn|Function, req) {
        try {
            return await (fn as DomGeneratorFn)(req, this.context.config);
        }
        catch (e) {
            return Promise.resolve(`<!-- error: ${JSON.stringify(e)} -->`);
        }
    }
}