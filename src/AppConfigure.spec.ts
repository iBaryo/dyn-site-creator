import {AppConfigure, IAppConfig} from "./AppConfigure";
import {Express} from "express";
import {NodeInstallers} from "./node-installers/NodeInstallers";
import {CodeNode} from "./ConfigurationTypes";

describe('AppConfigure', () => {
    let appConfigure: AppConfigure;

    let mockApp: Express.Request;
    let mockInstallers: NodeInstallers;
    let mockAppConfigLoader: jasmine.Spy;
    const mockAppConfigPath = 'mockDyn.json';
    let mockAppConfig: IAppConfig;

    beforeEach(() => {
        mockApp = {};
        mockInstallers = {
            backend: {
                install: jasmine.createSpy('backend installer').and.returnValue({
                    activate: jasmine.createSpy('activator').and.callFake(() => Promise.resolve())
                }) as any
            }
        } as NodeInstallers;
        mockAppConfigLoader = jasmine.createSpy('appConfig loader');
        mockAppConfig = {
            code: [
                {},
                {},
                {},
            ] as CodeNode[]
        }
    });

    function createAppConfigure() {
        appConfigure =
            new AppConfigure(
                mockApp,
                mockAppConfigPath,
                mockInstallers,
                mockAppConfigLoader
            );
    }

    describe('init', () => {
        describe('validations', () => {
            function assertForError(err) {
                try {
                    createAppConfigure();
                    fail();
                }
                catch (e) {
                    expect(e.startsWith(err)).toBeTruthy();
                }
            }

            it('should throw if appConfig file is not available', () => {
                mockAppConfigLoader.and.throwError('file not exist');
                assertForError(`error reading appConfig file from ${mockAppConfigPath}`);
            });
            it('should throw if appConfig is empty', () => {
                mockAppConfigLoader.and.returnValue(undefined);
                assertForError(`code section required in appConfig`);
            });
            it('should throw if appConfig has no code section', () => {
                mockAppConfigLoader.and.returnValue({});
                assertForError(`code section required in appConfig`);
            });
            it('should throw if appConfig has an empty code section', () => {
                mockAppConfigLoader.and.returnValue({code: []});
                assertForError(`code section required in appConfig`);
            });
        });

        describe('config', () => {
            it('should use an empty object if config does not exist in file', () => {
                mockAppConfigLoader.and.returnValue(Object.assign(mockAppConfig, {config: undefined}));
                createAppConfigure();
                expect(appConfigure.config).toEqual(jasmine.any(Object));
                expect(Object.keys(appConfigure.config).length).toBe(0);
            });
            it('should use an empty object if config no entries', () => {
                mockAppConfigLoader.and.returnValue(Object.assign(mockAppConfig, {config: []}));
                createAppConfigure();
                expect(appConfigure.config).toEqual(jasmine.any(Object));
                expect(Object.keys(appConfigure.config).length).toBe(0);
            });
            it('should merge all config entries to one', () => {
                const configEntries = [
                    {
                        a: 1
                    },
                    {
                        b: 2,
                        c: 3
                    },
                    {
                        d: 4
                    }
                ];
                mockAppConfigLoader.and.returnValue(Object.assign(mockAppConfig, {
                    config: configEntries
                }));

                createAppConfigure();

                configEntries.forEach(configEntry =>
                    Object.keys(configEntry).forEach(k =>
                        expect(appConfigure.config[k]).toBe(configEntry[k])));
            });
            it('should use the latter entry if two entries has the same key', () => {
                const configEntries = [
                    {
                        a: 1
                    },
                    {
                        a: 2,
                        c: 3
                    },
                    {
                        c: 4
                    }
                ];
                mockAppConfigLoader.and.returnValue(Object.assign(mockAppConfig, {
                    config: configEntries
                }));

                createAppConfigure();

                const mergedConfig = configEntries.reduce((res, cur) => Object.assign(res, cur), {});
                Object.keys(mergedConfig).forEach(k =>
                    expect(appConfigure.config[k]).toBe(mergedConfig[k]));
            });
        });

        it('should take code section as-is', () => {
            const mockCode = [{} as CodeNode];
            mockAppConfigLoader.and.returnValue(Object.assign(mockAppConfig, {code: mockCode}));
            createAppConfigure();
            expect(appConfigure.code).toBe(mockCode);
        });
    });

    describe('install', () => {
        beforeEach(() => {
            mockAppConfigLoader.and.returnValue(mockAppConfig);
            createAppConfigure();
        });
        it('should install all code components as backend components', () => {
            appConfigure.install();
            const installSpy = mockInstallers.backend.install as jasmine.Spy;
            mockAppConfig.code.forEach((node, index) =>
                expect(installSpy.calls.argsFor(index)).toEqual([node])
            );
        });
        it('should activate all code components after install', () => {
            appConfigure.install();
            expect((mockInstallers.backend.install(null).activate as jasmine.Spy).calls.count())
                .toBe(mockAppConfig.code.length);
        });
        it('should finish only after all components are done activating', (done) => {
            let completed = 0;
            (mockInstallers.backend.install(null).activate as jasmine.Spy)
                .and.callFake(() =>
                new Promise(resolve =>
                    setTimeout(() => resolve(++completed), completed + 10)
                )
            );

            appConfigure.install().then(() => {
                expect(completed).toBe(mockAppConfig.code.length);
                done();
            });
        });
        describe('error handling', () => {
            beforeEach(() => {
                spyOn(console, 'log');
            });
            it('should console log errors in the installation', (done) => {
                const installerErr = 'installer error';
                (mockInstallers.backend.install as jasmine.Spy).and.callFake(() => {
                    throw installerErr;
                });

                appConfigure.install()
                    .then(fail)
                    .catch(e => {
                        expect(e.startsWith('error while installing')).toBeTruthy();
                        expect(console.log).toHaveBeenCalledWith(installerErr);
                    })
                    .then(done);
            });
            it('should console log errors in the activation', (done) => {
                const activationErr = 'activation error';
                (mockInstallers.backend.install(null).activate as jasmine.Spy).and.callFake(() => {
                    throw activationErr;
                });

                appConfigure.install()
                    .then(fail)
                    .catch(e => {
                        expect(e).toBe('error while activating');
                        expect(console.log).toHaveBeenCalledWith(activationErr);
                        done();
                    });
            });
            it('should continue installation if an error is thrown if forced by parameter', (done) => {
                const installerErr = 'installer error';
                const installerSpy = mockInstallers.backend.install as jasmine.Spy;
                installerSpy.and.callFake(() => {
                    throw installerErr;
                });

                appConfigure.install(true)
                    .then(() => {
                        expect(installerSpy).toHaveBeenCalledTimes(mockAppConfig.code.length);
                        done();
                    })
                    .catch(fail);
            });
        });
    });
});