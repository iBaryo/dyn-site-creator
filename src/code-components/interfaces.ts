import {CodeNode, ConfigNode} from "../ConfigurationTypes";
import {NodeInstallers} from "../node-installers/NodeInstallers";

export interface IContext {
    app: Express.Application;
    config: ConfigNode;
    installers: NodeInstallers
}

export interface ICodeActivator<T> {
    activate(): Promise<T>
}

export interface IBackendActivator extends ICodeActivator<any> {
}

export interface IFrontendActivator extends ICodeActivator<string> {
    activate(req?: Express.Request): Promise<string>
}

export interface ICodeComponent<T extends ICodeActivator<any>> {
    install(options: CodeNode): T;
}

export interface IBackendCodeComponent extends ICodeComponent<IBackendActivator> {
}

export interface IFrontendCodeComponent extends ICodeComponent<IFrontendActivator> {
}

export interface IContextConstructorOf<T extends ICodeComponent<any>> {
    new(context: IContext): T;
}