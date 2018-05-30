import {CodeNode} from "../ConfigurationTypes";
import {ICodeInstaller, IContext} from "./interfaces";

export abstract class CodeInstaller implements ICodeInstaller {
    constructor(public context: IContext) {
    }

    protected validate(node: CodeNode) {
        if (!node.code) {
            throw 'missing code for node';
        }
    }

    public install(node: CodeNode) {
        this.validate(node);
        const fn = this.getFn(node.code);
        return this.getActivator(fn, node);
    }

    protected getActivator(fn : Function, options: CodeNode) {
        return {
            activate: () => this.run(fn, options)
        };
    }

    protected abstract run(fn: Function, options: CodeNode): Promise<any>;

    protected getFn(code: string): Function {
        const fn = eval(code);
        if (typeof fn !== 'function') {
            throw 'the code is not a function';
        }

        return fn;
    }
}