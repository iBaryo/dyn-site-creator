import {ServerExecutor} from "./executors/backend/server.executor";
import {EndpointExecutor} from "./executors/backend/endpoint.executor";
import {HtmlExecutor} from "./executors/backend/html.executor";
import {CodeFactory} from "./CodeFactory";
import {CodeExecutor, IFrontendCodeExecutor} from "./CodeExecutor";


export const backendFactory = new CodeFactory<CodeExecutor>();
backendFactory.addType('server', ServerExecutor);
backendFactory.addType('endpoint', EndpointExecutor);
backendFactory.addType('html', HtmlExecutor);

export const frontendFactory = new CodeFactory<IFrontendCodeExecutor>();