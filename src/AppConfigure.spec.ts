xdescribe('AppConfigure', () => {
    describe('init', () => {
        describe('validations', () => {
            it('should throw if appConfig file is not available', () => {
            });
            it('should throw if appConfig is empty', () => {
            });
            it('should throw if appConfig has no code section', () => {
            });
        });
        describe('config', () => {
            it('should use an empty object if no entries', () => {
            });
            it('should merge all config entries to one', () => {
            });
            it('should use the latter entry if two entries has the same key', () => {
            });
        });
        it('should take code section as-is', () => {
        });
    });
    describe('install', () => {
        it('should install all code components as backend components', () => {
        });
        it('should activate all code components after install', () => {
        });
        it('should finish only after all components are done activating', () => {
        });
        it('should console log errors in the process', () => {
        });
        it('should terminate installation if an error is thrown', () => {
        });
        it('should continue installation if an error is thrown if forced by parameter', () => {
        });
    });
});