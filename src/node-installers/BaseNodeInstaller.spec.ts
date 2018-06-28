// import {BaseNodeInstaller} from "./BaseNodeInstaller";
// import {ICodeActivator, ICodeComponent} from "../code-components/interfaces";
// import {CodeNode} from "../ConfigurationTypes";
//
// describe('BaseNodeInstaller', () => {
//     class MockNodeInstaller extends BaseNodeInstaller<ICodeComponent<any>> {
//         public install(node : CodeNode) : ICodeActivator<any> { return null; }
//     }
//
//     let installer : BaseNodeInstaller<ICodeComponent<any>>;
//     let mockCmpMap : Map<string, ICodeComponent<any>>;
//     const mockCmpType = 'mock-type';
//     beforeEach(() => {
//         mockCmpMap = new Map<string, ICodeComponent<any>>();
//         mockCmpMap.set(mockCmpType, {});
//         installer = new MockNodeInstaller(mockCmpMap);
//     });
//
//     describe('getComponent', () => {
//         it('should return component according to type', () => {
//
//         });
//         it('should return component according to object\'s type', () => {
//         });
//         it('should return undefined if no component with that name', () => {
//         });
//     });
// });