import {JsonEndpointComponent, JsonEndpointNode} from "./JsonEndpointComponent";
import {createMockContext, IMockContext} from "../testsUtils";
import {EndpointComponent} from "./EndpointComponent";
import {Response} from "express";

~describe('JsonEndpointComponent', () => {
    let endpointCmp: JsonEndpointComponent;
    let mockContext: IMockContext;
    beforeEach(() => {
        mockContext = createMockContext();
        endpointCmp = new JsonEndpointComponent(mockContext);
    });
    it('should init', () => {
        expect(endpointCmp).toBeTruthy();
    });

    describe('activator', () => {
        let mockNode: JsonEndpointNode;
        beforeEach(() => {
            mockNode = {
                type: JsonEndpointComponent.typeName,
                name: 'mock-endpoint',
                desc: 'mock',
                code: '() => {}'
            };
        });
        it('should call and return super\'s `run`', (done) => {
            spyOn(EndpointComponent.prototype, 'run').and.callThrough();
            endpointCmp.install(mockNode).activate()
                .then(() => {
                    expect(EndpointComponent.prototype.run).toHaveBeenCalledWith(mockNode, jasmine.any(Function));
                }).then(done);
        });
        describe('handling requests', () => {
            let mockReq: any;
            let mockRes: Response;
            beforeEach(() => {
                mockReq = {};
                mockRes = {
                    contentType: jasmine.createSpy('content type'),
                    send: jasmine.createSpy('send')
                } as any;
            });

            it('should invoke the input function with the request and config', (done) => {
                mockNode.code = (req, config) => {
                    expect(req).toBe(mockReq);
                    expect(config).toBe(mockContext.config);
                    done();
                };
                endpointCmp.install(mockNode).activate()
                    .then(() => {
                        mockContext.app.invokeForRecentReqHandler(mockReq, mockRes);
                    });
            });
            it('should should response with the input function\'s result', (done) => {
                mockNode.code = (req, config) => 42;
                endpointCmp.install(mockNode).activate()
                    .then(() => {
                        mockContext.app.invokeForRecentReqHandler(mockReq, Object.assign(mockRes, {
                            send: jasmine.createSpy('send').and.callFake(res => {
                                expect(JSON.parse(res)).toBe(42);
                                done();
                            })
                        }));
                    });
            });
            it('should wait for returned promise and respond with its value', (done) => {
                const obj = {meaning: 42};
                mockNode.code = async (req, config) => obj;
                endpointCmp.install(mockNode).activate()
                    .then(() => {
                        mockContext.app.invokeForRecentReqHandler(mockReq, Object.assign(mockRes, {
                            send: jasmine.createSpy('send').and.callFake(res => {
                                expect(JSON.parse(res)).toEqual(obj);
                                done();
                            })
                        }));
                    });
            });
            it('should always respond in application/json format', (done) => {
                endpointCmp.install(mockNode).activate()
                    .then(() => {
                        mockContext.app.invokeForRecentReqHandler(mockReq, Object.assign(mockRes, {
                            send: jasmine.createSpy('send').and.callFake(res => {
                                expect(mockRes.contentType).toHaveBeenCalledWith('application/json');
                                done();
                            })
                        }));
                    });
            });
            it('should respond with error if input function throws', (done) => {
                const customErr = 'err';
                mockNode.code = (req, config) => {throw customErr;};
                endpointCmp.install(mockNode).activate()
                    .then(() => {
                        mockContext.app.invokeForRecentReqHandler(mockReq, Object.assign(mockRes, {
                            send: jasmine.createSpy('send').and.callFake(rawRes => {
                                const res = JSON.parse(rawRes);
                                expect(res.e).toBe(customErr);
                                expect(res.msg.includes(`error while invoking endpoint ${mockNode.name}`));
                                expect(mockRes.contentType).toHaveBeenCalledWith('application/json');
                                done();
                            })
                        }));
                    });
            });
            it('should respond with error if input function\'s returned promise rejects', (done) => {
                const customErr = 'err';
                mockNode.code = (req, config) => Promise.reject(customErr);
                endpointCmp.install(mockNode).activate()
                    .then(() => {
                        mockContext.app.invokeForRecentReqHandler(mockReq, Object.assign(mockRes, {
                            send: jasmine.createSpy('send').and.callFake(rawRes => {
                                const res = JSON.parse(rawRes);
                                expect(res.e).toBe(customErr);
                                expect(res.msg.includes(`error while invoking endpoint ${mockNode.name}`));
                                expect(mockRes.contentType).toHaveBeenCalledWith('application/json');
                                done();
                            })
                        }));
                    });
            });
        });
    });
});