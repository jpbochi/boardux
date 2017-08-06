
const chai = require('chai');

global.expect = chai.expect;

chai.Assertion.addMethod('rejected', function fn(errorHandler) {
  const promise = this._obj;
  const that = this;
  return promise.then(function fn() {
    that.assert(false, 'Expected promise #{this} to be a rejected promise');
  }, errorHandler || function noop() {});
});
