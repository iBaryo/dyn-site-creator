import {ICodeInstaller, IContext, IContextConstructorOf} from "./installers/interfaces";

export class CodeFactory<T extends ICodeInstaller>{
    private _lib = new Map<string, IContextConstructorOf<T>>();

    public addType(type: string, execCtor: IContextConstructorOf<T>, override = false) {
        if (this._lib.has(type) && !override) {
            throw `type ${type} already exists`;
        }
        this._lib.set(type, execCtor);
    }

    public getInstallers(context: IContext): Map<string, T> {
        const execLib = new Map<string, T>();
        this._lib.forEach(
            (execCtor, type) => execLib.set(type, new execCtor(context))
        );

        // todo: default val?

        return execLib;
    }


    // public get(type: string, defaultExec?: IContextConstructorOf | string) {
    //     return this._lib.get(type)
    //         || (typeof defaultExec == 'string' ? this._lib.get(defaultExec) : defaultExec);
    // }
}
