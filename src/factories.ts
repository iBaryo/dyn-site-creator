import {CodeFactory} from "./CodeFactory";
import {CodeInstaller, IFrontendCodeInstaller} from "./installers/CodeInstaller";
import {ServerCodeInstaller} from "./installers/backend/ServerCodeInstaller";
import {HtmlPageInstaller} from "./installers/backend/HtmlPageInstaller";
import {DomInstaller} from "./installers/frontend/DomInstaller";
import {ScriptTagInstaller} from "./installers/frontend/ScriptTagInstaller";
import {JsonEndpointInstaller} from "./installers/backend/JsonEndpointInstaller";


export const backendFactory = new CodeFactory<CodeInstaller>();
backendFactory.addType('server', ServerCodeInstaller);
backendFactory.addType('endpoint', JsonEndpointInstaller);
backendFactory.addType('html', HtmlPageInstaller);

export const frontendFactory = new CodeFactory<IFrontendCodeInstaller>();
frontendFactory.addType('dom', DomInstaller);
frontendFactory.addType('script', ScriptTagInstaller);