import {FrontendCodeComponent} from "./FrontendCodeComponent";
import {IContext, IFrontendActivator} from "../interfaces";
import {createMockContext} from "../testsUtils";
import {CodeNode} from "../../ConfigurationTypes";

describe('FrontendCodeComponent', () => {
    class MockFrontendComponent extends FrontendCodeComponent {
        public async run(options: CodeNode, fn: Function, req?: Express.Request) {
            return fn();
        }
    }

    let cmp: MockFrontendComponent;
    let mockContext: IContext;
    let mockNode: CodeNode;
    beforeEach(() => {
        mockContext = createMockContext();
        cmp = new MockFrontendComponent(mockContext);
        mockNode = {
            type: 'mock',
            desc: 'mock desc',
            code: '() => `mock`'
        };
    });

    it('should init', () => {
        expect(cmp).toBeTruthy();
    });
    it('should allow code node with no code', () => {
        cmp.install(Object.assign(mockNode, {code: undefined}));
    });
    it('should allow code that is not a function', () => {
        cmp.install(Object.assign(mockNode, {code: 'just a string'}));
    });

    describe('activator', () => {
        let activator: IFrontendActivator;
        let mockReq;
        beforeEach(() => {
           mockReq = {};
        });
        it('should invoke `run` method with the code node, input function and the request object', done => {
            activator = cmp.install(mockNode);
            spyOn(cmp, 'run').and.callThrough();
            activator.activate(mockReq).then(res => {
                expect(cmp.run).toHaveBeenCalledWith(mockNode, jasmine.any(Function), mockReq);
                expect(res).toBe('mock');
                done();
            });
        });
        it('should return the code node\'s code as the input function (if the code is not a function)', done => {
            mockNode = Object.assign(mockNode, {code: `<mock></mock>`});
            activator = cmp.install(mockNode);
            activator.activate(mockReq).then(res => {
                expect(res).toBe(mockNode.code.toString());
                done();
            });
        });
        it('(the input function) should return an empty string if code node has no code', done => {
            mockNode = Object.assign(mockNode, {code: undefined});
            activator = cmp.install(mockNode);
            activator.activate(mockReq).then(res => {
                expect(res).toBe('');
                done();
            });
        });
    });
});