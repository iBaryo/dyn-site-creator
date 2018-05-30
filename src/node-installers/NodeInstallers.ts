import {CodeFactory} from "../CodeFactory";
import {FrontendInstaller} from "./FrontendInstaller";
import {BackendInstaller} from "./BackendInstaller";
import {ICodeInstaller, IContext, IFrontendCodeInstaller} from "../installer-types/interfaces";

export class NodeInstallers {
    public backend: BackendInstaller;
    public frontend: FrontendInstaller;

    constructor(context: IContext,
                backendFactory: CodeFactory<ICodeInstaller>,
                frontendFactory: CodeFactory<IFrontendCodeInstaller>) {
        this.backend = new BackendInstaller(backendFactory.getInstallers(context));
        this.frontend = new FrontendInstaller(frontendFactory.getInstallers(context));
    }
}