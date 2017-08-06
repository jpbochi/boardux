
const chai = require('chai');
// const sinon = require('sinon');

global.expect = chai.expect;

// chai.use(require('sinon-chai'));
chai.use(require('chai-shallow-deep-equal'));

chai.Assertion.addMethod('rejected', function fn(errorHandler) {
  const promise = this._obj;
  const that = this;
  return promise.then(function fn() {
    that.assert(false, 'Expected promise #{this} to be a rejected promise');
  }, errorHandler || function noop() {});
});
