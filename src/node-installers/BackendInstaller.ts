import {BaseNodeInstaller} from "./BaseNodeInstaller";
import {IBackendActivator, IBackendCodeComponent} from "../code-components/interfaces";
import {CodeNode} from "../ConfigurationTypes";

export class BackendInstaller extends BaseNodeInstaller<IBackendCodeComponent> {
    public defaultType = 'server';

    public install(node : CodeNode) : IBackendActivator {
        node.type = node.type || this.defaultType;
        const component = this._components.get(node.type);
        try {
            if (!component) {
                throw `type is not supported`;
            }
            return component.install(node);
        }
        catch (e) {
            throw `error when installing ${node.type} node: ${e}`;
        }
    }
}