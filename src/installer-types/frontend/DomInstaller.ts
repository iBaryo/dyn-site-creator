import {FrontendCodeInstaller} from "./FrontendCodeExecutor";
import {Express} from "express";
import {CodeNode, ConfigNode} from "../../ConfigurationTypes";

export type DomGeneratorFn = (req: Express.Request, config: ConfigNode) => Promise<string>;
export class DomInstaller extends FrontendCodeInstaller {
    protected async run(fn: DomGeneratorFn|Function, options, req) {
        try {
            return await (fn as DomGeneratorFn)(req, this.context.config);
        }
        catch (e) {
            return Promise.resolve(`<!-- error: ${JSON.stringify(e)} -->`);
        }
    }
}