import {CodeFactory} from "./CodeFactory";
import {IFrontendCodeInstaller} from "./installer-types/interfaces";
import {CodeInstaller} from "./installer-types/CodeInstaller";
import {ServerCodeInstaller} from "./installer-types/backend/ServerCodeInstaller";
import {HtmlPageInstaller} from "./installer-types/backend/HtmlPageInstaller";
import {DomInstaller} from "./installer-types/frontend/DomInstaller";
import {ScriptTagInstaller} from "./installer-types/frontend/ScriptTagInstaller";
import {JsonEndpointInstaller} from "./installer-types/backend/JsonEndpointInstaller";


export const backendFactory = new CodeFactory<CodeInstaller>();
backendFactory.addType('server', ServerCodeInstaller);
backendFactory.addType('endpoint', JsonEndpointInstaller);
backendFactory.addType('html', HtmlPageInstaller);

export const frontendFactory = new CodeFactory<IFrontendCodeInstaller>();
frontendFactory.addType('dom', DomInstaller);
frontendFactory.addType('script', ScriptTagInstaller);