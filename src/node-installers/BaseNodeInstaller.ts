import {ICodeActivator, ICodeComponent, ICodeComponentType} from "../code-components/interfaces";
import {CodeNode} from "../ConfigurationTypes";

export abstract class BaseNodeInstaller<T extends ICodeComponent<any>> {
    constructor(protected _components: Map<string, T>) {
    }

    public getComponent<S extends T>(type: string|ICodeComponentType<S>) {
        const typeStr: string = typeof type == 'string' ? type : type.typeName;
        return this._components.get(typeStr) as S;
    }

    public abstract install(node : CodeNode) : ICodeActivator<any>;
}