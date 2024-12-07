/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function CoolerRectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}

function Rectangle(width, height) {
  return new CoolerRectangle(width, height);
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CssSelector {
  constructor() {
    this.parts = {
      element: '',
      id: '',
      class: [],
      attr: [],
      pseudoClass: [],
      pseudoElement: '',
    };
    this.order = [];
    this.currentOrder = 0;
  }

  checkOrder(partOrder) {
    if (this.currentOrder > partOrder) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.currentOrder = partOrder;
  }

  element(value) {
    this.checkOrder(1);
    if (this.parts.element) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.parts.element = value;
    return this;
  }

  id(value) {
    this.checkOrder(2);
    if (this.parts.id) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.parts.id = `#${value}`;
    return this;
  }

  class(value) {
    this.checkOrder(3);
    this.parts.class.push(`.${value}`);
    return this;
  }

  attr(value) {
    this.checkOrder(4);
    this.parts.attr.push(`[${value}]`);
    return this;
  }

  pseudoClass(value) {
    this.checkOrder(5);
    this.parts.pseudoClass.push(`:${value}`);
    return this;
  }

  pseudoElement(value) {
    this.checkOrder(6);
    if (this.parts.pseudoElement) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      /*
      Полчаса этот ряженный меня мусолил за строку ошибки ПОЛЧАСА ПРИ ТОМ ЧТО В НЕЙ НИЧЕГО НЕ
      ПОМЕНЯЛОСЬ. Я копировал её из файла, менял кодировки, отдавал гугл переводчику, снова
      копировал из теста, снова он мне её браковал и главное только эти 3 однотипные строки.
      Ошибку о неправильном определении он съел, и даже не подовился, но именно с этими
      тремя мы с этим тестом танцевали хороводы, искали тайные смыслы в одних и тех же буквах
      и пинговали летающие тарелки. Но видимо только после того как в пандемониуме закончились
      демоны для призива, а пинг аккаунта бога для восхваений добавил меня в спам
      вновь СКОПИРОВАННАЯ ИЗ ТОГО ЖЕ САМОГО ТЕСТА строка, прошла успешно, и даже во всех трёх местах
      По этому на этот раз ошибку выдам я сам:

      1) 06-objects-tasks
      cssSelectorBuilder should creates css selector object with stringify() method:
      AssertionError [ERR_ASSERTION]: Please throw an exception "Element, id and pseudo-element
      should not occur more then one time inside the selector" if element, id or pseudo-element
      occurs twice or more times
      at ~/Git/mitso-core-js/test/06-objects-tests.js:262:16
      at Array.forEach (<anonymous>)
      at Context.<anonymous> (test/06-objects-tests.js:261:9)
      at Context.test (extensions/it-optional.js:17:14)
      at process.processImmediate (node:internal/timers:511:21)
      */
    }
    this.parts.pseudoElement = `::${value}`;
    return this;
  }

  stringify() {
    return this.parts.element + this.parts.id + this.parts.class.join('') + this.parts.attr.join('') + this.parts.pseudoClass.join('') + this.parts.pseudoElement;
  }
}

function CombinedCssSelector(selector11, combinator1, selector21) {
  this.selector1 = selector11;
  this.combinator = combinator1;
  this.selector2 = selector21;
  this.stringify = () => `${this.selector1.stringify()} ${this.combinator} ${this.selector2.stringify()}`;
}

const cssSelectorBuilder = {
  element(value) {
    return new CssSelector().element(value);
  },

  id(value) {
    return new CssSelector().id(value);
  },

  class(value) {
    return new CssSelector().class(value);
  },

  attr(value) {
    return new CssSelector().attr(value);
  },

  pseudoClass(value) {
    return new CssSelector().pseudoClass(value);
  },

  pseudoElement(value) {
    return new CssSelector().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new CombinedCssSelector(selector1, combinator, selector2);
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
