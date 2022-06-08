(window.webpackJsonp=window.webpackJsonp||[]).push([[33],{524:function(n,e,t){"use strict";t.r(e);var o=t(22),a=Object(o.a)({},(function(){var n=this.$createElement,e=this._self._c||n;return e("ContentSlotsDistributor",{attrs:{"slot-key":this.$parent.slotKey}},[e("h1",{attrs:{id:"dragging-annotations"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#dragging-annotations"}},[this._v("#")]),this._v(" Dragging annotations")]),this._v(" "),e("chart-editor",{attrs:{code:"// <block:setup:6>\nUtils.srand(8);\n\nconst data = {\n  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],\n  datasets: [{\n    type: 'line',\n    label: 'Dataset 1',\n    borderColor: 'rgb(54, 162, 235)',\n    borderWidth: 2,\n    fill: false,\n    data: Utils.numbers({count: 7, min: 0, max: 100}),\n  }]\n};\n// </block:setup>\n\n// <block:annotation1:1>\nconst annotation1 = {\n  type: 'box',\n  backgroundColor: 'rgba(165, 214, 167, 0.2)',\n  borderColor: 'rgb(165, 214, 167)',\n  borderWidth: 2,\n  label: {\n    display: true,\n    content: ['Box annotation', 'to drag'],\n    textAlign: 'center'\n  },\n  xMax: 'May',\n  xMin: 'April',\n  xScaleID: 'x',\n  yMax: 75,\n  yMin: 25,\n  yScaleID: 'y'\n};\n// </block:annotation1>\n\n// <block:annotation2:2>\nconst annotation2 = {\n  type: 'label',\n  backgroundColor: 'rgba(255, 99, 132, 0.25)',\n  borderWidth: 3,\n  borderColor: 'black',\n  content: ['Label annotation', 'to drag'],\n  callout: {\n    display: true,\n    borderColor: 'black',\n  },\n  xValue: 1,\n  yValue: 40\n};\n// </block:annotation2>\n\n// <block:annotation3:3>\nconst annotation3 = {\n  type: 'point',\n  backgroundColor: 'rgba(0, 255, 255, 0.4)',\n  borderWidth: 2,\n  borderColor: 'black',\n  radius: 20,\n  xValue: 'March',\n  yValue: 50\n};\n// </block:annotation3>\n\n// <block:annotation4:4>\nconst annotation4 = {\n  type: 'polygon',\n  backgroundColor: 'rgba(150, 0, 0, 0.25)',\n  borderWidth: 2,\n  borderColor: 'black',\n  radius: 50,\n  sides: 6,\n  xValue: 'June',\n  yValue: 20\n};\n// </block:annotation4>\n\n// <block:utils:7>\nlet element;\nlet lastEvent;\n\nconst drag = function(moveX, moveY) {\n  element.x += moveX;\n  element.y += moveY;\n  element.x2 += moveX;\n  element.y2 += moveY;\n  element.centerX += moveX;\n  element.centerY += moveY;\n  if (element.elements && element.elements.length) {\n    for (const subEl of element.elements) {\n      subEl.x += moveX;\n      subEl.y += moveY;\n      subEl.x2 += moveX;\n      subEl.y2 += moveY;\n      subEl.centerX += moveX;\n      subEl.centerY += moveY;\n      subEl.bX += moveX;\n      subEl.bY += moveY;\n    }\n  }\n};\n\nconst handleElementDragging = function(event) {\n  if (!lastEvent || !element) {\n    return;\n  }\n  const moveX = event.x - lastEvent.x;\n  const moveY = event.y - lastEvent.y;\n  drag(moveX, moveY);\n  lastEvent = event;\n  return true;\n};\n\nconst handleDrag = function(event) {\n  if (element) {\n    switch (event.type) {\n    case 'mousemove':\n      return handleElementDragging(event);\n    case 'mouseout':\n    case 'mouseup':\n      lastEvent = undefined;\n      break;\n    case 'mousedown':\n      lastEvent = event;\n      break;\n    default:\n    }\n  }\n};\n// </block:utils>\n\n// <block:dragger:5>\nconst dragger = {\n  id: 'dragger',\n  beforeEvent(chart, args, options) {\n    if (handleDrag(args.event)) {\n      args.changed = true;\n      return;\n    }\n  }\n};\n// </block:dragger>\n\n/* <block:config:0> */\nconst config = {\n  type: 'line',\n  plugins: [dragger],\n  data,\n  options: {\n    events: ['mousedown', 'mouseup', 'mousemove', 'mouseout'],\n    scales: {\n      y: {\n        beginAtZero: true,\n        min: 0,\n        max: 100\n      }\n    },\n    plugins: {\n      annotation: {\n        enter(ctx) {\n          element = ctx.element;\n        },\n        leave() {\n          element = undefined;\n          lastEvent = undefined;\n        },\n        annotations: {\n          annotation1,\n          annotation2,\n          annotation3,\n          annotation4\n        }\n      }\n    }\n  }\n};\n/* </block:config> */\n\nconst actions = [\n  {\n    name: 'Reset dragging',\n    handler: function(chart) {\n      chart.update();\n    }\n  }\n];\n\nmodule.exports = {\n  actions: actions,\n  config: config,\n};\n"}})],1)}),[],!1,null,null,null);e.default=a.exports}}]);