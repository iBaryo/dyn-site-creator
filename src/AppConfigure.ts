import {backendFactory, frontendFactory} from "./factories";
import {CodeNode, ConfigNode} from "./ConfigurationTypes";
import {
    ICodeInstaller, IFrontendActivator,
    IBackendActivator, IFrontendCodeInstaller
} from "./installers/CodeInstaller";

export interface IContext {
    app: Express.Application;
    config: ConfigNode;

    installBackendNode(node: CodeNode): IBackendActivator;

    installFrontendCode(node: CodeNode): IFrontendActivator;
}

export class AppConfigure implements IContext {
    private _backendInstallers: Map<string, ICodeInstaller>;
    private _frontendInstallers: Map<string, IFrontendCodeInstaller>;
    public config: ConfigNode;
    public code: CodeNode[];

    constructor(public app: Express.Application,
                appConfigPath: string) {
        const appConfig = this.getConfig(appConfigPath);
        this.config = appConfig.config;
        this.code = appConfig.code;
    }

    public async install(backFactory = backendFactory,
                   frontFactory = frontendFactory) {
        this._backendInstallers = backFactory.getInstallers(this);
        this._frontendInstallers = frontFactory.getInstallers(this);
        // await Array.from(this._backendExecuters.values()).map(back => back.install())
        return await Promise.all(this.code.map(async (node) => {
            try {
                return await this.installBackendNode(node).activate();
            }
            catch (e) {
                return undefined;
            }
        }));
    }

    public installBackendNode(node: CodeNode) {
        const exec = this._backendInstallers.get(node.type || 'server');
        try {
            if (!exec) {
                throw 'type is not supported';
            }
            return exec.install(node);
        }
        catch (e) {
            const msg = `error when setup ${node.type} node: ${e}`;
            console.log(msg);
            throw msg;
        }
    }

    public installFrontendCode(node: CodeNode) {
        if (!this._frontendInstallers.has(node.type)) {
            if (!node.code) {
                throw 'empty unknown node';
            }
            return {activate: () => Promise.resolve(node.code)};
        }
        else {
            const exec = this._frontendInstallers.get(node.type);
            try {
                return exec.install(node);
            }
            catch (e) {
                const msg = `error generating frontend ${node.type} code for '${node.desc}: ${e}`;
                console.log(msg);
                throw msg;
            }
        }
    }

    private getConfig(path: string) {
        let rawConfig: {
            config: ConfigNode[],
            code: CodeNode[]
        };

        try {
            rawConfig = require(path);
        }
        catch (e) {
            throw `error reading appConfig file from ${path}: ${e}`;
        }

        if (!rawConfig || !rawConfig.code || !rawConfig.code.length) {
            throw 'code section required in appConfig';
        }
        if (!rawConfig.config) {
            rawConfig.config = [];
        }

        return {
            config: Object.assign({}, ...rawConfig.config) as ConfigNode,
            code: rawConfig.code
        };
    }
}

export async function install(app: Express.Application, appConfigPath: string) {
    return new AppConfigure(app, appConfigPath).install();
}