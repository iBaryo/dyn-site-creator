import {IContext} from "./interfaces";
import {NodeInstallers} from "../node-installers/NodeInstallers";

export function createMockContext() : IContext {
    return {
        app: {
            get: jasmine.createSpy('app get')
        },
        config: {},
        installers: {} as NodeInstallers,
        logger: Object.keys(console).reduce(
                    (res, curr) => {res[curr] = jasmine.createSpy(`${curr}-spy`); return res;},
                    {}
                ) as Console
    };
}