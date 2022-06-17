import {defined, callback} from 'chart.js/helpers';
import {getElements} from './interaction';
import {toPosition} from './helpers/helpers.options';
 //test
const moveHooks = ['enter', 'leave','mousedown'];

/**
 * @typedef { import("chart.js").Chart } Chart
 * @typedef { import('../../types/options').AnnotationPluginOptions } AnnotationPluginOptions
 */

export const hooks = moveHooks.concat('click');




/**
 * @param {Chart} chart
 * @param {Object} state
 * @param {AnnotationPluginOptions} options
 */
// This is ran every time the mouse updates, clicking and movement. 
export function updateListeners(chart, state, options) {
  state.listened = false;
  state.moveListened = false;
  state._getElements = getElements; // for testing

  hooks.forEach(hook => {
    //this checks if the user has set the click event in there annotations options
    if (typeof options[hook] === 'function') {
      state.listened = true;
      // \/ proxy object
      state.listeners[hook] = options[hook];
    } else if (defined(state.listeners[hook])) {
      delete state.listeners[hook];
    }
  });
  //same check as above for movement
  moveHooks.forEach(hook => {
    if (typeof options[hook] === 'function') {
      state.moveListened = true;
    }
  });

  // literally the same thing as the two foreaches above but goes over the annotations options thats nested inside the of the state object, I have no idea why this exists but if you remove it, things break
  if (!state.listened || !state.moveListened) {
    state.annotations.forEach(scope => {
      if (!state.listened && typeof scope.click === 'function') {
        state.listened = true;
      }
      if (!state.moveListened) {
        moveHooks.forEach(hook => {
          if (typeof scope[hook] === 'function') {
            state.listened = true;
            state.moveListened = true;
          }
        });
      }
    });
  }
}

/**
 * @param {Object} state
 * @param {ChartEvent} event
 * @param {AnnotationPluginOptions} options
 * @return {boolean|undefined}
 */
export function handleEvent(state, event, options) {
  if (state.listened) {
    switch (event.type) {
    case 'mousemove':
    case 'mouseout':
      return handleMoveEvents(state, event, options);
    case 'click':
      return handleClickEvents(state, event, options);
    case 'mousedown':
      return handleDragEvents(state, event, options);
    default:
    }
  }
}

function handleMoveEvents(state, event, options) {
  if (!state.moveListened) {
    return;
  }

  let elements;

  if (event.type === 'mousemove') {
    //gets element underneath mouse event 
    elements = getElements(state, event, options.interaction);
  } else {
    elements = [];
  }

  const previous = state.hovered;
  state.hovered = elements;

  const context = {state, event};
  let changed = dispatchMoveEvents(context, 'leave', previous, elements);
  return dispatchMoveEvents(context, 'enter', elements, previous) || changed;
}

function dispatchMoveEvents({state, event}, hook, elements, checkElements) {
  let changed;
  for (const element of elements) {
    if (checkElements.indexOf(element) < 0) {
      changed = dispatchEvent(element.options[hook] || state.listeners[hook], element, event) || changed;
    }
  }
  return changed;
}

function handleClickEvents(state, event, options) {
  const listeners = state.listeners;
  const elements = getElements(state, event, options.interaction);
  let changed;
  for (const element of elements) {
    changed = dispatchEvent(element.options.click || listeners.click, element, event) || changed;
  }
  return changed;
}

function handleDragEvents(state, event, options) {
  const listeners = state.listeners;
  const elements = getElements(state, event, options.interaction);
  let changed;
  for (const element of elements) {
    changed = dragpos(element.options.mousedown || listeners.mousedown, element, event) || changed;
  }
  return changed;
}

function dragpos(handler, element, event){
  console.log(handler, '\n', element, '\n', event, '\n')
}

function dispatchEvent(handler, element, event) {
  /**
 * Calls `fn` with the given `args` in the scope defined by `thisArg` and returns the
 * value returned by `fn`. If `fn` is not a function, this method returns undefined.
 * @param fn - The function to call.
 * @param args - The arguments with which `fn` should be called.
 * @param [thisArg] - The value of `this` provided for the call to `fn`.
 * @returns {*}
 */
  return callback(handler, [element.$context, event]) === true;
}
//that dollar sign isnt doing anything weird, its just a valid variable charecter, its old jquery stuff, heres an article.. https://web.archive.org/web/20160529121559/http://www.authenticsociety.com/blog/javascript_dollarsign