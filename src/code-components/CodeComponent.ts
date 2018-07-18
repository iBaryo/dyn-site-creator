import {CodeNode} from "../ConfigurationTypes";
import {ICodeComponent, IContext} from "./interfaces";

export abstract class CodeComponent implements ICodeComponent<any> {
    constructor(public context: IContext) {
    }

    public install(node: CodeNode) {
        this.validate(node);
        const fn = this.getFn(node.code);
        return this.getActivator(fn, node);
    }

    public validate(node: CodeNode) {
        if (!node.code) {
            throw 'missing code for node';
        }
    }

    protected getFn(code: string|Function): Function {
        if (typeof code == 'function')
            return code;

        const fn = eval(code);
        if (typeof fn !== 'function') {
            throw 'the code is not a function';
        }

        return fn;
    }

    protected getActivator(fn : Function, options: CodeNode) {
        return {
            activate: () => this.run(options, fn)
        };
    }

    public abstract run(options: CodeNode, fn: Function): Promise<any>;
}