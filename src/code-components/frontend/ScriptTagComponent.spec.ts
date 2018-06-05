import {attributePrefix} from "./ScriptTagComponent";

xdescribe('ScriptTagComponent', () => {
    it('should call and return super\'s `run`', () => {
    });
    it(`should take every property that prefixed with ${attributePrefix} in code node and set it as an attribute of the script tag`, () => {
    });
    describe('code is a string', () => {
        it('should return a script tag with code node\'s code as content', () => {
        });
    });
    describe('code is a function', () => {
        describe('that returns a string', () => {
            it('should return a script tag with returned string as content', () => {
            });
        });
        describe('that returns an IScript object', () => {
            it('should return a script tag with respective attributes and code', () => {
            });
            it('should default code to an empty string', () => {
            });
            it('should override returned object `attributes` from code node\'s', () => {
            });
        });
    });
});