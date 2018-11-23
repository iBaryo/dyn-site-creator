import {CodeNode} from "../ConfigurationTypes";
import {
    IActivatorsReducerCtor, ICodeActivator, ICodeComponent, IContext, IGetActivator, IGetFn,
    IValidate
} from "./interfaces";

export abstract class CodeComponent implements ICodeComponent<any>, IValidate, IGetFn, IGetActivator<any> {
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

    public getFn(code: string|Function): Function {
        if (typeof code == 'function')
            return code;

        const fn = eval(code);
        if (typeof fn !== 'function') {
            throw 'the code is not a function';
        }

        return fn;
    }

    public getActivator(fn : Function, options: CodeNode): ICodeActivator<any> {
        return {
            activate: () => this.run(options, fn),
            forReducer: this.reducerType
        };
    }

    private _reducerType: IActivatorsReducerCtor<any>|undefined;
    protected get reducerType() {
        if (!this._reducerType) {
            this._reducerType = this.forReducer();
        }
        return this._reducerType;
    }

    public forReducer(): IActivatorsReducerCtor<any>|undefined {
        return undefined;
    }

    public abstract run(options: CodeNode, fn: Function): Promise<any>;
}