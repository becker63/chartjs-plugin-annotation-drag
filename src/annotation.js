import {Chart} from 'chart.js';
import {clipArea, unclipArea, isObject, isArray} from 'chart.js/helpers';
import {handleEvent, hooks, updateListeners} from './events';
import {adjustScaleRange, verifyScaleOptions} from './scale';
import {updateElements, resolveType} from './elements';
import {annotationTypes} from './types';
import {requireVersion} from './helpers';
import {version} from '../package.json';

const chartStates = new Map();

// Note, strange javascript 'Proxy' objects are everywhere Ill try to note them But I barely understand them yet. 

//Also note, there are two diffrent versions of 'get' and 'set', they can be proxy object 'traps' or map datatype functions. In this case these are map functions

export default {
  id: 'annotation',

  version,

  beforeRegister() {
    requireVersion('chart.js', '3.7', Chart.version);
  },

  afterRegister() {
    Chart.register(annotationTypes);
  },

  afterUnregister() {
    Chart.unregister(annotationTypes);
  },
  // full Chartjs Chart object.. found through grep search
  // Its thick.. 
  //          \/
  beforeInit(chart) {
    chartStates.set(chart, {
      annotations: [],
      elements: [],
      visibleElements: [],
      //  \/  proxy object
      listeners: {},
      listened: false,
      moveListened: false,
      hovered: []
    });
  },

  beforeUpdate(chart, args, options) {
    const state = chartStates.get(chart);
    const annotations = state.annotations = [];

    let annotationOptions = options.annotations;
    if (isObject(annotationOptions)) {
      Object.keys(annotationOptions).forEach(key => {
        const value = annotationOptions[key];
        if (isObject(value)) {
          value.id = key;
          annotations.push(value);
        }
      });
    } else if (isArray(annotationOptions)) {
      annotations.push(...annotationOptions);
    }
    verifyScaleOptions(annotations, chart.scales);
  },

  afterDataLimits(chart, args) {
    const state = chartStates.get(chart);
    adjustScaleRange(chart, args.scale, state.annotations.filter(a => a.display && a.adjustScaleRange));
  },

  afterUpdate(chart, args, options) {
    const state = chartStates.get(chart);
    // state: whether the chart has been clicked on or moved over
    // args.event: what event has been detected
    // options: chart options
    updateListeners(chart, state, options);
    updateElements(chart, state, options, args.mode);
    state.visibleElements = state.elements.filter(el => !el.skip && el.options.display);
  },

  beforeDatasetsDraw(chart, _args, options) {
    draw(chart, 'beforeDatasetsDraw', options.clip);
  },

  afterDatasetsDraw(chart, _args, options) {
    draw(chart, 'afterDatasetsDraw', options.clip);
  },

  beforeDraw(chart, _args, options) {
    draw(chart, 'beforeDraw', options.clip);
  },

  afterDraw(chart, _args, options) {
    draw(chart, 'afterDraw', options.clip);
  },

  beforeEvent(chart, args, options) {
    const state = chartStates.get(chart);
    if (handleEvent(state, args.event, options)) {
      args.changed = true;
    }

      if (args.event.type == 'click'){
      console.log('\n\noptions:',typeof(options),'\n', options, '\n\nargs:',typeof(args),'\n', args, '\n\nstate:',typeof(state),'\n', state, '\n\nchart:',typeof(chart),'\n', chart);
      }
  },

  destroy(chart) {
    chartStates.delete(chart);
  },

  _getState(chart) {
    return chartStates.get(chart);
  },

  defaults: {
    animations: {
      numbers: {
        properties: ['x', 'y', 'x2', 'y2', 'width', 'height', 'centerX', 'centerY', 'pointX', 'pointY', 'radius'],
        type: 'number'
      },
    },
    clip: true,
    interaction: {
      mode: undefined,
      axis: undefined,
      intersect: undefined
    },
    common: {
      drawTime: 'afterDatasetsDraw',
      label: {
      }
    }
  },

  descriptors: {
    _indexable: false,
    _scriptable: (prop) => !hooks.includes(prop),
    annotations: {
      _allKeys: false,
      _fallback: (prop, opts) => `elements.${annotationTypes[resolveType(opts.type)].id}`
    },
    interaction: {
      _fallback: true
    },
    common: {
      label: {
        _fallback: true
      }
    }
  },

  additionalOptionScopes: ['']
};

function draw(chart, caller, clip) {
  const {ctx, canvas, chartArea} = chart;
  const {visibleElements} = chartStates.get(chart);
  let area = {left: 0, top: 0, width: canvas.width, height: canvas.height};

  if (clip) {
    clipArea(ctx, chartArea);
    area = chartArea;
  }

  const drawableElements = getDrawableElements(visibleElements, caller, area).sort((a, b) => a.element.options.z - b.element.options.z);

  for (const item of drawableElements) {
    item.element.draw(chart.ctx, item.area);
  }

  if (clip) {
    unclipArea(ctx);
  }
}

function getDrawableElements(elements, caller, area) {
  const drawableElements = [];
  for (const el of elements) {
    if (el.options.drawTime === caller) {
      drawableElements.push({element: el, area});
    }
    if (el.elements && el.elements.length) {
      const box = 'getBoundingBox' in el ? el.getBoundingBox() : area;
      for (const sub of el.elements) {
        if (sub.options.display && sub.options.drawTime === caller) {
          drawableElements.push({element: sub, area: box});
        }
      }
    }
  }
  return drawableElements;
}
