import {CodeComponent} from "./CodeComponent";
import {CodeNode} from "../ConfigurationTypes";
import {IContext} from "./interfaces";
import {NodeInstallers} from "../node-installers/NodeInstallers";
import {createMockContext} from "./testsUtils";

describe('CodeComponent', () => {
    class MockCodeComponent extends CodeComponent {
        public wasRun = false;

        constructor(context) {
            super(context);
        }

        public run(options: CodeNode, fn: Function) {
            this.wasRun = true;
            return Promise.resolve({options, fn});
        }
    }

    let cmp: MockCodeComponent;
    let mockContext: IContext;
    let mockNode: CodeNode;
    const mockCodeReturnedVal = 'mock';
    beforeEach(() => {
        mockNode = {
            type: 'mock-type',
            desc: 'mock',
            code: `() => "${mockCodeReturnedVal}"`
        };
        mockContext = createMockContext();
        cmp = new MockCodeComponent(mockContext);
    });

    it('should init', function () {
        expect(cmp).toBeTruthy();
    });

    describe('install', () => {
        it('should throw if node has no code', () => {
            delete mockNode.code;

            try {
                cmp.install(mockNode);
                fail();
            }
            catch (e) {
                expect(e).toBe('missing code for node');
            }
        });
        it('should throw if code does not evaluate', () => {
            mockNode.code = 'function with syntaxerr() {}';

            try {
                cmp.install(mockNode);
                fail();
            }
            catch (e) {

            }
        });
        it('should throw if code evaluates to not a function', () => {
            mockNode.code = 'var a = "not a func";';

            try {
                cmp.install(mockNode);
                fail();
            }
            catch (e) {
                expect(e).toBe('the code is not a function');
            }
        });
        it('should return an activator', () => {
            const activator = cmp.install(mockNode);
            expect(activator).toBeTruthy();
            expect(activator.activate).toEqual(jasmine.any(Function));
        });
        it('(activator) should invoke the abstract `run` method with the input function and the installed node', (done) => {
            cmp.install(mockNode).activate()
                .then((res: { options, fn }) => {
                    expect(cmp.wasRun).toBeTruthy();
                    expect(res.options).toBe(mockNode);
                    expect(res.fn).toEqual(jasmine.any(Function));
                    expect(res.fn()).toBe(mockCodeReturnedVal);
                })
                .then(done);
        });

        it('should support code node with parsed function', (done) => {
            mockNode.code = () => mockCodeReturnedVal;

            cmp.install(mockNode).activate()
                .then((res: { options, fn }) => {
                    expect(cmp.wasRun).toBeTruthy();
                    expect(res.options).toBe(mockNode);
                    expect(res.fn).toEqual(jasmine.any(Function));
                    expect(res.fn()).toBe(mockCodeReturnedVal);
                })
                .then(done);
        });
    });
});