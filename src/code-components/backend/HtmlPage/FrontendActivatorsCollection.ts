import {CodeNode} from "../../../ConfigurationTypes";
import {IRequestActivated} from "./interfaces";
import {FrontendInstaller} from "../../../node-installers/FrontendInstaller";
import {IActivatorsReducerCtor, IFrontendActivator} from "../../interfaces";
import any = jasmine.any;
import {ActivatorsReducer} from "../../../reducers/ActivatorsReducer";
import {DefaultFrontendReducer} from "../../../reducers/DefaultFrontendReducer";

export class FrontendActivatorsCollection implements IRequestActivated<string[]> {
    private _activatorReducers = new Map<IActivatorsReducerCtor<any>, ActivatorsReducer<any>>();

    constructor(public frontendInstaller: FrontendInstaller, nodes?: CodeNode[]) {
        if (nodes) {
            this.addFromNodes(nodes);
        }
    }

    public addFromNodes(nodes: CodeNode[]) {
        const activators: IFrontendActivator[] = nodes.map(node => {
            try {
                return this.frontendInstaller.install(node);
            }
            catch (e) {
                return {activate: () => Promise.resolve(`<!-- ${e} -->`)} as IFrontendActivator;
            }
        });

        for (const activator of activators) {
            const reducerType: IActivatorsReducerCtor<string> = activator.forReducer || DefaultFrontendReducer;

            if (!this._activatorReducers.has(reducerType)) {
                this._activatorReducers.set(reducerType, new reducerType());
            }

            this._activatorReducers.get(reducerType).add(activator);
        }
    }

    public activateFor(req) {
        return Promise.all(
            Array.from(this._activatorReducers.values()).map(reducer => reducer.reduce(req))
        );
    }
}