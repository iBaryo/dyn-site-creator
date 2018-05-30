import {CodeNode, ConfigNode} from "../ConfigurationTypes";
import {BackendInstaller} from "../node-installers/BackendInstaller";
import {FrontendInstaller} from "../node-installers/FrontendInstaller";
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

export interface ICodeInstaller {
    install(options: CodeNode): IBackendActivator;
}

export interface IFrontendCodeInstaller extends ICodeInstaller {
    install(options: CodeNode): IFrontendActivator;
}

export interface IContextConstructorOf<T extends ICodeInstaller> {
    new(context: IContext): T;
}