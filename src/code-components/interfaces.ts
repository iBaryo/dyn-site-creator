import {CodeNode, ConfigNode} from "../ConfigurationTypes";
import {NodeInstallers} from "../node-installers/NodeInstallers";
import {Express} from "express";
import {ActivatorsReducer} from "../reducers/ActivatorsReducer";

export interface IContext {
    app: Express.Application;
    config: ConfigNode;
    installers: NodeInstallers;
    logger: Console
}

// Activators
export interface ICodeActivator<T> {
    activate(...args): Promise<T>;
    componentType: ICodeComponentType<any>
}

export interface IActivatorsReducerCtor<T> {
    new(): ActivatorsReducer<T>;
}

export interface IValidate {
    validate(node: CodeNode): void;
}
export interface IGetFn {
    getFn(code: string|Function): Function;
}
export interface IGetActivator<T> {
    getActivator(fn : Function, options: CodeNode): ICodeActivator<T>
}

export interface IBackendActivator extends ICodeActivator<any> {
}

export interface IFrontendActivator extends ICodeActivator<string> {
    activate(req: Express.Request): Promise<string>
}

// Components
export interface ICodeComponent<T extends ICodeActivator<any>> {
    install(options: CodeNode): T;
}

export interface IBackendCodeComponent extends ICodeComponent<IBackendActivator> {
}

export interface IFrontendCodeComponent extends ICodeComponent<IFrontendActivator> {
}

export interface ICodeComponentType<T extends ICodeComponent<any>> {
    new(context: IContext): T;
    typeName: string
}