import {ICodeExecutorConstructor} from "./CodeExecutor";

export class CodeFactory {
    private _lib = new Map<string, ICodeExecutorConstructor>();

    public set(type: string, executor: ICodeExecutorConstructor, override = false) {
        if (this._lib.has(type) && !override) {
            throw `type ${type} already exists`;
        }
        this._lib.set(type, executor);
    }

    public get(type: string, defaultExec?: ICodeExecutorConstructor|string) {
        return this._lib.get(type)
            || (typeof defaultExec == 'string' ? this._lib.get(defaultExec) : defaultExec);
    }
}

export const backendFactory = new CodeFactory();
export const frontendFactory = new CodeFactory();