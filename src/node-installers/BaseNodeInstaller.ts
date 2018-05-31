import {ICodeActivator, ICodeComponent} from "../code-components/interfaces";
import {CodeNode} from "../ConfigurationTypes";

export abstract class BaseNodeInstaller<T extends ICodeComponent<any>> {
    constructor(protected _components: Map<string, T>) {
    }

    public abstract install(node : CodeNode) : ICodeActivator<any>;
}