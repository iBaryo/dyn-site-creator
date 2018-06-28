import {CodeFactory} from "./CodeFactory";
import {ICodeComponent, ICodeComponentType, IContext} from "./code-components/interfaces";

describe('CodeFactory', () => {
    class MockCodeInstaller implements ICodeComponent<any> {
        constructor(public context) {
        }

        public static typeName = 'mock';

        install(options) {
            return null;
        }
    }

    const MockType: ICodeComponentType<MockCodeInstaller> = MockCodeInstaller;

    let factory: CodeFactory<MockCodeInstaller>;

    beforeEach(() => {
        factory = new CodeFactory<MockCodeInstaller>();
    });
    it('should init', () => {
        expect(factory).toBeTruthy();
    });
    it('should add type', () => {
        factory.addType(MockType);
    });
    it('should get the code-components as a type-installer map', () => {
        factory.addType(MockType);
        const installers = factory.getInstallers(null);
        expect(installers).toEqual(jasmine.any(Map));
    });
    it('should get the installer for registered type', () => {
        factory.addType(MockType);
        const installers = factory.getInstallers(null);
        expect(installers.size).toBe(1);
        expect(installers.get(MockType.typeName)).toEqual(jasmine.any(MockCodeInstaller));
        expect(installers.has(MockType.typeName + '2')).toBeFalsy();
    });
    it('should get the code-components for registered types', () => {
        factory.addType(MockType);
        factory.addType(MockType.typeName + '2');
        const installers = factory.getInstallers(null);
        expect(installers.size).toBe(2);
        expect(installers.get(MockType.typeName)).toEqual(jasmine.any(MockCodeInstaller));
        expect(installers.get(MockType.typeName + '2')).toEqual(jasmine.any(MockCodeInstaller));
        expect(installers.get(MockType.typeName)).not.toBe(installers.get(mockType + '2'));
    });
    it('should create each installer with the given context', () => {
        const context = {} as IContext;
        factory.addType(MockType, MockCodeInstaller);
        factory.addType(MockType.typeName + '2', MockCodeInstaller);
        const installers = factory.getInstallers(context);
        installers.forEach(i => expect(i.context).toBe(context));
    });
    it('should throw if trying to add an existing type', () => {
        factory.addType(MockType, MockCodeInstaller);
        try {
            factory.addType(MockType, MockCodeInstaller);
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

        factory.addType(MockType, MockCodeInstaller);
        factory.addType(MockType, YetAnotherMockInstaller, true);
        const installers = factory.getInstallers(null);
        expect(installers.size).toBe(1);
        expect((installers.get(MockType.typeName) as YetAnotherMockInstaller).isNew).toBeTruthy();
    });
});