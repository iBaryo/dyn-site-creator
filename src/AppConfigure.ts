import {backendFactory, frontendFactory} from "./factories";
import {CodeNode, ConfigNode} from "./ConfigurationTypes";
import {IContext} from "./code-components/interfaces";
import {NodeInstallers} from "./node-installers/NodeInstallers";

export class AppConfigure implements IContext {
    public config: ConfigNode;
    public code: CodeNode[];
    public installers: NodeInstallers;

    constructor(public app: Express.Application,
                appConfigPath: string,
                installers?: NodeInstallers) {
        const appConfig = this.getConfig(appConfigPath);
        this.config = appConfig.config;
        this.code = appConfig.code;
        this.installers = installers || new NodeInstallers(this, backendFactory, frontendFactory);
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

    public async install(ignoreErrors = false) {
        return await Promise.all(this.code.map(async (node) => {
            try {
                return await this.installers.backend.install(node).activate();
            }
            catch (e) {
                if (ignoreErrors)
                    return undefined;
                else
                    throw e;
            }
        }));
    }
}

export async function install(app: Express.Application, appConfigPath: string) {
    return new AppConfigure(app, appConfigPath).install();
}