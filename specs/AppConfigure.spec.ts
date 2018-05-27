describe('app configure', () => {
    describe('config', () => {
        it('should use an empty object if no entries', ()=> {});
        it('should merge all config entries to one', ()=> {});
        it('should use the latter entry if two entries has the same key', ()=> {});
    });
    describe('code', () => {
        it('should get the code executor constructor according to the node\'s type', ()=> {});
        it('should treat as server code if there is no type', ()=> {});
        it('should ignore if type is not defined', ()=> {});
        it('should setup the evaluated function', ()=> {});
        it('should throw if the code does not evaluate', ()=> {});
        it('should throw if the code evaluates to something that is not a function', ()=> {});
        it('should throw if the node is not valid for the executor', ()=> {});
        it('should setup with a function that returns the code itself if the executor supports strings', ()=> {});
        it('should finish only when all executors are done setup', () => {});
    });
});