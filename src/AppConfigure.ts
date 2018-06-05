import {backendFactory, frontendFactory} from "./factories";
import {CodeNode, ConfigNode} from "./ConfigurationTypes";
import {IContext} from "./code-components/interfaces";
import {NodeInstallers} from "./node-installers/NodeInstallers";

export interface IAppConfig {
    config?: ConfigNode[],
    code: CodeNode[]
}

export class AppConfigure implements IContext {
    public config: ConfigNode;
    public code: CodeNode[];
    public installers: NodeInstallers;

    constructor(public app: Express.Application,
                appConfig: string | IAppConfig,
                installers?: NodeInstallers,
                private _loadAppConfigFrom = (path: string) => require(path) as IAppConfig) {
        if (typeof appConfig == 'string') {
            appConfig = this.getAppConfig(appConfig);
        }
        this.validateAppConfig(appConfig);

        this.config = Object.assign({}, ...(appConfig.config || [])) as ConfigNode;
        this.code = appConfig.code;
        this.installers = installers || new NodeInstallers(this, backendFactory, frontendFactory);
    }

    private getAppConfig(path: string) {
        try {
            return this._loadAppConfigFrom(path) as IAppConfig;
        }
        catch (e) {
            throw `error reading appConfig file from ${path}: ${e}`;
        }
    }

    private validateAppConfig(rawConfig: IAppConfig) {
        if (!rawConfig || !rawConfig.code || !rawConfig.code.length) {
            throw 'code section required in appConfig';
        }
    }

    public async install(ignoreErrors = false) {
        return await Promise.all(this.code.map(async (node) => {
            try {
                return await this.installers.backend.install(node).activate();
            }
            catch (e) {
                console.log(e);

                if (ignoreErrors)
                    return undefined;
                else
                    throw 'error while installing';
            }
        }));
    }
}

export async function installComponents(app: Express.Application, appConfigPath: string) {
    return new AppConfigure(app, appConfigPath).install();
}