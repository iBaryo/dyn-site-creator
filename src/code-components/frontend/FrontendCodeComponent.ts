import {Express} from "express";
import {CodeComponent} from "../CodeComponent";
import {CodeNode} from "../../ConfigurationTypes";
import {IFrontendCodeComponent} from "../interfaces";

export abstract class FrontendCodeComponent extends CodeComponent implements IFrontendCodeComponent {
    protected validate(node: CodeNode) {
        // overriding previous validations
    }

    protected getFn(code: string) {
        try {
            super.getFn(code);
        }
        catch (e) {
            return () => code || '';
        }
    }

    protected getActivator(fn: Function, options: CodeNode) {
        return {
            activate: (req?: Express.Request) => this.run(options, fn, req)
        };
    }

    // expanding signature to get the request object
    protected abstract run(options: CodeNode, fn: Function, req?: Express.Request): Promise<string>;
}