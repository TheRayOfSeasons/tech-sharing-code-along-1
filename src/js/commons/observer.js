/**
 * This manages all intersection callbacks into one observer.
 */

/**
 * @typedef {{(entry: IntersectionObserverEntry): void}} ObserverCallback
 */

/**
 * A wrapper class for an IntersectionObserver
 * that handles all intersection callbacks.
 */
class Observer {
  /**
   * @type {IntersectionObserverInit}
   */
  options = {
    root: null,
    rootMargin: '0px',
    threshold: [0, 1],
  };

  /**
   * @type {ObserverCallback[]}
   */
  hooks = [];

  constructor() {
    this.observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        for (const hook of this.hooks) {
          hook(entry);
        }
      }
    }, this.options);
  }

  /**
   * @param {Element} element
   */
  observe(element) {
    this.observer.observe(element);
  }

  /**
   * @param {Element} element
   */
  unobserve(element) {
    this.observer.unobserve(element);
  }

  /**
   * Subscribes a function into the observer, then
   * returns the index of the function as an ID.
   * @param {ObserverCallback} subscriber
   * @returns {Number}
   */
  subscribe(subscriber) {
    const index = this.hooks.push(subscriber) - 1;
    return index;
  }

  /**
   * Unsubscribes a function from the observer based on its index.
   * @param {Number} index
   * @returns {ObserverCallback}
   */
  unsubscribe(index) {
    return this.hooks.splice(index, 1);
  }
}

export const observer = new Observer();
