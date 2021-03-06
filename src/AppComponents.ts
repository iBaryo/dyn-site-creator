import {backendFactory, frontendFactory} from "./factories";
import {CodeNode, ConfigNode} from "./ConfigurationTypes";
import {IContext} from "./code-components/interfaces";
import {NodeInstallers} from "./node-installers/NodeInstallers";

export interface IAppComponentsConfig {
    config?: ConfigNode[];
    code: CodeNode[];
}

export class AppComponents implements IContext {
    public config: ConfigNode;
    public code: CodeNode[];
    public installers: NodeInstallers;

    constructor(public app: Express.Application,
                appConfig: string | IAppComponentsConfig,
                installers?: NodeInstallers,
                private _loadAppConfigFrom = (path: string) => require(path) as IAppComponentsConfig,
                public logger = console) {
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
            return this._loadAppConfigFrom(path) as IAppComponentsConfig;
        }
        catch (e) {
            throw `error reading appConfig file from ${path}: ${e}`;
        }
    }

    private validateAppConfig(rawConfig: IAppComponentsConfig) {
        if (!rawConfig || !rawConfig.code || !rawConfig.code.length) {
            throw 'code section required in appConfig';
        }
    }

    public async install(ignoreErrors = false) {
        const cmps = this.code.map((node) => {
            try {
                return this.installers.backend.install(node);
            }
            catch (e) {
                this.logger.log(e);

                if (ignoreErrors)
                    return undefined;
                else
                    throw 'error while installing';
            }
        }).filter(cmp => cmp);

        return await Promise.all(cmps.map(async (cmp) => {
            try {
                return await cmp.activate();
            }
            catch (e) {
                this.logger.log(e);

                if (ignoreErrors)
                    return undefined;
                else
                    throw 'error while activating';
            }
        }));
    }
}

export async function installComponents(app: Express.Application, appConfigPath: string) {
    return new AppComponents(app, appConfigPath).install();
}