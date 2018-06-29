import {CodeFactory} from "./CodeFactory";
import {ICodeComponent, ICodeComponentType, IContext} from "./code-components/interfaces";

describe('CodeFactory', () => {

    class MockCodeInstaller implements ICodeComponent<any> {
        constructor(public context) {
        }

        public static typeName = undefined;

        install(options) {
            return null;
        }
    }

    function createMockComponentType(typeName: string) {
        return class MockComponentType extends MockCodeInstaller {
            public static typeName = typeName;
        };
    }

    const mockTypeName = 'mock';
    const otherMockTypeName = 'mock2';
    const MockType: ICodeComponentType<MockCodeInstaller> = createMockComponentType(mockTypeName);

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
        expect(installers.has(otherMockTypeName)).toBeFalsy();
    });
    it('should get the code-components for registered types', () => {
        factory.addType(MockType);
        factory.addType(createMockComponentType(otherMockTypeName));
        const installers = factory.getInstallers(null);
        expect(installers.size).toBe(2);
        expect(installers.get(MockType.typeName)).toEqual(jasmine.any(MockCodeInstaller));
        expect(installers.get(otherMockTypeName)).toEqual(jasmine.any(MockCodeInstaller));
        expect(installers.get(MockType.typeName)).not.toBe(installers.get(otherMockTypeName));
    });
    it('should create each installer with the given context', () => {
        const context = {} as IContext;
        factory.addType(MockType);
        factory.addType(createMockComponentType(otherMockTypeName));
        const installers = factory.getInstallers(context);
        installers.forEach(i => expect(i.context).toBe(context));
    });
    it('should throw if trying to add an existing type', () => {
        factory.addType(MockType);
        try {
            factory.addType(MockType);
            fail();
        }
        catch (e) {
            const installers = factory.getInstallers(null);
            expect(installers.size).toBe(1);
        }
    });
    it('should override an existing type if forced', () => {
        class YetAnotherMockComponentType extends MockCodeInstaller {
            public static typeName = MockType.typeName;
            public get isNew() { return true; }
        }

        factory.addType(MockType);
        factory.addType(YetAnotherMockComponentType, true);
        const installers = factory.getInstallers(null);
        expect(installers.size).toBe(1);
        expect((installers.get(MockType.typeName) as YetAnotherMockComponentType).isNew).toBeTruthy();
    });
});