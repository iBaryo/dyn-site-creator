import {ICodeActivator, ICodeInstaller} from "../installer-types/interfaces";
import {CodeNode} from "../ConfigurationTypes";

export abstract class BaseNodeInstaller<T extends ICodeInstaller> {
    constructor(protected _installers: Map<string, T>) {
    }

    public abstract install(node : CodeNode) : ICodeActivator<any>;
}