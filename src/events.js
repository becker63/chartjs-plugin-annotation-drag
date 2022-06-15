import {defined, callback} from 'chart.js/helpers';
import {getElements} from './interaction';
import {toPosition} from './helpers/helpers.options';
 //test
const moveHooks = ['enter', 'leave','click'];

/**
 * @typedef { import("chart.js").Chart } Chart
 * @typedef { import('../../types/options').AnnotationPluginOptions } AnnotationPluginOptions
 */

export const hooks = moveHooks.concat('mousedown');


/**
 * @param {Chart} chart
 * @param {Object} state
 * @param {AnnotationPluginOptions} options
 */
export function updateListeners(chart, state, options) {
  state.listened = false;
  state.moveListened = false;
  state._getElements = getElements; // for testing

  hooks.forEach(hook => {
    if (typeof options[hook] === 'function') {
      console.log(options)
      state.listened = true;
      state.listeners[hook] = options[hook];
    } else if (defined(state.listeners[hook])) {
      delete state.listeners[hook];
    }
  });

  draghook.forEach(hook => {
    if (typeof options[hook] === 'function') {
      state.listened = true;
      state.listeners[hook] = options[hook];
    } else if (defined(state.listeners[hook])) {
      delete state.listeners[hook];
    }
  });

  moveHooks.forEach(hook => {
    if (typeof options[hook] === 'function') {
      state.moveListened = true;
    }
  });

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
    changed = debug(element.options.click || listeners.click, element, event) || changed;
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

function debug(handler, element, event){
  console.log('handler: ', handler, '\nelement: ', element, '\nevent: ', event)
}

function dispatchEvent(handler, element, event) {
  return callback(handler, [element.$context, event]) === true;
}
