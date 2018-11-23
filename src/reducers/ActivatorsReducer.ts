import {ICodeActivator} from "../code-components/interfaces";

export abstract class ActivatorsReducer<T> {
    private _activators = [] as ICodeActivator<T>[];

    public add(...activators: ICodeActivator<T>[]) {
        this._activators = this._activators.concat(activators);
    }

    public async reduce(...args) {
        let res = await this.getInitValue();
        for (const activator of this._activators) {
            const cur = await activator.activate(...args.concat(res));
            res = await this.reduceFn(res, cur);
        }

        return await this.postProcess(res);
    }

    protected async abstract reduceFn(res: T, cur: T): Promise<T>;

    protected async abstract getInitValue(): Promise<T>;

    protected async postProcess(res: T) {
        return res;
    }
}
