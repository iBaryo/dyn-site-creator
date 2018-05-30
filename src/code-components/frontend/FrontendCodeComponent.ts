import {Express} from "express";
import {CodeComponent} from "../CodeComponent";
import {CodeNode} from "../../ConfigurationTypes";
import {IFrontendCodeComponent} from "../interfaces";

export abstract class FrontendCodeComponent extends CodeComponent implements IFrontendCodeComponent{
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