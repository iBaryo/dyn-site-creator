import {ICodeComponent, IContext, ICodeComponentType} from "./code-components/interfaces";

export class CodeFactory<T extends ICodeComponent<any>>{
    private _lib = new Map<string, ICodeComponentType<T>>();

    public addType(cmpType: ICodeComponentType<T>, override = false) {
        if (this._lib.has(cmpType.typeName) && !override) {
            throw `type ${cmpType.typeName} already exists`;
        }
        this._lib.set(cmpType.typeName, cmpType);
    }

    public getInstallers(context: IContext): Map<string, T> {
        const execLib = new Map<string, T>();
        this._lib.forEach(
            (execCtor, type) => execLib.set(type, new execCtor(context))
        );

        return execLib;
    }


    // public get(type: string, defaultExec?: ICodeComponentType | string) {
    //     return this._lib.get(type)
    //         || (typeof defaultExec == 'string' ? this._lib.get(defaultExec) : defaultExec);
    // }
}
