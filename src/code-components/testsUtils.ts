import {IContext} from "./interfaces";
import {NodeInstallers} from "../node-installers/NodeInstallers";
import {Express, RequestHandler} from "express";

export type IMockContext = IContext & {app: Express.Application & {invokeForRecentReqHandler: (req, res) => void }};
export function createMockContext() : IMockContext {
    return {
        app: {
            get: jasmine.createSpy('app get'),
            invokeForRecentReqHandler: function(req, res) {
                const reqHandler: RequestHandler =
                    (this.get as jasmine.Spy).calls.mostRecent().args.find(arg => typeof arg == 'function')

                reqHandler(req, res, {} as any);
            }
        },
        config: {},
        installers: {} as NodeInstallers,
        logger: Object.keys(console).reduce(
                    (res, curr) => {res[curr] = jasmine.createSpy(`${curr}-spy`); return res;},
                    {}
                ) as Console
    };
}