import {endPointActivators, EndpointComponent, EndpointNode} from "./EndpointComponent";
import {createMockContext} from "../testsUtils";
import {IBackendActivator, IContext} from "../interfaces";
import {Application, RequestHandler} from "express";

describe('EndpointComponent', () => {
    let endpointCmp: EndpointComponent;
    let mockNode: EndpointNode;
    let mockContext: IContext;

    const mockEndpointName = 'mock-endpoint';

    beforeEach(() => {
        endPointActivators.clear();

        mockNode = {
            type: 'mock-type',
            desc: 'mock',
            code: '() => {}',
            name: mockEndpointName
        };
        mockContext = createMockContext();
        endpointCmp = new EndpointComponent(mockContext);
    });

    it('should init', function () {
        expect(endpointCmp).toBeTruthy();
    });

    describe('install', () => {
        it('should throw if missing `name` in code node', () => {
            delete mockNode.name;
            try {
                endpointCmp.install(mockNode);
                fail();
            }
            catch (e) {
                expect(e).toBe('missing endpoint name');
            }
        });
        it('should still use super\'s validation', () => {
            spyOn(EndpointComponent.prototype as { validate: Function }, 'validate');
            endpointCmp.install(mockNode);
            expect(EndpointComponent.prototype.validate).toHaveBeenCalled();
        });
        it('should register each created activator', () => {
            expect(endPointActivators.size).toBe(0);
            const activator = endpointCmp.install(mockNode);
            expect(endPointActivators.size).toBe(1);
            expect(activator).toBe(endPointActivators.get(mockEndpointName));
            expect(activator.activate).toEqual(jasmine.any(Function));
        });
        describe('activator', () => {
            describe('pre-request', () => {
                let activator: IBackendActivator;
                beforeEach(() => {
                    activator = endpointCmp.install(mockNode);
                });

                it('should call and return super\'s `run`', (done) => {
                    spyOn(EndpointComponent.prototype as { run: Function }, 'run').and.callThrough();
                    activator.activate()
                        .then(() =>
                            expect(EndpointComponent.prototype.run).toHaveBeenCalledWith(mockNode, jasmine.any(Function))
                        ).then(done);
                });
                it('should define an endpoint according to node code\'s name', (done) => {
                    activator.activate()
                        .then(() =>
                            expect((mockContext.app as Application).get).toHaveBeenCalledWith(`/${mockEndpointName}`, jasmine.any(Function))
                        ).then(done)
                });
            });
            describe('post-request', () => {
                let mockReq: any;
                let mockRes: any;
                let appGetSpy: jasmine.Spy;
                beforeEach(() => {
                    mockReq = {};
                    mockRes = {};
                    appGetSpy = (mockContext.app as Application).get as jasmine.Spy;
                });

                it('should invoke function for a request', (done) => {
                    mockNode.code = async (req, res, config) => {
                        expect(req).toBe(mockReq);
                        expect(res).toBe(mockRes);
                        expect(config).toBe(mockContext.config);
                        done();
                    };
                    endpointCmp.install(mockNode).activate()
                        .then(() => {
                            const reqHandler: RequestHandler = appGetSpy.calls.mostRecent().args.find(arg => typeof arg == 'function');
                            reqHandler(mockReq, mockRes, {} as any);
                        });
                });
                it('should swallow exception if the function throws', (done) => {
                    mockNode.code = async (req, res, config) => {
                        throw 'custom err!';
                    };
                    endpointCmp.install(mockNode).activate()
                        .then(() => {
                            const reqHandler: RequestHandler = appGetSpy.calls.mostRecent().args.find(arg => typeof arg == 'function');
                            reqHandler(mockReq, mockRes, {} as any);
                        })
                        .then(done);
                });
            });
        });
    });
});