import {Application} from "express";
import {CodeNode} from "./ConfigurationTypes";

export interface ICodeExecutorConstructor {
    new(app, config): ICodeExecutor;

    supportsStrings: boolean;
}

export interface ICodeExecutor {
    validate(options: CodeNode): void;

    setup(options: CodeNode, fn: Function): Promise<any>;
}

export abstract class CodeExecutor implements ICodeExecutor {
    constructor(protected _app: Application, protected _config) {
    }

    public validate(options: CodeNode) {
    }

    public abstract setup(options: CodeNode, fn: Function): Promise<any>;

    public static get supportsStrings() {
        return false;
    }
}