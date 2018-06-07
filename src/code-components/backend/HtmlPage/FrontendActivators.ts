import {CodeNode} from "../../../ConfigurationTypes";
import {IRequestActivated} from "./interfaces";
import {FrontendInstaller} from "../../../node-installers/FrontendInstaller";
import {IFrontendActivator} from "../../interfaces";

export class FrontendActivatorsCollection implements IRequestActivated<string[]> {
    private _activators = [];

    constructor(public frontendInstaller: FrontendInstaller, nodes?: CodeNode[]) {
        if (nodes) {
            this.addFromNodes(nodes);
        }
    }

    public addFromNodes(nodes: CodeNode[]) {
        this._activators = this._activators.concat(nodes.map(node => {
            try {
                return this.frontendInstaller.install(node);
            }
            catch (e) {
                return {activate: () => Promise.resolve(`<!-- ${e} -->`)} as IFrontendActivator;
            }
        }));
    }

    public activateFor(req) {
        return Promise.all(this._activators.map(front => front.activate(req)));
    }
}