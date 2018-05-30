import {CodeFactory} from "../CodeFactory";
import {FrontendInstaller} from "./FrontendInstaller";
import {BackendInstaller} from "./BackendInstaller";
import {IBackendCodeComponent, IContext, IFrontendCodeComponent} from "../code-components/interfaces";

export class NodeInstallers {
    public backend: BackendInstaller;
    public frontend: FrontendInstaller;

    constructor(context: IContext,
                backendFactory: CodeFactory<IBackendCodeComponent>,
                frontendFactory: CodeFactory<IFrontendCodeComponent>) {
        this.backend = new BackendInstaller(backendFactory.getInstallers(context));
        this.frontend = new FrontendInstaller(frontendFactory.getInstallers(context));
    }
}