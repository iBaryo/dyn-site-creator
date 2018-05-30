import {BaseNodeInstaller} from "./BaseNodeInstaller";
import {CodeNode} from "../ConfigurationTypes";
import {IFrontendActivator, IFrontendCodeInstaller} from "../installer-types/interfaces";

export class FrontendInstaller extends BaseNodeInstaller<IFrontendCodeInstaller> {
    public install(node : CodeNode) : IFrontendActivator {
        if (!this._installers.has(node.type)) {
            if (!node.code) {
                throw 'empty unknown node';
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
                console.log(msg);
                throw msg;
            }
        }
    }
}