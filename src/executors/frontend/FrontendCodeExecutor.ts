import {CodeExecutor, IFrontendCodeExecutor} from "../../CodeExecutor";
import {CodeNode} from "../../ConfigurationTypes";

export abstract class FrontendCodeExecutor extends CodeExecutor implements IFrontendCodeExecutor{
    protected abstract setupFunction(fn: Function, options: CodeNode): Promise<string>;

    protected getFn(code : string) {
        try {
            super.getFn(code);
        }
        catch (e) {
            return () => code;
        }
    }
}