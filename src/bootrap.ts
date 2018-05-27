import {backendFactory} from "./CodeFactory";
import {ServerExecutor} from "./executors/backend/server.executor";
import {EndpointExecutor} from "./executors/backend/endpoint.executor";
import {HtmlExecutor} from "./executors/backend/html.executor";

export function bootstrap() {
    backendFactory.set('server', ServerExecutor);
    backendFactory.set('endpoint', EndpointExecutor);
    backendFactory.set('html', HtmlExecutor);

}