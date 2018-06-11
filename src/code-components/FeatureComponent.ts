import {IFullstack} from "../node-installers/NodeInstallers";
import {CodeNode} from "../ConfigurationTypes";
import {CodeComponent} from "./CodeComponent";
import {endPointActivators} from "./backend/EndpointComponent";
import {IBackendActivator} from "./interfaces";
import {IHtmlPageSections, IHtmlPageActivator} from "./backend/HtmlPage/interfaces";
import {FrontendActivatorsCollection} from "./backend/HtmlPage/FrontendActivators";

export interface IFeatureBackendConfig {
}

export interface IFeatureFrontendConfig {
    defaultPage?: string;
    [pageType: string]: string;
}

export interface FeatureNode extends CodeNode, IFullstack<IFeatureBackendConfig, IFeatureFrontendConfig> {
}

export type PageNodesDictionary = { [pageType: string]: IHtmlPageSections<CodeNode[]> };

export abstract class FeatureComponent
    extends CodeComponent
    implements IFullstack<CodeNode[], PageNodesDictionary> {

    public abstract get backend();
    public abstract get frontend();

    constructor(context, protected endpointActivatorsService = {
        getEndpointsNames: (): string[] => Array.from(endPointActivators.keys()),
        getEndpointActivator: <T extends IBackendActivator>(endpointName: string):T => endPointActivators.get(endpointName) as T
    }) {
        super(context);
    }

    protected validate(node: FeatureNode) {
        // disable previous validations.
    }

    public install(node: FeatureNode) {
        this.validate(node);
        const backendActivators =
            this.backend.map(node => this.context.installers.backend.install(node));

        return this.getActivator(null, node, backendActivators);
    }

    protected getActivator(fn: Function, options: FeatureNode, backendActivators?: IBackendActivator[]) {
        return {
            activate: () => this.run(options, fn, backendActivators)
        }
    }

    protected run(options: FeatureNode, fn: Function, backendActivators?: IBackendActivator[]) {
        try {
            this.installFrontendNodesToPages(this.frontend, options.frontend);
        }
        catch (e) {
            throw `error installing frontend aspects of feature ${options.type} ('${options.desc}'):\n${e}`;
        }

        return Promise.all(backendActivators.map(b => b.activate()));
    }

    private installFrontendNodesToPages(pageNodesDictionary: PageNodesDictionary, feConfig:  IFeatureFrontendConfig = {}) {
        const pageTypes = Object.keys(pageNodesDictionary);

        if (pageTypes.length) {
            feConfig.defaultPage =
                feConfig.defaultPage
                || this.endpointActivatorsService.getEndpointsNames().find(k => k.endsWith('.html'));

            pageTypes.forEach(pageType => {
                const pageName = feConfig[pageType] || feConfig.defaultPage;
                const htmlPage = this.endpointActivatorsService.getEndpointActivator<IHtmlPageActivator>(pageName);
                if (!htmlPage) {
                    throw `page '${pageName}' does not exist`;
                }
                else {
                    const pageActivators: IHtmlPageSections<FrontendActivatorsCollection> =
                        htmlPage.frontendActivators;

                    const pageNodes = pageNodesDictionary[pageType];
                    Object.keys(pageNodes).forEach((section: keyof IHtmlPageSections<CodeNode[]>) => {
                        pageActivators[section].addFromNodes(pageNodes[section]);
                    });
                }
            });
        }
    }
}