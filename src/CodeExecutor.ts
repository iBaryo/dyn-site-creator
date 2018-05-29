import {Express} from "express";
import {CodeNode, ConfigNode} from "./ConfigurationTypes";

export interface ICodeExecutor {
    install(options: CodeNode): Promise<any>;
}

export interface IFrontendCodeExecutor extends ICodeExecutor {
    install(options: CodeNode, req?: Express.Request): Promise<string>;
}

export interface IContext {
    app: Express.Application;
    config: ConfigNode;

    installBackendNode(node: CodeNode): Promise<any>;

    getFrontendCode(node: CodeNode, req: Express.Request): Promise<string>;
}

export interface IContextConstructorOf<T extends ICodeExecutor> {
    new(context: IContext): T;
}

export abstract class CodeExecutor implements ICodeExecutor {
    protected get supportsStrings() {
        return false;
    }

    constructor(protected _context: IContext) {
    }

    protected validate(node: CodeNode) {
        if (!node.code) {
            throw 'missing code for node';
        }
    }

    public install(codeNode: CodeNode): Promise<any> {
        this.validate(codeNode);
        const fn = this.getFn(codeNode.code);
        return this.setupFunction(fn, codeNode);
    }

    protected abstract setupFunction(fn: Function, options: CodeNode): Promise<any>;

    protected getFn(code: string): Function {
        const fn = eval(code);
        if (typeof fn !== 'function') {
            throw 'the code is not a function';
        }

        return fn;
    }
}