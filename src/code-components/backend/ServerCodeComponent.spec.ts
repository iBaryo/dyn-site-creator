import {ServerCodeComponent} from "./ServerCodeComponent";
import {IContext} from "../interfaces";
import {createMockContext} from "../testsUtils";

describe('ServerCodeComponent', () => {
    let serverCmp: ServerCodeComponent;
    let mockContext: IContext;
    beforeEach(() => {
        mockContext = createMockContext();
        serverCmp = new ServerCodeComponent(mockContext);
    });

    it('should init', function () {
        expect(serverCmp).toBeTruthy();
    });

    describe('activator', () => {
        it('should invoke the input function with the context\'s app and config', (done)=> {
            const mockRes = 42;
            let didCodeRun = false;
            serverCmp.install({
                type: 'mock',
                desc: 'mock',
                code: (app, config) => {
                    expect(app).toBe(mockContext.app);
                    expect(config).toBe(mockContext.config);
                    didCodeRun = true;
                    return mockRes;
                }
            }).activate()
                .then(res => expect(res).toBe(mockRes))
                .then(() => expect(didCodeRun).toBeTruthy())
                .then(done);
        });
        it('should return the input function\'s promised value', (done)=> {
            const mockRes = 42;
            serverCmp.install({
                type: 'mock',
                desc: 'mock',
                code: () => Promise.resolve(mockRes)
            }).activate()
                .then(res => expect(res).toBe(mockRes))
                .then(done);
        });
        it('should throw if the input function throws', (done)=> {
            const mockRes = 42;
            serverCmp.install({
                type: 'mock',
                desc: 'mock',
                code: () => {throw mockRes;}
            }).activate()
                .then(fail)
                .catch(e => expect(e.includes(mockRes.toString())).toBeTruthy())
                .then(done);
        });
        it('should throw if the input function\'s returned promise rejects', (done)=> {
            const mockRes = 42;
            serverCmp.install({
                type: 'mock',
                desc: 'mock',
                code: () => Promise.reject(mockRes)
            }).activate()
                .then(fail)
                .catch(e => expect(e.includes(mockRes.toString())).toBeTruthy())
                .then(done);
        });
    });
});