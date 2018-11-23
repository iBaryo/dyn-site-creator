import {FrontendActivatorsCollection} from "./FrontendActivatorsCollection";
import {FrontendInstaller} from "../../../node-installers/FrontendInstaller";
import {CodeNode} from "../../../ConfigurationTypes";

describe('FrontendActivators', () => {
    let activators: FrontendActivatorsCollection;
    let mockInstaller: FrontendInstaller;
    const activatedResponse = 'activated';

    beforeEach(() => {
        mockInstaller = {
            install: jasmine.createSpy('install').and.callFake(node => ({
                activate: req => Promise.resolve(activatedResponse)
            })) as any,
            getComponent: jasmine.createSpy('getCmp')  as any,
        } as FrontendInstaller;

        activators = new FrontendActivatorsCollection(mockInstaller);
    });
    it('should init', function () {
        expect(activators).toBeTruthy();
    });

    describe('addFromNodes', () => {
        beforeEach(() => {

        });

        it('should install nodes when adding them', function () {
            const mockNodes = [
                {},
                {}
            ] as CodeNode[];
            activators.addFromNodes(mockNodes);
            mockNodes.forEach(node => expect(mockInstaller.install).toHaveBeenCalledWith(node));
        });
        it('should swallow exceptions thrown when installing nodes', function () {
            (mockInstaller.install as jasmine.Spy).and.callFake((node: CodeNode) => {
                if (node.type == 'throw') throw node;
                else return {};
            });

            const mockNodes = [
                {},
                {type: 'throw'},
                {}
            ] as CodeNode[];
            activators.addFromNodes(mockNodes);
            mockNodes.forEach(node => expect(mockInstaller.install).toHaveBeenCalledWith(node));
        });
    });
    it('should init with added nodes', function () {
        const mockNodes = [
            {},
            {}
        ] as CodeNode[];

        activators = new FrontendActivatorsCollection(mockInstaller, mockNodes);
        mockNodes.forEach(node => expect(mockInstaller.install).toHaveBeenCalledWith(node));
    });
    it('should activate all installed nodes with given request', async function (done) {
        const mockNodes = [
            {},
            {}
        ] as CodeNode[];
        const mockReq = {};
        activators.addFromNodes(mockNodes);

        const res = await activators.activateFor(mockReq);
        res.forEach(reduced =>
            reduced.split('\n').forEach(str =>
                expect(str).toBe(activatedResponse)
            )
        );
        done();
    });
    xit('should handle activators with different reducer types', function () {
        // todo
    });
});