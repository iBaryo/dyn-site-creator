import {CodeNode} from "../../../ConfigurationTypes";
import {IRequestActivated} from "./interfaces";
import {FrontendInstaller} from "../../../node-installers/FrontendInstaller";
import {IActivatorsReducerCtor, IFrontendActivator} from "../../interfaces";
import {ActivatorsReducer} from "../../../reducers/ActivatorsReducer";
import {DefaultFrontendReducer} from "../../../reducers/DefaultFrontendReducer";
import {reducersFactory} from "../../../factories";
import {ReducerFactory} from "../../../ReducerFactory";

export class FrontendActivatorsCollection implements IRequestActivated<string[]> {
    private _activatorReducers = new Map<IActivatorsReducerCtor<any>, ActivatorsReducer<any>>();

    constructor(public frontendInstaller: FrontendInstaller, nodes?: CodeNode[], private _reducerFactory: ReducerFactory = reducersFactory) {
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
                return {
                    activate: () => Promise.resolve(`<!-- ${e} -->`),
                    componentType: undefined
                } as IFrontendActivator;
            }
        });

        for (const activator of activators) {

            const reducerType: IActivatorsReducerCtor<string> =
                this._reducerFactory.getReducerFor(activator.componentType) || DefaultFrontendReducer;

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