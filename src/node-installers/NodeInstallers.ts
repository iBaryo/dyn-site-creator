import {CodeFactory} from "../CodeFactory";
import {FrontendInstaller} from "./FrontendInstaller";
import {BackendInstaller} from "./BackendInstaller";
import {ICodeComponent, IContext, IFrontendCodeComponent} from "../code-components/interfaces";

export class NodeInstallers {
    public backend: BackendInstaller;
    public frontend: FrontendInstaller;

    constructor(context: IContext,
                backendFactory: CodeFactory<ICodeComponent>,
                frontendFactory: CodeFactory<IFrontendCodeComponent>) {
        this.backend = new BackendInstaller(backendFactory.getInstallers(context));
        this.frontend = new FrontendInstaller(frontendFactory.getInstallers(context));
    }
}