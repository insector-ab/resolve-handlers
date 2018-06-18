# Resolve handlers &middot; [![GitHub license](https://img.shields.io/github/license/insector-ab/resolve-handlers.svg)](https://github.com/insector-ab/resolve-handlers/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/resolve-handlers.svg?style=flat)](https://www.npmjs.com/package/resolve-handlers)

Resolve and bind handlers from strings. Inspired by event delegation in [Backbone.js](http://backbonejs.org/#Events).

## Installation

```sh
npm install resolve-handlers
```

## Example usage
```javascript
import {resolveDOMEventHandlers} from 'resolve-handlers';

/**
 * CommentController
 */
export default class CommentController {

  constructor(element) {
    // Target for event listeners
    this.element = element;
    // Resolve event handlers
    this._resolvedEventHandlers = resolveDOMEventHandlers(this.getDOMEventHandlerStrings(), this);
    // Add event listeners
    this.addEventListeners();
  }

  getDOMEventHandlerStrings() {
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

### 0.2.0
* Removed dependency component-closest


## License

This software is licensed under the [MIT License](https://github.com/insector-ab/resolve-handlers/blob/master/LICENSE).
