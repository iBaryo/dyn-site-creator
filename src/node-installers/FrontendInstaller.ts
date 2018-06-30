import {BaseNodeInstaller} from "./BaseNodeInstaller";
import {CodeNode} from "../ConfigurationTypes";
import {IFrontendActivator, IFrontendCodeComponent} from "../code-components/interfaces";

export class FrontendInstaller extends BaseNodeInstaller<IFrontendCodeComponent> {
    public install(node : CodeNode) : IFrontendActivator {
        if (!this._components.has(node.type)) {
            if (!node.code) {
                throw `empty unknown frontend node (${node.desc || 'no description'})`;
            }
            return {activate: () => Promise.resolve(node.code.toString())};
        }
        else {
            try {
                return this._components.get(node.type).install(node);
            }
            catch (e) {
                throw `error installing frontend ${node.type} code for '${node.desc}': ${e}`;
            }
        }
    }
}