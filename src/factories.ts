import {CodeFactory} from "./CodeFactory";
import {IFrontendCodeComponent} from "./code-components/interfaces";
import {CodeComponent} from "./code-components/CodeComponent";
import {ServerCodeComponent} from "./code-components/backend/ServerCodeComponent";
import {HtmlPageComponent} from "./code-components/backend/HtmlPageComponent";
import {DomComponent} from "./code-components/frontend/DomComponent";
import {ScriptTagComponent} from "./code-components/frontend/ScriptTagComponent";
import {JsonEndpointComponent} from "./code-components/backend/JsonEndpointComponent";


export const backendFactory = new CodeFactory<CodeComponent>();
backendFactory.addType('server', ServerCodeComponent);
backendFactory.addType('endpoint', JsonEndpointComponent);
backendFactory.addType('html', HtmlPageComponent);

export const frontendFactory = new CodeFactory<IFrontendCodeComponent>();
frontendFactory.addType('dom', DomComponent);
frontendFactory.addType('script', ScriptTagComponent);