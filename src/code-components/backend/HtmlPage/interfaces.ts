import {CodeNode, ConfigNode} from "../../../ConfigurationTypes";
import {IBackendActivator, IFrontendActivator} from "../../interfaces";
import {EndpointNode} from "../EndpointComponent";
import {FrontendActivatorsCollection} from "./FrontendActivators";


export interface HtmlNode extends EndpointNode, IHtmlPageSections<CodeNode[]> {
    disableConfigInjection? : boolean;
}

export interface IHtmlPageSections<T> {
    head: T,
    body: T
}

export interface IRequestActivated<T> {
    activateFor(req: Express.Request): Promise<T>
}

export type IHtmlPageFrontendActivators = IHtmlPageSections<FrontendActivatorsCollection> & IRequestActivated<IHtmlPageSections<string[]>>;
export interface IHtmlPageActivator extends IBackendActivator {
    frontendActivators: IHtmlPageFrontendActivators;
}

export type HtmlGeneratorFn =
    (req: Express.Request,
     config: ConfigNode,
     codeContent: IHtmlPageSections<string[]>) => Promise<string>;
