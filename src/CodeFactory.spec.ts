import {CodeFactory} from "./CodeFactory";
import {ICodeComponent, IContext} from "./code-components/interfaces";

describe('CodeFactory', () => {
    const mockType = 'mock';

    class MockCodeInstaller implements ICodeComponent<any> {
        constructor(public context) {}
        install(options) {
            return null;
        }
    }

    let factory: CodeFactory<MockCodeInstaller>;

    beforeEach(() => {
        factory = new CodeFactory<MockCodeInstaller>();
    });
    it('should init', () => {
        expect(factory).toBeTruthy();
    });
    it('should add type', () => {
        factory.addType(mockType, MockCodeInstaller);
    });
    it('should get the code-components as a type-installer map', () => {
        factory.addType(mockType, MockCodeInstaller);
        const installers = factory.getInstallers(null);
        expect(installers).toEqual(jasmine.any(Map));
    });
    it('should get the installer for registered type', () => {
        factory.addType(mockType, MockCodeInstaller);
        const installers = factory.getInstallers(null);
        expect(installers.size).toBe(1);
        expect(installers.get(mockType)).toEqual(jasmine.any(MockCodeInstaller));
        expect(installers.has(mockType + '2')).toBeFalsy();
    });
    it('should get the code-components for registered types', () => {
        factory.addType(mockType, MockCodeInstaller);
        factory.addType(mockType + '2', MockCodeInstaller);
        const installers = factory.getInstallers(null);
        expect(installers.size).toBe(2);
        expect(installers.get(mockType)).toEqual(jasmine.any(MockCodeInstaller));
        expect(installers.get(mockType + '2')).toEqual(jasmine.any(MockCodeInstaller));
        expect(installers.get(mockType)).not.toBe(installers.get(mockType + '2'));
    });
    it('should create each installer with the given context', () => {
        const context = {} as IContext;
        factory.addType(mockType, MockCodeInstaller);
        factory.addType(mockType + '2', MockCodeInstaller);
        const installers = factory.getInstallers(context);
        installers.forEach(i => expect(i.context).toBe(context));
    });
    it('should throw if trying to add an existing type', () => {
        factory.addType(mockType, MockCodeInstaller);
        try {
            factory.addType(mockType, MockCodeInstaller);
            fail();
        }
        catch (e) {
            const installers = factory.getInstallers(null);
            expect(installers.size).toBe(1);
        }
    });
    it('should override an existing type if forced', () => {
        class YetAnotherMockInstaller extends MockCodeInstaller {
            public isNew = true;
        }

        factory.addType(mockType, MockCodeInstaller);
        factory.addType(mockType, YetAnotherMockInstaller, true);
        const installers = factory.getInstallers(null);
        expect(installers.size).toBe(1);
        expect((installers.get(mockType) as YetAnotherMockInstaller).isNew).toBeTruthy();
    });
});