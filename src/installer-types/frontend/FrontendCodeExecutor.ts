import {Express} from "express";
import {CodeInstaller} from "../CodeInstaller";
import {CodeNode} from "../../ConfigurationTypes";
import {IFrontendCodeInstaller} from "../interfaces";

export abstract class FrontendCodeInstaller extends CodeInstaller implements IFrontendCodeInstaller{
    protected abstract run(fn: Function, options: CodeNode, req?: Express.Request): Promise<string>;

    protected getActivator(fn: Function, options: CodeNode) {
        return {
            activate: (req?: Express.Request) => this.run(fn, options, req)
        };
    }

    protected getFn(code : string) {
        try {
            super.getFn(code);
        }
        catch (e) {
            return () => code || '';
        }
    }
}