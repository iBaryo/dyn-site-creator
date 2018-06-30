import {BackendInstaller} from "./BackendInstaller";
import {ICodeComponent} from "../code-components/interfaces";

describe('BackendInstaller', () => {
    let backendInstaller: BackendInstaller;
    let mockDefaultCmp: ICodeComponent<any>;
    let mockCmpsLib: Map<string, ICodeComponent<any>>;
    let mockActivator;
    beforeEach(() => {
        mockActivator = {};
        mockDefaultCmp = {install:jasmine.createSpy('installer').and.returnValue(mockActivator)}
        mockCmpsLib = new Map<string, ICodeComponent<any>>([
            [BackendInstaller.defaultType, mockDefaultCmp]
        ]);
        backendInstaller = new BackendInstaller(mockCmpsLib);
    });
    it('should throw if component type does not exist in components library', () => {
        try {
            backendInstaller.install({
                type: 'not-existing',
                desc: 'mock',
                code: ''
            });
            fail();
        }
        catch (e) {
            expect((e as string).includes(`type is not supported`)).toBeTruthy();
        }
    });
    it('should use the default type if node has not got one', () => {
        backendInstaller.install({
            type: undefined,
            desc: 'mock',
            code: ''
        });

        expect(mockDefaultCmp.install).toHaveBeenCalled();
    });
    it('should install component by type', function () {
        const mockType = 'cmp-type';
        const mockCmp ={install: jasmine.createSpy('install')};
        mockCmpsLib.set(mockType, mockCmp);

        backendInstaller.install({type: mockType, desc: '', code: ''});

        expect(mockCmp.install).toHaveBeenCalled();
        expect(mockDefaultCmp.install).not.toHaveBeenCalled();
    });
    it('should throw in case of installation error', () => {
        const customErr = 'custom err!';
        (mockDefaultCmp.install as jasmine.Spy).and.callFake(() => {throw customErr;});

        try {
            backendInstaller.install({
                type: BackendInstaller.defaultType,
                desc: 'mock',
                code: ''
            });
            fail();
        }
        catch (e) {
            expect(e.includes(`error when installing`)).toBeTruthy();
            expect(e.includes(customErr)).toBeTruthy();
        }
    });
    it('should return installation\'s activator', () => {
        expect(backendInstaller.install({
            type: BackendInstaller.defaultType,
            desc: 'mock',
            code: ''
        })).toBe(mockActivator);
    });
});