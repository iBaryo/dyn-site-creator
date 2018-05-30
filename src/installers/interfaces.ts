import {CodeNode, ConfigNode} from "../ConfigurationTypes";

export interface IContext {
    app: Express.Application;
    config: ConfigNode;

    installBackendNode(node: CodeNode): IBackendActivator;

    installFrontendCode(node: CodeNode): IFrontendActivator;
}

export interface ICodeActivator<T> {
    activate() : Promise<T>
}

export interface IBackendActivator extends ICodeActivator<any> {}
export interface IFrontendActivator extends ICodeActivator<string> {
    activate(req?: Express.Request) : Promise<string>
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