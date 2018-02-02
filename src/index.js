import componentClosest from 'component-closest';

/**
 * Higher Order Function for getting resolvers
 */
export function getResolveFunction(getHandler, defaultParseString) {
  return function(strings, context, parseString) {
    return strings.map(str => {
      return getHandler.apply(
        context,
        (parseString || defaultParseString)(str)
      );
    });
  };
}

/**
 * General getEventHandler
 */
export function getEventHandler(handlerName, eventType, ...args) {
  // Check handler defined
  if (typeof this[handlerName] === 'undefined') {
    throw new ReferenceError(`Missing event handler "${handlerName}" for ${this.constructor.name}.`);
  }
  // Handler method
  const handler = (event, ...handlerArgs) => {
    this[handlerName](event, ...args.concat(handlerArgs));
  };
  // Set attributes on handler for easy add/remove listeners
  handler.eventType = eventType;
  // Return handler
  return handler;
}

/*************************
 **** Route resolving ****
 *************************/

/**
 * Convert route strings to RexExps and handlers.
 * Example strings:
 * "^/project/new$: onNewProjectRoute"
 * "^/user/[\w\-]+$: onUserRoute"
 */
export const resolveRoutes = getResolveFunction(getRouteHandler, defaultParseRouteString);

/**
 * getRouteHandler
 */
export function getRouteHandler(handlerName, pathnameRegExp) {
  // Check handler defined
  if (typeof this[handlerName] === 'undefined') {
    throw new ReferenceError(`Missing route handler "${handlerName}" for ${this.constructor.name}.`);
  }
  // Handler method
  const handler = (pathname, ...args) => {
    const matches = pathname.match(pathnameRegExp);
    if (matches) {
      this[handlerName](...matches);
    }
  };
  // Return handler
  return handler;
}

/**
 * Parse route params from string.
 */
export function defaultParseRouteString(routeStr) {
  /* eslint-disable no-unused-vars */
  const [all, pathnameRegExp, handlerName] = routeStr.match(defaultRouteHandlerRegexp);
  /* eslint-enable no-unused-vars */
  return [handlerName, pathnameRegExp];
}

/**
 * Route handler string regexp.
 * Pattern:
 * "$pathnameRegExp: $handlerName"
 * Matches strings:
 * "^/project/new$: onNewProjectRoute"
 * "^/user/[\w\-]+$: onUserRoute"
 */
export const defaultRouteHandlerRegexp = /^(.+):\s(\S+)$/;

/*****************************
 **** DOM event resolving ****
 *****************************/

/**
 * Convert event handler strings to bound event handlers.
 * Example strings:
 * "change .component > .selector: onComponentChange"
 * "click: onClick"
 */
export const resolveDOMEventHandlers = getResolveFunction(getDOMEventHandler, defaultParseDOMEventHandlerString);

/**
 * getDOMEventHandler
 */
export function getDOMEventHandler(handlerName, eventType, selector, useCapture, ...args) {
  // Check handler defined
  if (typeof this[handlerName] === 'undefined') {
    throw new ReferenceError(
      `Missing DOM event handler "${handlerName}" for ${this.constructor.name}.`
    );
  }
  // Handler method
  const handler = (event, ...handlerArgs) => {
    // Find closest parent that matches selector
    const currentTarget = componentClosest(event.target, selector, event.currentTarget);
    // If no selector or currentTarget found
    if (!selector || currentTarget) {
      // Copy event properties into event substitute object
      // and set currentTarget and originalEvent.
      const newEventObj = Object.assign(
        eventProps.reduce((o, a) => { o[a] = event[a]; return o; }, {}),
        {currentTarget, originalEvent: event}
      );
      // Call handler
      this[handlerName](newEventObj, ...args.concat(handlerArgs));
    }
  };
  // Set attributes on handler for easy add/remove listeners
  handler.eventType = eventType;
  handler.useCapture = useCapture;
  // Return handler
  return handler;
}

/**
 * Parse DOM event handler params from string.
 */
export function defaultParseDOMEventHandlerString(eventHandlerStr) {
  /* eslint-disable no-unused-vars */
  const [all, eventType, selector, handlerName] = eventHandlerStr.match(defaultDOMEventHandlerRegexp);
  /* eslint-enable no-unused-vars */
  return [handlerName, eventType, selector, false];
}

/**
 * Event handler string regexp.
 * Pattern:
 * "$eventType: $handlerName"
 * "$eventType $selector: $handlerName"
 * Matches strings:
 * "click: onClick"
 * "change .component > .selector: onComponentChange"
 */
export const defaultDOMEventHandlerRegexp = /^(\S+)\s*(.*):\s(\S+)$/;

/*******************************
 **** Model event resolving ****
 *******************************/

/**
 * Convert event handler strings to bound event handlers.
 * Example strings:
 * "change: onModelChange"
 * "change width: onWidthChange"
 */
export const resolveModelEventHandlers = getResolveFunction(getEventHandler, defaultParseModelEventHandlerString);

/**
 * Parse model event handler params from string.
 */
export function defaultParseModelEventHandlerString(eventHandlerStr) {
  /* eslint-disable no-unused-vars */
  const [all, eventType, property, handlerName] = eventHandlerStr.match(defaultDOMEventHandlerRegexp);
  /* eslint-enable no-unused-vars */
  return [handlerName, eventType, property];
}

/**
 * Event handler string regexp.
 * Pattern:
 * "$eventType: $handlerName"
 * "$eventType $property: $handlerName"
 * Matches strings:
 * "change: onModelChange"
 * "change width: onWidthChange"
 */
export const defaultModelEventHandlerRegexp = /^(\S+)\s*(.*):\s(\S+)$/;

/**
 * Properties in MouseEvent + KeyboardEvent (Chrome).
 * Helper for DOM event handler
 */
const eventProps = [
  'altKey',
  'bubbles',
  'button',
  'buttons',
  'cancelBubble',
  'cancelable',
  'charCode',
  'clientX',
  'clientY',
  'code',
  'composed',
  'ctrlKey',
  'currentTarget',
  'defaultPrevented',
  'detail',
  'eventPhase',
  'fromElement',
  'isComposing',
  'isTrusted',
  'key',
  'keyCode',
  'layerX',
  'layerY',
  'location',
  'metaKey',
  'movementX',
  'movementY',
  'offsetX',
  'offsetY',
  'pageX',
  'pageY',
  'path',
  'relatedTarget',
  'repeat',
  'returnValue',
  'screenX',
  'screenY',
  'shiftKey',
  'sourceCapabilities',
  'srcElement',
  'target',
  'timeStamp',
  'toElement',
  'type',
  'view',
  'which',
  'x',
  'y'
];
