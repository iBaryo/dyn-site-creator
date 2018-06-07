import {CodeFactory} from "../CodeFactory";
import {FrontendInstaller} from "./FrontendInstaller";
import {BackendInstaller} from "./BackendInstaller";
import {IBackendCodeComponent, IContext, IFrontendCodeComponent} from "../code-components/interfaces";
export interface IFullstack<B, F> {
    backend: B,
    frontend: F
}

export class NodeInstallers implements IFullstack<BackendInstaller, FrontendInstaller> {
    public backend: BackendInstaller;
    public frontend: FrontendInstaller;

    constructor(context: IContext,
                backendFactory: CodeFactory<IBackendCodeComponent>,
                frontendFactory: CodeFactory<IFrontendCodeComponent>) {
        this.backend = new BackendInstaller(backendFactory.getInstallers(context));
        this.frontend = new FrontendInstaller(frontendFactory.getInstallers(context));
    }
}