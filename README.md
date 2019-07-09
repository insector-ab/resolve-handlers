# Resolve handlers &middot; [![GitHub license](https://img.shields.io/github/license/insector-ab/resolve-handlers.svg)](https://github.com/insector-ab/resolve-handlers/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/resolve-handlers.svg?style=flat)](https://www.npmjs.com/package/resolve-handlers)

Resolve handlers using strings. Inspired by event delegation in [Backbone.js](http://backbonejs.org/#Events).

## Installation

```sh
npm install resolve-handlers
```

## Example usage
```javascript
import { resolveDOMEventHandlers } from 'resolve-handlers';

/**
 * CommentController
 */
export default class CommentController {

  constructor(element) {
    // Target for event listeners
    this.element = element;
    // Resolve event handlers
    this._resolvedEventHandlers = resolveDOMEventHandlers.call(this, this.getEventHandlerStrings());
    // Add event listeners
    this.addEventListeners();
  }

  getEventHandlerStrings() {
    return [
      'click .comment > .btn-delete: onDeleteCommentClick',
      'focusin .comment: onCommentFocus',
      'click .comment: onCommentClick'
    ];
  }

  onDeleteCommentClick() {
    /* delete handler */
  }

  onCommentFocus() {
    /* focus handler */
  }

  onCommentClick() {
    /* click handler */
  }

  addEventListeners() {
    this._resolvedEventHandlers.forEach(eventHandler => {
      this.element.addEventListener(eventHandler.eventType, eventHandler);
    });
  }

  removeEventListeners() {
    this._resolvedEventHandlers.forEach(eventHandler => {
      this.element.removeEventListener(eventHandler.eventType, eventHandler);
    });
  }

}
```


## Change log

### 0.3.0
* getResolveFunction now returns a function that needs context.
* resolveDOMEventHandlers tests.
* Dev env config and dependency updates (eslint, babel, nyc).

### 0.2.0
* Removed dependency component-closest


## License

This software is licensed under the [MIT License](https://github.com/insector-ab/resolve-handlers/blob/master/LICENSE).
