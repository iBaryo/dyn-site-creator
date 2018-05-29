import {backendFactory, frontendFactory} from "./factories";
import {CodeNode, ConfigNode} from "./ConfigurationTypes";
import {ICodeExecutor, IContext, IFrontendCodeExecutor} from "./CodeExecutor";

interface IAppConfig {
    config: ConfigNode[],
    code: CodeNode[]
}

export class AppConfigure implements IContext {
    private _backendExecuters: Map<string, ICodeExecutor>;
    private _frontendExecuters: Map<string, IFrontendCodeExecutor>;
    public config: ConfigNode;
    public code: CodeNode[];

    constructor(public app: Express.Application,
                appConfigPath: string,
                backFactory = backendFactory,
                frontFactory = frontendFactory) {
        const appConfig = this.getConfig(appConfigPath);
        this.config = appConfig.config;
        this.code = appConfig.code;
        this._backendExecuters = backFactory.getCodeExecutors(this);
        this._frontendExecuters = frontFactory.getCodeExecutors(this);
    }

    public install() {
        return Promise.all(this.code.map(async (node) => {
            try {
                return await this.installBackendNode(node);
            }
            catch (e) {
                return undefined;
            }
        }));
    }

    public async installBackendNode(node: CodeNode) : Promise<any> {
        const exec = this._backendExecuters.get(node.type || 'server');
        try {
            if (!exec) {
                throw 'type is not supported';
            }
            return await exec.install(node);
        }
        catch (e) {
            const msg = `error when setup ${node.type} node: ${e}`;
            console.log(msg);
            throw msg;
        }
    }

    public async getFrontendCode(node: CodeNode, req: Express.Request) : Promise<string> {
        if (!this._frontendExecuters.has(node.type)) {
            if (!node.code) {
                throw 'empty unknown node';
            }
            return Promise.resolve(node.code);
        }
        else {
            const exec = this._frontendExecuters.get(node.type);
            try {
                return await exec.install(node, req);
            }
            catch (e) {
                const msg = `error generating frontend ${node.type} code for '${node.desc}: ${e}`;
                console.log(msg);
                throw msg;
            }
        }
    }

    private getConfig(path: string) {
        try {
            const rawConfig: IAppConfig = require(path);
            return {
                config: Object.assign({}, ...rawConfig.config) as ConfigNode,
                code: rawConfig.code
            };
        }
        catch (e) {
            throw `error reading settings file from ${path}`;
        }
    }
}

export async function install(app: Express.Application, appConfigPath: string) {
    return new AppConfigure(app, appConfigPath).install()
}