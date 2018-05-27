
import {backendFactory} from "./CodeFactory";
import {CodeNode, ConfigNode} from "./ConfigurationTypes";

interface IRawConfig {
    config: ConfigNode[],
    code: CodeNode[]
}

export async function configure(app: Express.Application, path: string, codeFactory = backendFactory) {
    const {config, code} = getConfig(path);

    const codeSetups = code.map(node => {
        const execCtor = codeFactory.get(node.type || 'server');
        if (execCtor) {
            const exec = new execCtor(app, config);

            try {
                exec.validate(node);
                const fn = getFn(node.code, execCtor.supportsStrings);
                return exec.setup(node, fn);
            }
            catch (e) {
                console.log(`error when setup ${node.type} node: ${e}`);
                return Promise.resolve();
            }
        }
    });

    await Promise.all(codeSetups);
}

function getConfig(path: string) {
    const rawConfig: IRawConfig = require(path);
    return {
        config: Object.assign({}, ...rawConfig.config) as ConfigNode,
        code: rawConfig.code
    };
}

function getFn(code : string, supportsStrings : boolean) {
    let fn: Function;

    try {
        fn = eval(code);
        if (typeof fn !== 'function') {
            throw 'the code is not a function';
        }
    }
    catch (e) {
        if (supportsStrings) {
            fn = () => code;
        }
        else {
            throw e;
        }
    }

    return fn;
}