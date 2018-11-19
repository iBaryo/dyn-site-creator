import {ActivatorsReducer} from "./ActivatorsReducer";

export class DefaultFrontendReducer extends ActivatorsReducer<string> {
    protected async reduceFn(res: string, cur: string) {
        return [res,cur].join('\n').trim();
    }

    protected getInitValue(): string {
        return '';
    }

}