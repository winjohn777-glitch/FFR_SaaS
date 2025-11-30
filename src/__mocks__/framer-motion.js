const React = require('react');

const createMotionComponent = (tag) => ({ children, ...props }) =>
  React.createElement(tag, props, children);

module.exports = {
  motion: {
    div: createMotionComponent('div'),
    button: createMotionComponent('button'),
    form: createMotionComponent('form'),
    nav: createMotionComponent('nav'),
    section: createMotionComponent('section'),
    header: createMotionComponent('header'),
    main: createMotionComponent('main'),
    aside: createMotionComponent('aside'),
    article: createMotionComponent('article'),
    footer: createMotionComponent('footer'),
    span: createMotionComponent('span'),
    p: createMotionComponent('p'),
    h1: createMotionComponent('h1'),
    h2: createMotionComponent('h2'),
    h3: createMotionComponent('h3'),
    ul: createMotionComponent('ul'),
    li: createMotionComponent('li'),
  },
  AnimatePresence: ({ children }) =>
    React.createElement('div', { 'data-testid': 'animate-presence' }, children),
};