import {FrontendInstaller} from "./FrontendInstaller";
import {ICodeComponent} from "../code-components/interfaces";

describe('FrontendInstaller', () => {
    let installer: FrontendInstaller;
    let mockCmpsLib: Map<string, ICodeComponent<any>>;

    const mockType = 'mock-type';
    let mockCmp: ICodeComponent<any>;
    let mockActivator;
    beforeEach(() => {
        mockActivator = {activate: jasmine.createSpy('activate')};
        mockCmp = {
            install: jasmine.createSpy('install').and.returnValue(mockActivator)
        };
        mockCmpsLib = new Map<string, ICodeComponent<any>>([
            [mockType, mockCmp]
        ]);
        installer = new FrontendInstaller(mockCmpsLib);
    });

    describe('installed node type that is not supported', () => {
        it('should throw if node has no code', () => {
            try {
                installer.install({
                    type: 'not-supported',
                    desc: 'mock',
                    code: ''
                });
                fail();
            }
            catch (e) {
                expect(e.includes(`empty unknown frontend node`)).toBeTruthy();
            }
        });
        it('should resolve with activator that returns the code as a string', (done) => {
            const mockReq = {};
            const mockCode = 'wonderful code';
            const activator = installer.install({
                type: 'not-supported',
                desc: 'mock',
                code: mockCode
            });
            expect(activator).not.toBe(mockActivator);
            expect(activator.componentType).toBeUndefined();

            activator.activate(mockReq)
                .then(code => expect(code).toEqual(mockCode))
                .then(done);
        });
    });
    describe('supported type', () => {
        it('should install the component for node and return its activator', () => {
            const activator = installer.install({
                type: mockType,
                desc: 'mock',
                code: ''
            });

            expect(mockCmp.install).toHaveBeenCalled();
            expect(activator).toBe(mockActivator);
            expect(activator.activate).not.toHaveBeenCalled();
        });
        it('should throw errors during installation', () => {
            const customErr = 'custom err!';
            (mockCmp.install as jasmine.Spy).and.callFake(() => {
                throw customErr;
            });

            try {
                installer.install({
                    type: mockType,
                    desc: 'mock',
                    code: ''
                });
                fail();
            }
            catch (e) {
                expect(e.includes(`error installing frontend`)).toBeTruthy();
                expect(e.includes(customErr)).toBeTruthy();
            }
        });
    });
});