import {Express} from "express";
import {CodeComponent} from "../CodeComponent";
import {CodeNode} from "../../ConfigurationTypes";
import {IActivatorsReducerCtor, ICodeActivator, IFrontendActivator, IFrontendCodeComponent} from "../interfaces";

export abstract class FrontendCodeComponent extends CodeComponent implements IFrontendCodeComponent {
    public validate(node: CodeNode) {
        // overriding previous validations
    }

    public getFn(code: string, allowString = true): Function {
        try {
            return super.getFn(code);
        }
        catch (e) {
            if (allowString)
                return () => code || '';
            else
                throw e;
        }
    }

    public getActivator(fn: Function, options: CodeNode): IFrontendActivator {
        return Object.assign(super.getActivator(fn, options), {
            activate: (req: Express.Request) => this.run(options, fn, req),
        }) as IFrontendActivator;
    }

    // expanding signature to get the request object
    public abstract run(options: CodeNode, fn: Function, req?: Express.Request): Promise<string>;
}