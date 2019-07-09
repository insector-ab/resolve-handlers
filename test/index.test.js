/* eslint-env mocha */
import { expect } from 'chai';

import {
  resolveDOMEventHandlers
} from '../src/index';

/**
 * Test helper
 */

class TestCls {

  onDeleteCommentClick() {
    /* delete handler */
  }

  onCommentFocus() {
    /* focus handler */
  }

  onCommentClick() {
    /* click handler */
  }

}

/**
 * resolveDOMEventHandlers tests
 */
describe('resolveDOMEventHandlers', () => {

  const testInstance = new TestCls();

  const resolved = resolveDOMEventHandlers.call(testInstance, [
    'click .comment > .btn-delete: onDeleteCommentClick',
    'focusin .comment: onCommentFocus',
    'click .comment: onCommentClick'
  ]);

  // Missing context
  it('without context should throw “Undefined context” error', function() {
    const callWithoutContext = function() { return resolveDOMEventHandlers(['some string']); };
    expect(callWithoutContext).to.throw('Undefined context');
  });

  // Missing handler
  it('with missing handlers should throw “Missing DOM event handler”', function() {
    const callWithUndefinedHandler = function() {
      return resolveDOMEventHandlers.call(testInstance, [
        'click: thisHandlerDoesNotExist'
      ]);
    };
    expect(callWithUndefinedHandler).to.throw(/^Missing DOM event handler/);
  });

  // Return array
  it('should return an array', function() {
    expect(resolveDOMEventHandlers.call(testInstance, [])).to.be.an('array');
  });

  // With
  it('with proper input strings should return an array of functions', function() {
    expect(resolved.every(val => typeof val === 'function')).to.equal(true);
  });

});
