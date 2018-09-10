// main

export {IGetActivator, IGetFn, IValidate, ICodeActivator} from "./src/code-components/interfaces";

export {AppComponents, IAppComponentsConfig, installComponents} from "./src/AppComponents";
export {frontendFactory, backendFactory} from "./src/factories";
export {CodeNode, ConfigNode} from "./src/ConfigurationTypes";

// built-in components

export {
    FeatureComponent,
    FeatureNode,
    IFeatureBackendConfig,
    IFeatureFrontendConfig,
    PageNodesDictionary
} from "./src/code-components/FeatureComponent";

// backend
export {ServerCodeComponent, ServerCodeFn} from "./src/code-components/backend/ServerCodeComponent";
export {EndpointComponent, EndpointFn, EndpointNode} from "./src/code-components/backend/EndpointComponent";
export {
    JsonEndpointComponent,
    JsonEndpointFn,
    JsonEndpointNode
} from "./src/code-components/backend/JsonEndpointComponent";

export {HtmlPageComponent, HtmlGeneratorFn, HtmlNode} from "./src/code-components/backend/HtmlPage";

// frontend
export {DomComponent, DomGeneratorFn} from "./src/code-components/frontend/DomComponent";
export {
    ScriptTagComponent,
    ScriptGeneratorFn,
    ScriptNode,
    IScript
} from "./src/code-components/frontend/ScriptTagComponent";
export {ScopedScriptComponent} from "./src/code-components/frontend/CustomScriptComponent";