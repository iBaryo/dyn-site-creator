import {BaseNodeInstaller} from "./BaseNodeInstaller";
import {IBackendActivator, IBackendCodeComponent} from "../code-components/interfaces";
import {CodeNode} from "../ConfigurationTypes";

export class BackendInstaller extends BaseNodeInstaller<IBackendCodeComponent> {
    public defaultType = 'server';

    public install(node : CodeNode) : IBackendActivator {
        const exec = this._installers.get(node.type || this.defaultType);
        try {
            if (!exec) {
                throw `type '${node.type}' is not supported`;
            }
            return exec.install(node);
        }
        catch (e) {
            const msg = `error when setup ${node.type} node: ${e}`;
            throw msg;
        }
    }
}