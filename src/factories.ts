import {CodeFactory} from "./CodeFactory";
import {IFrontendCodeComponent} from "./code-components/interfaces";
import {CodeComponent} from "./code-components/CodeComponent";
import {ServerCodeComponent} from "./code-components/backend/ServerCodeComponent";
import {HtmlPageComponent} from "./code-components/backend/HtmlPage/HtmlPageComponent";
import {DomComponent} from "./code-components/frontend/DomComponent";
import {ScriptTagComponent} from "./code-components/frontend/ScriptTagComponent";
import {JsonEndpointComponent} from "./code-components/backend/JsonEndpointComponent";
import {ScopedScriptComponent} from "./code-components/frontend/CustomScriptComponent";
import {EndpointComponent} from "./code-components/backend/EndpointComponent";
import {ConfigComponent} from "./code-components/frontend/ConfigComponent";
import {ReducerFactory} from "./ReducerFactory";


export const backendFactory = new CodeFactory<CodeComponent>();
backendFactory.addType(ServerCodeComponent);
backendFactory.addType(EndpointComponent);
backendFactory.addType(JsonEndpointComponent);
backendFactory.addType(HtmlPageComponent);

export const frontendFactory = new CodeFactory<IFrontendCodeComponent>();
frontendFactory.addType(DomComponent);
frontendFactory.addType(ScriptTagComponent);
frontendFactory.addType(ConfigComponent);
frontendFactory.addType(ScopedScriptComponent);

export const reducersFactory = new ReducerFactory();