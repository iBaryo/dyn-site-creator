import {BaseNodeInstaller} from "./BaseNodeInstaller";
import {CodeNode} from "../ConfigurationTypes";
import {IFrontendActivator, IFrontendCodeComponent} from "../code-components/interfaces";

export class FrontendInstaller extends BaseNodeInstaller<IFrontendCodeComponent> {
    public install(node : CodeNode) : IFrontendActivator {
        if (!this._installers.has(node.type)) {
            if (!node.code) {
                throw 'empty unknown frontend node';
            }
            return {activate: () => Promise.resolve(node.code)};
        }
        else {
            const exec = this._installers.get(node.type);
            try {
                return exec.install(node);
            }
            catch (e) {
                const msg = `error generating frontend ${node.type} code for '${node.desc}: ${e}`;
                throw msg;
            }
        }
    }
}