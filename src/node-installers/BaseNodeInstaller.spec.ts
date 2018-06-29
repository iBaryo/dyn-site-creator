import {BaseNodeInstaller} from "./BaseNodeInstaller";
import {ICodeActivator, ICodeComponent, ICodeComponentType, IContext} from "../code-components/interfaces";
import {CodeNode} from "../ConfigurationTypes";

describe('BaseNodeInstaller', () => {
    class MockNodeInstaller extends BaseNodeInstaller<ICodeComponent<any>> {
        public install(node : CodeNode) : ICodeActivator<any> { return null; }
    }

    let installer : BaseNodeInstaller<ICodeComponent<any>>;
    let mockCmpMap : Map<string, ICodeComponent<any>>;
    const mockCmpTypeName = 'mock-type';
    let mockCmp: ICodeComponent<any>;
    beforeEach(() => {
        mockCmpMap = new Map<string, ICodeComponent<any>>();
        mockCmp = {install: jasmine.createSpy()};
        mockCmpMap.set(mockCmpTypeName, mockCmp);
        installer = new MockNodeInstaller(mockCmpMap);
    });

    describe('getComponent', () => {
        it('should return component according to type', () => {
            expect(installer.getComponent(mockCmpTypeName)).toBe(mockCmp);
        });
        it('should return component according to object\'s type', () => {
            class MockComponentType implements ICodeComponent<any>{
                constructor(context: IContext) {
                }
                public static typeName = mockCmpTypeName;
                public install() {}
            }

            expect(installer.getComponent<ICodeComponent<any>>(MockComponentType)).toBe(mockCmp);
        });
        it('should return undefined if no component with that name', () => {
            expect(installer.getComponent('non-existing')).toBeUndefined();
        });
    });
});