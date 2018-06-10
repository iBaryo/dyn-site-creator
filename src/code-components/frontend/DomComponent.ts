import {FrontendCodeComponent} from "./FrontendCodeComponent";
import {Express} from "express";
import {ConfigNode} from "../../ConfigurationTypes";

export type DomGeneratorFn = (req: Express.Request, config: ConfigNode) => Promise<string>;
export class DomComponent extends FrontendCodeComponent {
    public static get typeName() { return 'dom'; }

    protected async run(options, fn: DomGeneratorFn|Function, req) {
        try {
            return `<!-- start of ${options.type} node: ${options.desc} -->
${await (fn as DomGeneratorFn)(req, this.context.config)}
<!-- end of ${options.type} node: ${options.desc} -->`;
        }
        catch (e) {
            this.context.logger.log(`error generating ${options.type} frontend node`, e);
            return Promise.resolve(`<!-- error: ${JSON.stringify(e)} -->`);
        }
    }
}