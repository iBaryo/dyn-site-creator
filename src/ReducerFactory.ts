import {IActivatorsReducerCtor, ICodeActivator, ICodeComponent, ICodeComponentType} from './code-components/interfaces';

export class ReducerFactory {
    private _reducerMap = new Map<IActivatorsReducerCtor<any>, Set<ICodeComponentType<any>>>();

    constructor() {

    }

    public register<T>(reducerType: IActivatorsReducerCtor<T>,
                       cmpType: ICodeComponentType<ICodeComponent<ICodeActivator<T>>>) {

        let cmpTypeCollection = this._reducerMap.get(reducerType);

        if (cmpTypeCollection) {
            cmpTypeCollection.add(cmpType);
        }
        else {
            cmpTypeCollection = new Set([cmpType]);
            this._reducerMap.set(reducerType, cmpTypeCollection);
        }
    }

    public getReducerFor<T extends ICodeComponent<any>>(cmpType: ICodeComponentType<T>): IActivatorsReducerCtor<T> {
        for (let [reducerType, cmpTypeCollection] of this._reducerMap.entries()) {
            if (cmpTypeCollection.has(cmpType)) {
                return reducerType;
            }
        }
        return undefined;
    }
}