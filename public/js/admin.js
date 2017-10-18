/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/sortablejs/Sortable.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/**!
 * Sortable
 * @author	RubaXa   <trash@rubaxa.org>
 * @license MIT
 */

(function sortableModule(factory) {
	"use strict";

	if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	else if (typeof module != "undefined" && typeof module.exports != "undefined") {
		module.exports = factory();
	}
	else {
		/* jshint sub:true */
		window["Sortable"] = factory();
	}
})(function sortableFactory() {
	"use strict";

	if (typeof window == "undefined" || !window.document) {
		return function sortableError() {
			throw new Error("Sortable.js requires a window with a document");
		};
	}

	var dragEl,
		parentEl,
		ghostEl,
		cloneEl,
		rootEl,
		nextEl,
		lastDownEl,

		scrollEl,
		scrollParentEl,
		scrollCustomFn,

		lastEl,
		lastCSS,
		lastParentCSS,

		oldIndex,
		newIndex,

		activeGroup,
		putSortable,

		autoScroll = {},

		tapEvt,
		touchEvt,

		moved,

		/** @const */
		R_SPACE = /\s+/g,
		R_FLOAT = /left|right|inline/,

		expando = 'Sortable' + (new Date).getTime(),

		win = window,
		document = win.document,
		parseInt = win.parseInt,

		$ = win.jQuery || win.Zepto,
		Polymer = win.Polymer,

		captureMode = false,

		supportDraggable = !!('draggable' in document.createElement('div')),
		supportCssPointerEvents = (function (el) {
			// false when IE11
			if (!!navigator.userAgent.match(/Trident.*rv[ :]?11\./)) {
				return false;
			}
			el = document.createElement('x');
			el.style.cssText = 'pointer-events:auto';
			return el.style.pointerEvents === 'auto';
		})(),

		_silent = false,

		abs = Math.abs,
		min = Math.min,

		savedInputChecked = [],
		touchDragOverListeners = [],

		_autoScroll = _throttle(function (/**Event*/evt, /**Object*/options, /**HTMLElement*/rootEl) {
			// Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
			if (rootEl && options.scroll) {
				var _this = rootEl[expando],
					el,
					rect,
					sens = options.scrollSensitivity,
					speed = options.scrollSpeed,

					x = evt.clientX,
					y = evt.clientY,

					winWidth = window.innerWidth,
					winHeight = window.innerHeight,

					vx,
					vy,

					scrollOffsetX,
					scrollOffsetY
				;

				// Delect scrollEl
				if (scrollParentEl !== rootEl) {
					scrollEl = options.scroll;
					scrollParentEl = rootEl;
					scrollCustomFn = options.scrollFn;

					if (scrollEl === true) {
						scrollEl = rootEl;

						do {
							if ((scrollEl.offsetWidth < scrollEl.scrollWidth) ||
								(scrollEl.offsetHeight < scrollEl.scrollHeight)
							) {
								break;
							}
							/* jshint boss:true */
						} while (scrollEl = scrollEl.parentNode);
					}
				}

				if (scrollEl) {
					el = scrollEl;
					rect = scrollEl.getBoundingClientRect();
					vx = (abs(rect.right - x) <= sens) - (abs(rect.left - x) <= sens);
					vy = (abs(rect.bottom - y) <= sens) - (abs(rect.top - y) <= sens);
				}


				if (!(vx || vy)) {
					vx = (winWidth - x <= sens) - (x <= sens);
					vy = (winHeight - y <= sens) - (y <= sens);

					/* jshint expr:true */
					(vx || vy) && (el = win);
				}


				if (autoScroll.vx !== vx || autoScroll.vy !== vy || autoScroll.el !== el) {
					autoScroll.el = el;
					autoScroll.vx = vx;
					autoScroll.vy = vy;

					clearInterval(autoScroll.pid);

					if (el) {
						autoScroll.pid = setInterval(function () {
							scrollOffsetY = vy ? vy * speed : 0;
							scrollOffsetX = vx ? vx * speed : 0;

							if ('function' === typeof(scrollCustomFn)) {
								return scrollCustomFn.call(_this, scrollOffsetX, scrollOffsetY, evt);
							}

							if (el === win) {
								win.scrollTo(win.pageXOffset + scrollOffsetX, win.pageYOffset + scrollOffsetY);
							} else {
								el.scrollTop += scrollOffsetY;
								el.scrollLeft += scrollOffsetX;
							}
						}, 24);
					}
				}
			}
		}, 30),

		_prepareGroup = function (options) {
			function toFn(value, pull) {
				if (value === void 0 || value === true) {
					value = group.name;
				}

				if (typeof value === 'function') {
					return value;
				} else {
					return function (to, from) {
						var fromGroup = from.options.group.name;

						return pull
							? value
							: value && (value.join
								? value.indexOf(fromGroup) > -1
								: (fromGroup == value)
							);
					};
				}
			}

			var group = {};
			var originalGroup = options.group;

			if (!originalGroup || typeof originalGroup != 'object') {
				originalGroup = {name: originalGroup};
			}

			group.name = originalGroup.name;
			group.checkPull = toFn(originalGroup.pull, true);
			group.checkPut = toFn(originalGroup.put);
			group.revertClone = originalGroup.revertClone;

			options.group = group;
		}
	;


	/**
	 * @class  Sortable
	 * @param  {HTMLElement}  el
	 * @param  {Object}       [options]
	 */
	function Sortable(el, options) {
		if (!(el && el.nodeType && el.nodeType === 1)) {
			throw 'Sortable: `el` must be HTMLElement, and not ' + {}.toString.call(el);
		}

		this.el = el; // root element
		this.options = options = _extend({}, options);


		// Export instance
		el[expando] = this;

		// Default options
		var defaults = {
			group: Math.random(),
			sort: true,
			disabled: false,
			store: null,
			handle: null,
			scroll: true,
			scrollSensitivity: 30,
			scrollSpeed: 10,
			draggable: /[uo]l/i.test(el.nodeName) ? 'li' : '>*',
			ghostClass: 'sortable-ghost',
			chosenClass: 'sortable-chosen',
			dragClass: 'sortable-drag',
			ignore: 'a, img',
			filter: null,
			preventOnFilter: true,
			animation: 0,
			setData: function (dataTransfer, dragEl) {
				dataTransfer.setData('Text', dragEl.textContent);
			},
			dropBubble: false,
			dragoverBubble: false,
			dataIdAttr: 'data-id',
			delay: 0,
			forceFallback: false,
			fallbackClass: 'sortable-fallback',
			fallbackOnBody: false,
			fallbackTolerance: 0,
			fallbackOffset: {x: 0, y: 0}
		};


		// Set default options
		for (var name in defaults) {
			!(name in options) && (options[name] = defaults[name]);
		}

		_prepareGroup(options);

		// Bind all private methods
		for (var fn in this) {
			if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
				this[fn] = this[fn].bind(this);
			}
		}

		// Setup drag mode
		this.nativeDraggable = options.forceFallback ? false : supportDraggable;

		// Bind events
		_on(el, 'mousedown', this._onTapStart);
		_on(el, 'touchstart', this._onTapStart);
		_on(el, 'pointerdown', this._onTapStart);

		if (this.nativeDraggable) {
			_on(el, 'dragover', this);
			_on(el, 'dragenter', this);
		}

		touchDragOverListeners.push(this._onDragOver);

		// Restore sorting
		options.store && this.sort(options.store.get(this));
	}


	Sortable.prototype = /** @lends Sortable.prototype */ {
		constructor: Sortable,

		_onTapStart: function (/** Event|TouchEvent */evt) {
			var _this = this,
				el = this.el,
				options = this.options,
				preventOnFilter = options.preventOnFilter,
				type = evt.type,
				touch = evt.touches && evt.touches[0],
				target = (touch || evt).target,
				originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0]) || target,
				filter = options.filter,
				startIndex;

			_saveInputCheckedState(el);


			// Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.
			if (dragEl) {
				return;
			}

			if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
				return; // only left button or enabled
			}


			target = _closest(target, options.draggable, el);

			if (!target) {
				return;
			}

			if (lastDownEl === target) {
				// Ignoring duplicate `down`
				return;
			}

			// Get the index of the dragged element within its parent
			startIndex = _index(target, options.draggable);

			// Check filter
			if (typeof filter === 'function') {
				if (filter.call(this, evt, target, this)) {
					_dispatchEvent(_this, originalTarget, 'filter', target, el, startIndex);
					preventOnFilter && evt.preventDefault();
					return; // cancel dnd
				}
			}
			else if (filter) {
				filter = filter.split(',').some(function (criteria) {
					criteria = _closest(originalTarget, criteria.trim(), el);

					if (criteria) {
						_dispatchEvent(_this, criteria, 'filter', target, el, startIndex);
						return true;
					}
				});

				if (filter) {
					preventOnFilter && evt.preventDefault();
					return; // cancel dnd
				}
			}

			if (options.handle && !_closest(originalTarget, options.handle, el)) {
				return;
			}

			// Prepare `dragstart`
			this._prepareDragStart(evt, touch, target, startIndex);
		},

		_prepareDragStart: function (/** Event */evt, /** Touch */touch, /** HTMLElement */target, /** Number */startIndex) {
			var _this = this,
				el = _this.el,
				options = _this.options,
				ownerDocument = el.ownerDocument,
				dragStartFn;

			if (target && !dragEl && (target.parentNode === el)) {
				tapEvt = evt;

				rootEl = el;
				dragEl = target;
				parentEl = dragEl.parentNode;
				nextEl = dragEl.nextSibling;
				lastDownEl = target;
				activeGroup = options.group;
				oldIndex = startIndex;

				this._lastX = (touch || evt).clientX;
				this._lastY = (touch || evt).clientY;

				dragEl.style['will-change'] = 'transform';

				dragStartFn = function () {
					// Delayed drag has been triggered
					// we can re-enable the events: touchmove/mousemove
					_this._disableDelayedDrag();

					// Make the element draggable
					dragEl.draggable = _this.nativeDraggable;

					// Chosen item
					_toggleClass(dragEl, options.chosenClass, true);

					// Bind the events: dragstart/dragend
					_this._triggerDragStart(evt, touch);

					// Drag start event
					_dispatchEvent(_this, rootEl, 'choose', dragEl, rootEl, oldIndex);
				};

				// Disable "draggable"
				options.ignore.split(',').forEach(function (criteria) {
					_find(dragEl, criteria.trim(), _disableDraggable);
				});

				_on(ownerDocument, 'mouseup', _this._onDrop);
				_on(ownerDocument, 'touchend', _this._onDrop);
				_on(ownerDocument, 'touchcancel', _this._onDrop);
				_on(ownerDocument, 'pointercancel', _this._onDrop);
				_on(ownerDocument, 'selectstart', _this);

				if (options.delay) {
					// If the user moves the pointer or let go the click or touch
					// before the delay has been reached:
					// disable the delayed drag
					_on(ownerDocument, 'mouseup', _this._disableDelayedDrag);
					_on(ownerDocument, 'touchend', _this._disableDelayedDrag);
					_on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
					_on(ownerDocument, 'mousemove', _this._disableDelayedDrag);
					_on(ownerDocument, 'touchmove', _this._disableDelayedDrag);
					_on(ownerDocument, 'pointermove', _this._disableDelayedDrag);

					_this._dragStartTimer = setTimeout(dragStartFn, options.delay);
				} else {
					dragStartFn();
				}


			}
		},

		_disableDelayedDrag: function () {
			var ownerDocument = this.el.ownerDocument;

			clearTimeout(this._dragStartTimer);
			_off(ownerDocument, 'mouseup', this._disableDelayedDrag);
			_off(ownerDocument, 'touchend', this._disableDelayedDrag);
			_off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
			_off(ownerDocument, 'mousemove', this._disableDelayedDrag);
			_off(ownerDocument, 'touchmove', this._disableDelayedDrag);
			_off(ownerDocument, 'pointermove', this._disableDelayedDrag);
		},

		_triggerDragStart: function (/** Event */evt, /** Touch */touch) {
			touch = touch || (evt.pointerType == 'touch' ? evt : null);

			if (touch) {
				// Touch device support
				tapEvt = {
					target: dragEl,
					clientX: touch.clientX,
					clientY: touch.clientY
				};

				this._onDragStart(tapEvt, 'touch');
			}
			else if (!this.nativeDraggable) {
				this._onDragStart(tapEvt, true);
			}
			else {
				_on(dragEl, 'dragend', this);
				_on(rootEl, 'dragstart', this._onDragStart);
			}

			try {
				if (document.selection) {
					// Timeout neccessary for IE9
					setTimeout(function () {
						document.selection.empty();
					});
				} else {
					window.getSelection().removeAllRanges();
				}
			} catch (err) {
			}
		},

		_dragStarted: function () {
			if (rootEl && dragEl) {
				var options = this.options;

				// Apply effect
				_toggleClass(dragEl, options.ghostClass, true);
				_toggleClass(dragEl, options.dragClass, false);

				Sortable.active = this;

				// Drag start event
				_dispatchEvent(this, rootEl, 'start', dragEl, rootEl, oldIndex);
			} else {
				this._nulling();
			}
		},

		_emulateDragOver: function () {
			if (touchEvt) {
				if (this._lastX === touchEvt.clientX && this._lastY === touchEvt.clientY) {
					return;
				}

				this._lastX = touchEvt.clientX;
				this._lastY = touchEvt.clientY;

				if (!supportCssPointerEvents) {
					_css(ghostEl, 'display', 'none');
				}

				var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY),
					parent = target,
					i = touchDragOverListeners.length;

				if (parent) {
					do {
						if (parent[expando]) {
							while (i--) {
								touchDragOverListeners[i]({
									clientX: touchEvt.clientX,
									clientY: touchEvt.clientY,
									target: target,
									rootEl: parent
								});
							}

							break;
						}

						target = parent; // store last element
					}
					/* jshint boss:true */
					while (parent = parent.parentNode);
				}

				if (!supportCssPointerEvents) {
					_css(ghostEl, 'display', '');
				}
			}
		},


		_onTouchMove: function (/**TouchEvent*/evt) {
			if (tapEvt) {
				var	options = this.options,
					fallbackTolerance = options.fallbackTolerance,
					fallbackOffset = options.fallbackOffset,
					touch = evt.touches ? evt.touches[0] : evt,
					dx = (touch.clientX - tapEvt.clientX) + fallbackOffset.x,
					dy = (touch.clientY - tapEvt.clientY) + fallbackOffset.y,
					translate3d = evt.touches ? 'translate3d(' + dx + 'px,' + dy + 'px,0)' : 'translate(' + dx + 'px,' + dy + 'px)';

				// only set the status to dragging, when we are actually dragging
				if (!Sortable.active) {
					if (fallbackTolerance &&
						min(abs(touch.clientX - this._lastX), abs(touch.clientY - this._lastY)) < fallbackTolerance
					) {
						return;
					}

					this._dragStarted();
				}

				// as well as creating the ghost element on the document body
				this._appendGhost();

				moved = true;
				touchEvt = touch;

				_css(ghostEl, 'webkitTransform', translate3d);
				_css(ghostEl, 'mozTransform', translate3d);
				_css(ghostEl, 'msTransform', translate3d);
				_css(ghostEl, 'transform', translate3d);

				evt.preventDefault();
			}
		},

		_appendGhost: function () {
			if (!ghostEl) {
				var rect = dragEl.getBoundingClientRect(),
					css = _css(dragEl),
					options = this.options,
					ghostRect;

				ghostEl = dragEl.cloneNode(true);

				_toggleClass(ghostEl, options.ghostClass, false);
				_toggleClass(ghostEl, options.fallbackClass, true);
				_toggleClass(ghostEl, options.dragClass, true);

				_css(ghostEl, 'top', rect.top - parseInt(css.marginTop, 10));
				_css(ghostEl, 'left', rect.left - parseInt(css.marginLeft, 10));
				_css(ghostEl, 'width', rect.width);
				_css(ghostEl, 'height', rect.height);
				_css(ghostEl, 'opacity', '0.8');
				_css(ghostEl, 'position', 'fixed');
				_css(ghostEl, 'zIndex', '100000');
				_css(ghostEl, 'pointerEvents', 'none');

				options.fallbackOnBody && document.body.appendChild(ghostEl) || rootEl.appendChild(ghostEl);

				// Fixing dimensions.
				ghostRect = ghostEl.getBoundingClientRect();
				_css(ghostEl, 'width', rect.width * 2 - ghostRect.width);
				_css(ghostEl, 'height', rect.height * 2 - ghostRect.height);
			}
		},

		_onDragStart: function (/**Event*/evt, /**boolean*/useFallback) {
			var dataTransfer = evt.dataTransfer,
				options = this.options;

			this._offUpEvents();

			if (activeGroup.checkPull(this, this, dragEl, evt)) {
				cloneEl = _clone(dragEl);

				cloneEl.draggable = false;
				cloneEl.style['will-change'] = '';

				_css(cloneEl, 'display', 'none');
				_toggleClass(cloneEl, this.options.chosenClass, false);

				rootEl.insertBefore(cloneEl, dragEl);
				_dispatchEvent(this, rootEl, 'clone', dragEl);
			}

			_toggleClass(dragEl, options.dragClass, true);

			if (useFallback) {
				if (useFallback === 'touch') {
					// Bind touch events
					_on(document, 'touchmove', this._onTouchMove);
					_on(document, 'touchend', this._onDrop);
					_on(document, 'touchcancel', this._onDrop);
					_on(document, 'pointermove', this._onTouchMove);
					_on(document, 'pointerup', this._onDrop);
				} else {
					// Old brwoser
					_on(document, 'mousemove', this._onTouchMove);
					_on(document, 'mouseup', this._onDrop);
				}

				this._loopId = setInterval(this._emulateDragOver, 50);
			}
			else {
				if (dataTransfer) {
					dataTransfer.effectAllowed = 'move';
					options.setData && options.setData.call(this, dataTransfer, dragEl);
				}

				_on(document, 'drop', this);
				setTimeout(this._dragStarted, 0);
			}
		},

		_onDragOver: function (/**Event*/evt) {
			var el = this.el,
				target,
				dragRect,
				targetRect,
				revert,
				options = this.options,
				group = options.group,
				activeSortable = Sortable.active,
				isOwner = (activeGroup === group),
				isMovingBetweenSortable = false,
				canSort = options.sort;

			if (evt.preventDefault !== void 0) {
				evt.preventDefault();
				!options.dragoverBubble && evt.stopPropagation();
			}

			if (dragEl.animated) {
				return;
			}

			moved = true;

			if (activeSortable && !options.disabled &&
				(isOwner
					? canSort || (revert = !rootEl.contains(dragEl)) // Reverting item into the original list
					: (
						putSortable === this ||
						(
							(activeSortable.lastPullMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) &&
							group.checkPut(this, activeSortable, dragEl, evt)
						)
					)
				) &&
				(evt.rootEl === void 0 || evt.rootEl === this.el) // touch fallback
			) {
				// Smart auto-scrolling
				_autoScroll(evt, options, this.el);

				if (_silent) {
					return;
				}

				target = _closest(evt.target, options.draggable, el);
				dragRect = dragEl.getBoundingClientRect();

				if (putSortable !== this) {
					putSortable = this;
					isMovingBetweenSortable = true;
				}

				if (revert) {
					_cloneHide(activeSortable, true);
					parentEl = rootEl; // actualization

					if (cloneEl || nextEl) {
						rootEl.insertBefore(dragEl, cloneEl || nextEl);
					}
					else if (!canSort) {
						rootEl.appendChild(dragEl);
					}

					return;
				}


				if ((el.children.length === 0) || (el.children[0] === ghostEl) ||
					(el === evt.target) && (_ghostIsLast(el, evt))
				) {
					//assign target only if condition is true
					if (el.children.length !== 0 && el.children[0] !== ghostEl && el === evt.target) {
						target = el.lastElementChild;
					}

					if (target) {
						if (target.animated) {
							return;
						}

						targetRect = target.getBoundingClientRect();
					}

					_cloneHide(activeSortable, isOwner);

					if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt) !== false) {
						if (!dragEl.contains(el)) {
							el.appendChild(dragEl);
							parentEl = el; // actualization
						}

						this._animate(dragRect, dragEl);
						target && this._animate(targetRect, target);
					}
				}
				else if (target && !target.animated && target !== dragEl && (target.parentNode[expando] !== void 0)) {
					if (lastEl !== target) {
						lastEl = target;
						lastCSS = _css(target);
						lastParentCSS = _css(target.parentNode);
					}

					targetRect = target.getBoundingClientRect();

					var width = targetRect.right - targetRect.left,
						height = targetRect.bottom - targetRect.top,
						floating = R_FLOAT.test(lastCSS.cssFloat + lastCSS.display)
							|| (lastParentCSS.display == 'flex' && lastParentCSS['flex-direction'].indexOf('row') === 0),
						isWide = (target.offsetWidth > dragEl.offsetWidth),
						isLong = (target.offsetHeight > dragEl.offsetHeight),
						halfway = (floating ? (evt.clientX - targetRect.left) / width : (evt.clientY - targetRect.top) / height) > 0.5,
						nextSibling = target.nextElementSibling,
						after = false
					;

					if (floating) {
						var elTop = dragEl.offsetTop,
							tgTop = target.offsetTop;

						if (elTop === tgTop) {
							after = (target.previousElementSibling === dragEl) && !isWide || halfway && isWide;
						}
						else if (target.previousElementSibling === dragEl || dragEl.previousElementSibling === target) {
							after = (evt.clientY - targetRect.top) / height > 0.5;
						} else {
							after = tgTop > elTop;
						}
						} else if (!isMovingBetweenSortable) {
						after = (nextSibling !== dragEl) && !isLong || halfway && isLong;
					}

					var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);

					if (moveVector !== false) {
						if (moveVector === 1 || moveVector === -1) {
							after = (moveVector === 1);
						}

						_silent = true;
						setTimeout(_unsilent, 30);

						_cloneHide(activeSortable, isOwner);

						if (!dragEl.contains(el)) {
							if (after && !nextSibling) {
								el.appendChild(dragEl);
							} else {
								target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
							}
						}

						parentEl = dragEl.parentNode; // actualization

						this._animate(dragRect, dragEl);
						this._animate(targetRect, target);
					}
				}
			}
		},

		_animate: function (prevRect, target) {
			var ms = this.options.animation;

			if (ms) {
				var currentRect = target.getBoundingClientRect();

				if (prevRect.nodeType === 1) {
					prevRect = prevRect.getBoundingClientRect();
				}

				_css(target, 'transition', 'none');
				_css(target, 'transform', 'translate3d('
					+ (prevRect.left - currentRect.left) + 'px,'
					+ (prevRect.top - currentRect.top) + 'px,0)'
				);

				target.offsetWidth; // repaint

				_css(target, 'transition', 'all ' + ms + 'ms');
				_css(target, 'transform', 'translate3d(0,0,0)');

				clearTimeout(target.animated);
				target.animated = setTimeout(function () {
					_css(target, 'transition', '');
					_css(target, 'transform', '');
					target.animated = false;
				}, ms);
			}
		},

		_offUpEvents: function () {
			var ownerDocument = this.el.ownerDocument;

			_off(document, 'touchmove', this._onTouchMove);
			_off(document, 'pointermove', this._onTouchMove);
			_off(ownerDocument, 'mouseup', this._onDrop);
			_off(ownerDocument, 'touchend', this._onDrop);
			_off(ownerDocument, 'pointerup', this._onDrop);
			_off(ownerDocument, 'touchcancel', this._onDrop);
			_off(ownerDocument, 'pointercancel', this._onDrop);
			_off(ownerDocument, 'selectstart', this);
		},

		_onDrop: function (/**Event*/evt) {
			var el = this.el,
				options = this.options;

			clearInterval(this._loopId);
			clearInterval(autoScroll.pid);
			clearTimeout(this._dragStartTimer);

			// Unbind events
			_off(document, 'mousemove', this._onTouchMove);

			if (this.nativeDraggable) {
				_off(document, 'drop', this);
				_off(el, 'dragstart', this._onDragStart);
			}

			this._offUpEvents();

			if (evt) {
				if (moved) {
					evt.preventDefault();
					!options.dropBubble && evt.stopPropagation();
				}

				ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);

				if (rootEl === parentEl || Sortable.active.lastPullMode !== 'clone') {
					// Remove clone
					cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
				}

				if (dragEl) {
					if (this.nativeDraggable) {
						_off(dragEl, 'dragend', this);
					}

					_disableDraggable(dragEl);
					dragEl.style['will-change'] = '';

					// Remove class's
					_toggleClass(dragEl, this.options.ghostClass, false);
					_toggleClass(dragEl, this.options.chosenClass, false);

					// Drag stop event
					_dispatchEvent(this, rootEl, 'unchoose', dragEl, rootEl, oldIndex);

					if (rootEl !== parentEl) {
						newIndex = _index(dragEl, options.draggable);

						if (newIndex >= 0) {
							// Add event
							_dispatchEvent(null, parentEl, 'add', dragEl, rootEl, oldIndex, newIndex);

							// Remove event
							_dispatchEvent(this, rootEl, 'remove', dragEl, rootEl, oldIndex, newIndex);

							// drag from one list and drop into another
							_dispatchEvent(null, parentEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
							_dispatchEvent(this, rootEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
						}
					}
					else {
						if (dragEl.nextSibling !== nextEl) {
							// Get the index of the dragged element within its parent
							newIndex = _index(dragEl, options.draggable);

							if (newIndex >= 0) {
								// drag & drop within the same list
								_dispatchEvent(this, rootEl, 'update', dragEl, rootEl, oldIndex, newIndex);
								_dispatchEvent(this, rootEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
							}
						}
					}

					if (Sortable.active) {
						/* jshint eqnull:true */
						if (newIndex == null || newIndex === -1) {
							newIndex = oldIndex;
						}

						_dispatchEvent(this, rootEl, 'end', dragEl, rootEl, oldIndex, newIndex);

						// Save sorting
						this.save();
					}
				}

			}

			this._nulling();
		},

		_nulling: function() {
			rootEl =
			dragEl =
			parentEl =
			ghostEl =
			nextEl =
			cloneEl =
			lastDownEl =

			scrollEl =
			scrollParentEl =

			tapEvt =
			touchEvt =

			moved =
			newIndex =

			lastEl =
			lastCSS =

			putSortable =
			activeGroup =
			Sortable.active = null;

			savedInputChecked.forEach(function (el) {
				el.checked = true;
			});
			savedInputChecked.length = 0;
		},

		handleEvent: function (/**Event*/evt) {
			switch (evt.type) {
				case 'drop':
				case 'dragend':
					this._onDrop(evt);
					break;

				case 'dragover':
				case 'dragenter':
					if (dragEl) {
						this._onDragOver(evt);
						_globalDragOver(evt);
					}
					break;

				case 'selectstart':
					evt.preventDefault();
					break;
			}
		},


		/**
		 * Serializes the item into an array of string.
		 * @returns {String[]}
		 */
		toArray: function () {
			var order = [],
				el,
				children = this.el.children,
				i = 0,
				n = children.length,
				options = this.options;

			for (; i < n; i++) {
				el = children[i];
				if (_closest(el, options.draggable, this.el)) {
					order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
				}
			}

			return order;
		},


		/**
		 * Sorts the elements according to the array.
		 * @param  {String[]}  order  order of the items
		 */
		sort: function (order) {
			var items = {}, rootEl = this.el;

			this.toArray().forEach(function (id, i) {
				var el = rootEl.children[i];

				if (_closest(el, this.options.draggable, rootEl)) {
					items[id] = el;
				}
			}, this);

			order.forEach(function (id) {
				if (items[id]) {
					rootEl.removeChild(items[id]);
					rootEl.appendChild(items[id]);
				}
			});
		},


		/**
		 * Save the current sorting
		 */
		save: function () {
			var store = this.options.store;
			store && store.set(this);
		},


		/**
		 * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
		 * @param   {HTMLElement}  el
		 * @param   {String}       [selector]  default: `options.draggable`
		 * @returns {HTMLElement|null}
		 */
		closest: function (el, selector) {
			return _closest(el, selector || this.options.draggable, this.el);
		},


		/**
		 * Set/get option
		 * @param   {string} name
		 * @param   {*}      [value]
		 * @returns {*}
		 */
		option: function (name, value) {
			var options = this.options;

			if (value === void 0) {
				return options[name];
			} else {
				options[name] = value;

				if (name === 'group') {
					_prepareGroup(options);
				}
			}
		},


		/**
		 * Destroy
		 */
		destroy: function () {
			var el = this.el;

			el[expando] = null;

			_off(el, 'mousedown', this._onTapStart);
			_off(el, 'touchstart', this._onTapStart);
			_off(el, 'pointerdown', this._onTapStart);

			if (this.nativeDraggable) {
				_off(el, 'dragover', this);
				_off(el, 'dragenter', this);
			}

			// Remove draggable attributes
			Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
				el.removeAttribute('draggable');
			});

			touchDragOverListeners.splice(touchDragOverListeners.indexOf(this._onDragOver), 1);

			this._onDrop();

			this.el = el = null;
		}
	};


	function _cloneHide(sortable, state) {
		if (sortable.lastPullMode !== 'clone') {
			state = true;
		}

		if (cloneEl && (cloneEl.state !== state)) {
			_css(cloneEl, 'display', state ? 'none' : '');

			if (!state) {
				if (cloneEl.state) {
					if (sortable.options.group.revertClone) {
						rootEl.insertBefore(cloneEl, nextEl);
						sortable._animate(dragEl, cloneEl);
					} else {
						rootEl.insertBefore(cloneEl, dragEl);
					}
				}
			}

			cloneEl.state = state;
		}
	}


	function _closest(/**HTMLElement*/el, /**String*/selector, /**HTMLElement*/ctx) {
		if (el) {
			ctx = ctx || document;

			do {
				if ((selector === '>*' && el.parentNode === ctx) || _matches(el, selector)) {
					return el;
				}
				/* jshint boss:true */
			} while (el = _getParentOrHost(el));
		}

		return null;
	}


	function _getParentOrHost(el) {
		var parent = el.host;

		return (parent && parent.nodeType) ? parent : el.parentNode;
	}


	function _globalDragOver(/**Event*/evt) {
		if (evt.dataTransfer) {
			evt.dataTransfer.dropEffect = 'move';
		}
		evt.preventDefault();
	}


	function _on(el, event, fn) {
		el.addEventListener(event, fn, captureMode);
	}


	function _off(el, event, fn) {
		el.removeEventListener(event, fn, captureMode);
	}


	function _toggleClass(el, name, state) {
		if (el) {
			if (el.classList) {
				el.classList[state ? 'add' : 'remove'](name);
			}
			else {
				var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
				el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
			}
		}
	}


	function _css(el, prop, val) {
		var style = el && el.style;

		if (style) {
			if (val === void 0) {
				if (document.defaultView && document.defaultView.getComputedStyle) {
					val = document.defaultView.getComputedStyle(el, '');
				}
				else if (el.currentStyle) {
					val = el.currentStyle;
				}

				return prop === void 0 ? val : val[prop];
			}
			else {
				if (!(prop in style)) {
					prop = '-webkit-' + prop;
				}

				style[prop] = val + (typeof val === 'string' ? '' : 'px');
			}
		}
	}


	function _find(ctx, tagName, iterator) {
		if (ctx) {
			var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;

			if (iterator) {
				for (; i < n; i++) {
					iterator(list[i], i);
				}
			}

			return list;
		}

		return [];
	}



	function _dispatchEvent(sortable, rootEl, name, targetEl, fromEl, startIndex, newIndex) {
		sortable = (sortable || rootEl[expando]);

		var evt = document.createEvent('Event'),
			options = sortable.options,
			onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1);

		evt.initEvent(name, true, true);

		evt.to = rootEl;
		evt.from = fromEl || rootEl;
		evt.item = targetEl || rootEl;
		evt.clone = cloneEl;

		evt.oldIndex = startIndex;
		evt.newIndex = newIndex;

		rootEl.dispatchEvent(evt);

		if (options[onName]) {
			options[onName].call(sortable, evt);
		}
	}


	function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvt, willInsertAfter) {
		var evt,
			sortable = fromEl[expando],
			onMoveFn = sortable.options.onMove,
			retVal;

		evt = document.createEvent('Event');
		evt.initEvent('move', true, true);

		evt.to = toEl;
		evt.from = fromEl;
		evt.dragged = dragEl;
		evt.draggedRect = dragRect;
		evt.related = targetEl || toEl;
		evt.relatedRect = targetRect || toEl.getBoundingClientRect();
		evt.willInsertAfter = willInsertAfter;

		fromEl.dispatchEvent(evt);

		if (onMoveFn) {
			retVal = onMoveFn.call(sortable, evt, originalEvt);
		}

		return retVal;
	}


	function _disableDraggable(el) {
		el.draggable = false;
	}


	function _unsilent() {
		_silent = false;
	}


	/** @returns {HTMLElement|false} */
	function _ghostIsLast(el, evt) {
		var lastEl = el.lastElementChild,
			rect = lastEl.getBoundingClientRect();

		// 5 — min delta
		// abs — нельзя добавлять, а то глюки при наведении сверху
		return (evt.clientY - (rect.top + rect.height) > 5) ||
			(evt.clientX - (rect.left + rect.width) > 5);
	}


	/**
	 * Generate id
	 * @param   {HTMLElement} el
	 * @returns {String}
	 * @private
	 */
	function _generateId(el) {
		var str = el.tagName + el.className + el.src + el.href + el.textContent,
			i = str.length,
			sum = 0;

		while (i--) {
			sum += str.charCodeAt(i);
		}

		return sum.toString(36);
	}

	/**
	 * Returns the index of an element within its parent for a selected set of
	 * elements
	 * @param  {HTMLElement} el
	 * @param  {selector} selector
	 * @return {number}
	 */
	function _index(el, selector) {
		var index = 0;

		if (!el || !el.parentNode) {
			return -1;
		}

		while (el && (el = el.previousElementSibling)) {
			if ((el.nodeName.toUpperCase() !== 'TEMPLATE') && (selector === '>*' || _matches(el, selector))) {
				index++;
			}
		}

		return index;
	}

	function _matches(/**HTMLElement*/el, /**String*/selector) {
		if (el) {
			selector = selector.split('.');

			var tag = selector.shift().toUpperCase(),
				re = new RegExp('\\s(' + selector.join('|') + ')(?=\\s)', 'g');

			return (
				(tag === '' || el.nodeName.toUpperCase() == tag) &&
				(!selector.length || ((' ' + el.className + ' ').match(re) || []).length == selector.length)
			);
		}

		return false;
	}

	function _throttle(callback, ms) {
		var args, _this;

		return function () {
			if (args === void 0) {
				args = arguments;
				_this = this;

				setTimeout(function () {
					if (args.length === 1) {
						callback.call(_this, args[0]);
					} else {
						callback.apply(_this, args);
					}

					args = void 0;
				}, ms);
			}
		};
	}

	function _extend(dst, src) {
		if (dst && src) {
			for (var key in src) {
				if (src.hasOwnProperty(key)) {
					dst[key] = src[key];
				}
			}
		}

		return dst;
	}

	function _clone(el) {
		return $
			? $(el).clone(true)[0]
			: (Polymer && Polymer.dom
				? Polymer.dom(el).cloneNode(true)
				: el.cloneNode(true)
			);
	}

	function _saveInputCheckedState(root) {
		var inputs = root.getElementsByTagName('input');
		var idx = inputs.length;

		while (idx--) {
			var el = inputs[idx];
			el.checked && savedInputChecked.push(el);
		}
	}

	// Fixed #973: 
	_on(document, 'touchmove', function (evt) {
		if (Sortable.active) {
			evt.preventDefault();
		}
	});

	try {
		window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
			get: function () {
				captureMode = {
					capture: false,
					passive: false
				};
			}
		}));
	} catch (err) {}

	// Export utils
	Sortable.utils = {
		on: _on,
		off: _off,
		css: _css,
		find: _find,
		is: function (el, selector) {
			return !!_closest(el, selector, el);
		},
		extend: _extend,
		throttle: _throttle,
		closest: _closest,
		toggleClass: _toggleClass,
		clone: _clone,
		index: _index
	};


	/**
	 * Create sortable instance
	 * @param {HTMLElement}  el
	 * @param {Object}      [options]
	 */
	Sortable.create = function (el, options) {
		return new Sortable(el, options);
	};


	// Export
	Sortable.version = '1.6.1';
	return Sortable;
});


/***/ }),

/***/ "./resources/assets/js/admin.js":
/***/ (function(module, exports, __webpack_require__) {

Sortable = __webpack_require__("./node_modules/sortablejs/Sortable.js");

window.addEventListener('load', function () {
    // Sortable register

    document.querySelectorAll("[sortable=true]").forEach(function (element) {
        var sort = new Sortable(element, {
            draggable: element.dataset.draggable,
            onEnd: function onEnd(event) {
                var list = {};
                event.target.querySelectorAll('.photo-container').forEach(function (item, index) {
                    list[item.dataset.photoId] = index + 1;
                });
                document.querySelectorAll(event.target.dataset.sortedField).forEach(function (item) {
                    item.value = JSON.stringify(list);
                });
            }
        });
    }, this);
});

/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./resources/assets/js/admin.js");


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOTZmYTA3NDgxOTNmYzViMjI4MmUiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NvcnRhYmxlanMvU29ydGFibGUuanMiLCJ3ZWJwYWNrOi8vLy4vcmVzb3VyY2VzL2Fzc2V0cy9qcy9hZG1pbi5qcyJdLCJuYW1lcyI6WyJTb3J0YWJsZSIsInJlcXVpcmUiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImVsZW1lbnQiLCJzb3J0IiwiZHJhZ2dhYmxlIiwiZGF0YXNldCIsIm9uRW5kIiwiZXZlbnQiLCJsaXN0IiwidGFyZ2V0IiwiaXRlbSIsImluZGV4IiwicGhvdG9JZCIsInNvcnRlZEZpZWxkIiwidmFsdWUiLCJKU09OIiwic3RyaW5naWZ5Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCOztBQUVqQjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EscUJBQXFCO0FBQ3JCOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLGFBQWEsWUFBWTtBQUN6QixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0EsNERBQTREO0FBQzVEOztBQUVBLGVBQWU7QUFDZixxQ0FBcUM7OztBQUdyQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsV0FBVztBQUNYOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7OztBQUdBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUEsc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7O0FBR0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQXVCOztBQUV2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQSxtQ0FBbUM7O0FBRW5DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUI7O0FBRXZCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7O0FBR0g7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVMsT0FBTztBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7O0FBR0g7QUFDQTtBQUNBLGNBQWMsU0FBUztBQUN2QjtBQUNBO0FBQ0EsaUJBQWlCOztBQUVqQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSixHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0EsZUFBZSxZQUFZO0FBQzNCLGVBQWUsT0FBTztBQUN0QixlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7O0FBR0g7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLEVBQUU7QUFDakIsZUFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7O0FBR0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBVSxPQUFPO0FBQ2pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7QUFJQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQSxlQUFlLGtCQUFrQjtBQUNqQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLGNBQWMsWUFBWTtBQUMxQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsWUFBWTtBQUN6QixhQUFhLFNBQVM7QUFDdEIsYUFBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBLGdFQUFnRTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsWUFBWSxZQUFZO0FBQ3hCLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7QUNsOUNEQSxXQUFXLG1CQUFBQyxDQUFRLHVDQUFSLENBQVg7O0FBRUFDLE9BQU9DLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFlBQVc7QUFDdkM7O0FBRUFDLGFBQVNDLGdCQUFULENBQTBCLGlCQUExQixFQUE2Q0MsT0FBN0MsQ0FBcUQsVUFBU0MsT0FBVCxFQUFrQjtBQUNuRSxZQUFJQyxPQUFPLElBQUlSLFFBQUosQ0FBYU8sT0FBYixFQUFzQjtBQUM3QkUsdUJBQVdGLFFBQVFHLE9BQVIsQ0FBZ0JELFNBREU7QUFFN0JFLGlCQUY2QixpQkFFdkJDLEtBRnVCLEVBRWhCO0FBQ1Qsb0JBQUlDLE9BQU8sRUFBWDtBQUNBRCxzQkFBTUUsTUFBTixDQUFhVCxnQkFBYixDQUE4QixrQkFBOUIsRUFBa0RDLE9BQWxELENBQTBELFVBQUNTLElBQUQsRUFBT0MsS0FBUCxFQUFpQjtBQUN2RUgseUJBQUtFLEtBQUtMLE9BQUwsQ0FBYU8sT0FBbEIsSUFBNkJELFFBQVEsQ0FBckM7QUFDSCxpQkFGRDtBQUdBWix5QkFBU0MsZ0JBQVQsQ0FBMEJPLE1BQU1FLE1BQU4sQ0FBYUosT0FBYixDQUFxQlEsV0FBL0MsRUFBNERaLE9BQTVELENBQW9FLFVBQUNTLElBQUQsRUFBVTtBQUMxRUEseUJBQUtJLEtBQUwsR0FBYUMsS0FBS0MsU0FBTCxDQUFlUixJQUFmLENBQWI7QUFDSCxpQkFGRDtBQUdIO0FBVjRCLFNBQXRCLENBQVg7QUFZSCxLQWJELEVBYUcsSUFiSDtBQWVILENBbEJELEUiLCJmaWxlIjoiXFxqc1xcYWRtaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA5NmZhMDc0ODE5M2ZjNWIyMjgyZSIsIi8qKiFcbiAqIFNvcnRhYmxlXG4gKiBAYXV0aG9yXHRSdWJhWGEgICA8dHJhc2hAcnViYXhhLm9yZz5cbiAqIEBsaWNlbnNlIE1JVFxuICovXG5cbihmdW5jdGlvbiBzb3J0YWJsZU1vZHVsZShmYWN0b3J5KSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuXHRcdGRlZmluZShmYWN0b3J5KTtcblx0fVxuXHRlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0fVxuXHRlbHNlIHtcblx0XHQvKiBqc2hpbnQgc3ViOnRydWUgKi9cblx0XHR3aW5kb3dbXCJTb3J0YWJsZVwiXSA9IGZhY3RvcnkoKTtcblx0fVxufSkoZnVuY3Rpb24gc29ydGFibGVGYWN0b3J5KCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRpZiAodHlwZW9mIHdpbmRvdyA9PSBcInVuZGVmaW5lZFwiIHx8ICF3aW5kb3cuZG9jdW1lbnQpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gc29ydGFibGVFcnJvcigpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIlNvcnRhYmxlLmpzIHJlcXVpcmVzIGEgd2luZG93IHdpdGggYSBkb2N1bWVudFwiKTtcblx0XHR9O1xuXHR9XG5cblx0dmFyIGRyYWdFbCxcblx0XHRwYXJlbnRFbCxcblx0XHRnaG9zdEVsLFxuXHRcdGNsb25lRWwsXG5cdFx0cm9vdEVsLFxuXHRcdG5leHRFbCxcblx0XHRsYXN0RG93bkVsLFxuXG5cdFx0c2Nyb2xsRWwsXG5cdFx0c2Nyb2xsUGFyZW50RWwsXG5cdFx0c2Nyb2xsQ3VzdG9tRm4sXG5cblx0XHRsYXN0RWwsXG5cdFx0bGFzdENTUyxcblx0XHRsYXN0UGFyZW50Q1NTLFxuXG5cdFx0b2xkSW5kZXgsXG5cdFx0bmV3SW5kZXgsXG5cblx0XHRhY3RpdmVHcm91cCxcblx0XHRwdXRTb3J0YWJsZSxcblxuXHRcdGF1dG9TY3JvbGwgPSB7fSxcblxuXHRcdHRhcEV2dCxcblx0XHR0b3VjaEV2dCxcblxuXHRcdG1vdmVkLFxuXG5cdFx0LyoqIEBjb25zdCAqL1xuXHRcdFJfU1BBQ0UgPSAvXFxzKy9nLFxuXHRcdFJfRkxPQVQgPSAvbGVmdHxyaWdodHxpbmxpbmUvLFxuXG5cdFx0ZXhwYW5kbyA9ICdTb3J0YWJsZScgKyAobmV3IERhdGUpLmdldFRpbWUoKSxcblxuXHRcdHdpbiA9IHdpbmRvdyxcblx0XHRkb2N1bWVudCA9IHdpbi5kb2N1bWVudCxcblx0XHRwYXJzZUludCA9IHdpbi5wYXJzZUludCxcblxuXHRcdCQgPSB3aW4ualF1ZXJ5IHx8IHdpbi5aZXB0byxcblx0XHRQb2x5bWVyID0gd2luLlBvbHltZXIsXG5cblx0XHRjYXB0dXJlTW9kZSA9IGZhbHNlLFxuXG5cdFx0c3VwcG9ydERyYWdnYWJsZSA9ICEhKCdkcmFnZ2FibGUnIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKSxcblx0XHRzdXBwb3J0Q3NzUG9pbnRlckV2ZW50cyA9IChmdW5jdGlvbiAoZWwpIHtcblx0XHRcdC8vIGZhbHNlIHdoZW4gSUUxMVxuXHRcdFx0aWYgKCEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvVHJpZGVudC4qcnZbIDpdPzExXFwuLykpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0ZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd4Jyk7XG5cdFx0XHRlbC5zdHlsZS5jc3NUZXh0ID0gJ3BvaW50ZXItZXZlbnRzOmF1dG8nO1xuXHRcdFx0cmV0dXJuIGVsLnN0eWxlLnBvaW50ZXJFdmVudHMgPT09ICdhdXRvJztcblx0XHR9KSgpLFxuXG5cdFx0X3NpbGVudCA9IGZhbHNlLFxuXG5cdFx0YWJzID0gTWF0aC5hYnMsXG5cdFx0bWluID0gTWF0aC5taW4sXG5cblx0XHRzYXZlZElucHV0Q2hlY2tlZCA9IFtdLFxuXHRcdHRvdWNoRHJhZ092ZXJMaXN0ZW5lcnMgPSBbXSxcblxuXHRcdF9hdXRvU2Nyb2xsID0gX3Rocm90dGxlKGZ1bmN0aW9uICgvKipFdmVudCovZXZ0LCAvKipPYmplY3QqL29wdGlvbnMsIC8qKkhUTUxFbGVtZW50Ki9yb290RWwpIHtcblx0XHRcdC8vIEJ1ZzogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NTA1NTIxXG5cdFx0XHRpZiAocm9vdEVsICYmIG9wdGlvbnMuc2Nyb2xsKSB7XG5cdFx0XHRcdHZhciBfdGhpcyA9IHJvb3RFbFtleHBhbmRvXSxcblx0XHRcdFx0XHRlbCxcblx0XHRcdFx0XHRyZWN0LFxuXHRcdFx0XHRcdHNlbnMgPSBvcHRpb25zLnNjcm9sbFNlbnNpdGl2aXR5LFxuXHRcdFx0XHRcdHNwZWVkID0gb3B0aW9ucy5zY3JvbGxTcGVlZCxcblxuXHRcdFx0XHRcdHggPSBldnQuY2xpZW50WCxcblx0XHRcdFx0XHR5ID0gZXZ0LmNsaWVudFksXG5cblx0XHRcdFx0XHR3aW5XaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoLFxuXHRcdFx0XHRcdHdpbkhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCxcblxuXHRcdFx0XHRcdHZ4LFxuXHRcdFx0XHRcdHZ5LFxuXG5cdFx0XHRcdFx0c2Nyb2xsT2Zmc2V0WCxcblx0XHRcdFx0XHRzY3JvbGxPZmZzZXRZXG5cdFx0XHRcdDtcblxuXHRcdFx0XHQvLyBEZWxlY3Qgc2Nyb2xsRWxcblx0XHRcdFx0aWYgKHNjcm9sbFBhcmVudEVsICE9PSByb290RWwpIHtcblx0XHRcdFx0XHRzY3JvbGxFbCA9IG9wdGlvbnMuc2Nyb2xsO1xuXHRcdFx0XHRcdHNjcm9sbFBhcmVudEVsID0gcm9vdEVsO1xuXHRcdFx0XHRcdHNjcm9sbEN1c3RvbUZuID0gb3B0aW9ucy5zY3JvbGxGbjtcblxuXHRcdFx0XHRcdGlmIChzY3JvbGxFbCA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0c2Nyb2xsRWwgPSByb290RWw7XG5cblx0XHRcdFx0XHRcdGRvIHtcblx0XHRcdFx0XHRcdFx0aWYgKChzY3JvbGxFbC5vZmZzZXRXaWR0aCA8IHNjcm9sbEVsLnNjcm9sbFdpZHRoKSB8fFxuXHRcdFx0XHRcdFx0XHRcdChzY3JvbGxFbC5vZmZzZXRIZWlnaHQgPCBzY3JvbGxFbC5zY3JvbGxIZWlnaHQpXG5cdFx0XHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC8qIGpzaGludCBib3NzOnRydWUgKi9cblx0XHRcdFx0XHRcdH0gd2hpbGUgKHNjcm9sbEVsID0gc2Nyb2xsRWwucGFyZW50Tm9kZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHNjcm9sbEVsKSB7XG5cdFx0XHRcdFx0ZWwgPSBzY3JvbGxFbDtcblx0XHRcdFx0XHRyZWN0ID0gc2Nyb2xsRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0XHRcdFx0dnggPSAoYWJzKHJlY3QucmlnaHQgLSB4KSA8PSBzZW5zKSAtIChhYnMocmVjdC5sZWZ0IC0geCkgPD0gc2Vucyk7XG5cdFx0XHRcdFx0dnkgPSAoYWJzKHJlY3QuYm90dG9tIC0geSkgPD0gc2VucykgLSAoYWJzKHJlY3QudG9wIC0geSkgPD0gc2Vucyk7XG5cdFx0XHRcdH1cblxuXG5cdFx0XHRcdGlmICghKHZ4IHx8IHZ5KSkge1xuXHRcdFx0XHRcdHZ4ID0gKHdpbldpZHRoIC0geCA8PSBzZW5zKSAtICh4IDw9IHNlbnMpO1xuXHRcdFx0XHRcdHZ5ID0gKHdpbkhlaWdodCAtIHkgPD0gc2VucykgLSAoeSA8PSBzZW5zKTtcblxuXHRcdFx0XHRcdC8qIGpzaGludCBleHByOnRydWUgKi9cblx0XHRcdFx0XHQodnggfHwgdnkpICYmIChlbCA9IHdpbik7XG5cdFx0XHRcdH1cblxuXG5cdFx0XHRcdGlmIChhdXRvU2Nyb2xsLnZ4ICE9PSB2eCB8fCBhdXRvU2Nyb2xsLnZ5ICE9PSB2eSB8fCBhdXRvU2Nyb2xsLmVsICE9PSBlbCkge1xuXHRcdFx0XHRcdGF1dG9TY3JvbGwuZWwgPSBlbDtcblx0XHRcdFx0XHRhdXRvU2Nyb2xsLnZ4ID0gdng7XG5cdFx0XHRcdFx0YXV0b1Njcm9sbC52eSA9IHZ5O1xuXG5cdFx0XHRcdFx0Y2xlYXJJbnRlcnZhbChhdXRvU2Nyb2xsLnBpZCk7XG5cblx0XHRcdFx0XHRpZiAoZWwpIHtcblx0XHRcdFx0XHRcdGF1dG9TY3JvbGwucGlkID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRzY3JvbGxPZmZzZXRZID0gdnkgPyB2eSAqIHNwZWVkIDogMDtcblx0XHRcdFx0XHRcdFx0c2Nyb2xsT2Zmc2V0WCA9IHZ4ID8gdnggKiBzcGVlZCA6IDA7XG5cblx0XHRcdFx0XHRcdFx0aWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZihzY3JvbGxDdXN0b21GbikpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gc2Nyb2xsQ3VzdG9tRm4uY2FsbChfdGhpcywgc2Nyb2xsT2Zmc2V0WCwgc2Nyb2xsT2Zmc2V0WSwgZXZ0KTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGlmIChlbCA9PT0gd2luKSB7XG5cdFx0XHRcdFx0XHRcdFx0d2luLnNjcm9sbFRvKHdpbi5wYWdlWE9mZnNldCArIHNjcm9sbE9mZnNldFgsIHdpbi5wYWdlWU9mZnNldCArIHNjcm9sbE9mZnNldFkpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGVsLnNjcm9sbFRvcCArPSBzY3JvbGxPZmZzZXRZO1xuXHRcdFx0XHRcdFx0XHRcdGVsLnNjcm9sbExlZnQgKz0gc2Nyb2xsT2Zmc2V0WDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSwgMjQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sIDMwKSxcblxuXHRcdF9wcmVwYXJlR3JvdXAgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuXHRcdFx0ZnVuY3Rpb24gdG9Gbih2YWx1ZSwgcHVsbCkge1xuXHRcdFx0XHRpZiAodmFsdWUgPT09IHZvaWQgMCB8fCB2YWx1ZSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdHZhbHVlID0gZ3JvdXAubmFtZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICh0bywgZnJvbSkge1xuXHRcdFx0XHRcdFx0dmFyIGZyb21Hcm91cCA9IGZyb20ub3B0aW9ucy5ncm91cC5uYW1lO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gcHVsbFxuXHRcdFx0XHRcdFx0XHQ/IHZhbHVlXG5cdFx0XHRcdFx0XHRcdDogdmFsdWUgJiYgKHZhbHVlLmpvaW5cblx0XHRcdFx0XHRcdFx0XHQ/IHZhbHVlLmluZGV4T2YoZnJvbUdyb3VwKSA+IC0xXG5cdFx0XHRcdFx0XHRcdFx0OiAoZnJvbUdyb3VwID09IHZhbHVlKVxuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dmFyIGdyb3VwID0ge307XG5cdFx0XHR2YXIgb3JpZ2luYWxHcm91cCA9IG9wdGlvbnMuZ3JvdXA7XG5cblx0XHRcdGlmICghb3JpZ2luYWxHcm91cCB8fCB0eXBlb2Ygb3JpZ2luYWxHcm91cCAhPSAnb2JqZWN0Jykge1xuXHRcdFx0XHRvcmlnaW5hbEdyb3VwID0ge25hbWU6IG9yaWdpbmFsR3JvdXB9O1xuXHRcdFx0fVxuXG5cdFx0XHRncm91cC5uYW1lID0gb3JpZ2luYWxHcm91cC5uYW1lO1xuXHRcdFx0Z3JvdXAuY2hlY2tQdWxsID0gdG9GbihvcmlnaW5hbEdyb3VwLnB1bGwsIHRydWUpO1xuXHRcdFx0Z3JvdXAuY2hlY2tQdXQgPSB0b0ZuKG9yaWdpbmFsR3JvdXAucHV0KTtcblx0XHRcdGdyb3VwLnJldmVydENsb25lID0gb3JpZ2luYWxHcm91cC5yZXZlcnRDbG9uZTtcblxuXHRcdFx0b3B0aW9ucy5ncm91cCA9IGdyb3VwO1xuXHRcdH1cblx0O1xuXG5cblx0LyoqXG5cdCAqIEBjbGFzcyAgU29ydGFibGVcblx0ICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICBlbFxuXHQgKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgIFtvcHRpb25zXVxuXHQgKi9cblx0ZnVuY3Rpb24gU29ydGFibGUoZWwsIG9wdGlvbnMpIHtcblx0XHRpZiAoIShlbCAmJiBlbC5ub2RlVHlwZSAmJiBlbC5ub2RlVHlwZSA9PT0gMSkpIHtcblx0XHRcdHRocm93ICdTb3J0YWJsZTogYGVsYCBtdXN0IGJlIEhUTUxFbGVtZW50LCBhbmQgbm90ICcgKyB7fS50b1N0cmluZy5jYWxsKGVsKTtcblx0XHR9XG5cblx0XHR0aGlzLmVsID0gZWw7IC8vIHJvb3QgZWxlbWVudFxuXHRcdHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgPSBfZXh0ZW5kKHt9LCBvcHRpb25zKTtcblxuXG5cdFx0Ly8gRXhwb3J0IGluc3RhbmNlXG5cdFx0ZWxbZXhwYW5kb10gPSB0aGlzO1xuXG5cdFx0Ly8gRGVmYXVsdCBvcHRpb25zXG5cdFx0dmFyIGRlZmF1bHRzID0ge1xuXHRcdFx0Z3JvdXA6IE1hdGgucmFuZG9tKCksXG5cdFx0XHRzb3J0OiB0cnVlLFxuXHRcdFx0ZGlzYWJsZWQ6IGZhbHNlLFxuXHRcdFx0c3RvcmU6IG51bGwsXG5cdFx0XHRoYW5kbGU6IG51bGwsXG5cdFx0XHRzY3JvbGw6IHRydWUsXG5cdFx0XHRzY3JvbGxTZW5zaXRpdml0eTogMzAsXG5cdFx0XHRzY3JvbGxTcGVlZDogMTAsXG5cdFx0XHRkcmFnZ2FibGU6IC9bdW9dbC9pLnRlc3QoZWwubm9kZU5hbWUpID8gJ2xpJyA6ICc+KicsXG5cdFx0XHRnaG9zdENsYXNzOiAnc29ydGFibGUtZ2hvc3QnLFxuXHRcdFx0Y2hvc2VuQ2xhc3M6ICdzb3J0YWJsZS1jaG9zZW4nLFxuXHRcdFx0ZHJhZ0NsYXNzOiAnc29ydGFibGUtZHJhZycsXG5cdFx0XHRpZ25vcmU6ICdhLCBpbWcnLFxuXHRcdFx0ZmlsdGVyOiBudWxsLFxuXHRcdFx0cHJldmVudE9uRmlsdGVyOiB0cnVlLFxuXHRcdFx0YW5pbWF0aW9uOiAwLFxuXHRcdFx0c2V0RGF0YTogZnVuY3Rpb24gKGRhdGFUcmFuc2ZlciwgZHJhZ0VsKSB7XG5cdFx0XHRcdGRhdGFUcmFuc2Zlci5zZXREYXRhKCdUZXh0JywgZHJhZ0VsLnRleHRDb250ZW50KTtcblx0XHRcdH0sXG5cdFx0XHRkcm9wQnViYmxlOiBmYWxzZSxcblx0XHRcdGRyYWdvdmVyQnViYmxlOiBmYWxzZSxcblx0XHRcdGRhdGFJZEF0dHI6ICdkYXRhLWlkJyxcblx0XHRcdGRlbGF5OiAwLFxuXHRcdFx0Zm9yY2VGYWxsYmFjazogZmFsc2UsXG5cdFx0XHRmYWxsYmFja0NsYXNzOiAnc29ydGFibGUtZmFsbGJhY2snLFxuXHRcdFx0ZmFsbGJhY2tPbkJvZHk6IGZhbHNlLFxuXHRcdFx0ZmFsbGJhY2tUb2xlcmFuY2U6IDAsXG5cdFx0XHRmYWxsYmFja09mZnNldDoge3g6IDAsIHk6IDB9XG5cdFx0fTtcblxuXG5cdFx0Ly8gU2V0IGRlZmF1bHQgb3B0aW9uc1xuXHRcdGZvciAodmFyIG5hbWUgaW4gZGVmYXVsdHMpIHtcblx0XHRcdCEobmFtZSBpbiBvcHRpb25zKSAmJiAob3B0aW9uc1tuYW1lXSA9IGRlZmF1bHRzW25hbWVdKTtcblx0XHR9XG5cblx0XHRfcHJlcGFyZUdyb3VwKG9wdGlvbnMpO1xuXG5cdFx0Ly8gQmluZCBhbGwgcHJpdmF0ZSBtZXRob2RzXG5cdFx0Zm9yICh2YXIgZm4gaW4gdGhpcykge1xuXHRcdFx0aWYgKGZuLmNoYXJBdCgwKSA9PT0gJ18nICYmIHR5cGVvZiB0aGlzW2ZuXSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHR0aGlzW2ZuXSA9IHRoaXNbZm5dLmJpbmQodGhpcyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gU2V0dXAgZHJhZyBtb2RlXG5cdFx0dGhpcy5uYXRpdmVEcmFnZ2FibGUgPSBvcHRpb25zLmZvcmNlRmFsbGJhY2sgPyBmYWxzZSA6IHN1cHBvcnREcmFnZ2FibGU7XG5cblx0XHQvLyBCaW5kIGV2ZW50c1xuXHRcdF9vbihlbCwgJ21vdXNlZG93bicsIHRoaXMuX29uVGFwU3RhcnQpO1xuXHRcdF9vbihlbCwgJ3RvdWNoc3RhcnQnLCB0aGlzLl9vblRhcFN0YXJ0KTtcblx0XHRfb24oZWwsICdwb2ludGVyZG93bicsIHRoaXMuX29uVGFwU3RhcnQpO1xuXG5cdFx0aWYgKHRoaXMubmF0aXZlRHJhZ2dhYmxlKSB7XG5cdFx0XHRfb24oZWwsICdkcmFnb3ZlcicsIHRoaXMpO1xuXHRcdFx0X29uKGVsLCAnZHJhZ2VudGVyJywgdGhpcyk7XG5cdFx0fVxuXG5cdFx0dG91Y2hEcmFnT3Zlckxpc3RlbmVycy5wdXNoKHRoaXMuX29uRHJhZ092ZXIpO1xuXG5cdFx0Ly8gUmVzdG9yZSBzb3J0aW5nXG5cdFx0b3B0aW9ucy5zdG9yZSAmJiB0aGlzLnNvcnQob3B0aW9ucy5zdG9yZS5nZXQodGhpcykpO1xuXHR9XG5cblxuXHRTb3J0YWJsZS5wcm90b3R5cGUgPSAvKiogQGxlbmRzIFNvcnRhYmxlLnByb3RvdHlwZSAqLyB7XG5cdFx0Y29uc3RydWN0b3I6IFNvcnRhYmxlLFxuXG5cdFx0X29uVGFwU3RhcnQ6IGZ1bmN0aW9uICgvKiogRXZlbnR8VG91Y2hFdmVudCAqL2V2dCkge1xuXHRcdFx0dmFyIF90aGlzID0gdGhpcyxcblx0XHRcdFx0ZWwgPSB0aGlzLmVsLFxuXHRcdFx0XHRvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuXHRcdFx0XHRwcmV2ZW50T25GaWx0ZXIgPSBvcHRpb25zLnByZXZlbnRPbkZpbHRlcixcblx0XHRcdFx0dHlwZSA9IGV2dC50eXBlLFxuXHRcdFx0XHR0b3VjaCA9IGV2dC50b3VjaGVzICYmIGV2dC50b3VjaGVzWzBdLFxuXHRcdFx0XHR0YXJnZXQgPSAodG91Y2ggfHwgZXZ0KS50YXJnZXQsXG5cdFx0XHRcdG9yaWdpbmFsVGFyZ2V0ID0gZXZ0LnRhcmdldC5zaGFkb3dSb290ICYmIChldnQucGF0aCAmJiBldnQucGF0aFswXSkgfHwgdGFyZ2V0LFxuXHRcdFx0XHRmaWx0ZXIgPSBvcHRpb25zLmZpbHRlcixcblx0XHRcdFx0c3RhcnRJbmRleDtcblxuXHRcdFx0X3NhdmVJbnB1dENoZWNrZWRTdGF0ZShlbCk7XG5cblxuXHRcdFx0Ly8gRG9uJ3QgdHJpZ2dlciBzdGFydCBldmVudCB3aGVuIGFuIGVsZW1lbnQgaXMgYmVlbiBkcmFnZ2VkLCBvdGhlcndpc2UgdGhlIGV2dC5vbGRpbmRleCBhbHdheXMgd3Jvbmcgd2hlbiBzZXQgb3B0aW9uLmdyb3VwLlxuXHRcdFx0aWYgKGRyYWdFbCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICgvbW91c2Vkb3dufHBvaW50ZXJkb3duLy50ZXN0KHR5cGUpICYmIGV2dC5idXR0b24gIT09IDAgfHwgb3B0aW9ucy5kaXNhYmxlZCkge1xuXHRcdFx0XHRyZXR1cm47IC8vIG9ubHkgbGVmdCBidXR0b24gb3IgZW5hYmxlZFxuXHRcdFx0fVxuXG5cblx0XHRcdHRhcmdldCA9IF9jbG9zZXN0KHRhcmdldCwgb3B0aW9ucy5kcmFnZ2FibGUsIGVsKTtcblxuXHRcdFx0aWYgKCF0YXJnZXQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAobGFzdERvd25FbCA9PT0gdGFyZ2V0KSB7XG5cdFx0XHRcdC8vIElnbm9yaW5nIGR1cGxpY2F0ZSBgZG93bmBcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBHZXQgdGhlIGluZGV4IG9mIHRoZSBkcmFnZ2VkIGVsZW1lbnQgd2l0aGluIGl0cyBwYXJlbnRcblx0XHRcdHN0YXJ0SW5kZXggPSBfaW5kZXgodGFyZ2V0LCBvcHRpb25zLmRyYWdnYWJsZSk7XG5cblx0XHRcdC8vIENoZWNrIGZpbHRlclxuXHRcdFx0aWYgKHR5cGVvZiBmaWx0ZXIgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0aWYgKGZpbHRlci5jYWxsKHRoaXMsIGV2dCwgdGFyZ2V0LCB0aGlzKSkge1xuXHRcdFx0XHRcdF9kaXNwYXRjaEV2ZW50KF90aGlzLCBvcmlnaW5hbFRhcmdldCwgJ2ZpbHRlcicsIHRhcmdldCwgZWwsIHN0YXJ0SW5kZXgpO1xuXHRcdFx0XHRcdHByZXZlbnRPbkZpbHRlciAmJiBldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRyZXR1cm47IC8vIGNhbmNlbCBkbmRcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoZmlsdGVyKSB7XG5cdFx0XHRcdGZpbHRlciA9IGZpbHRlci5zcGxpdCgnLCcpLnNvbWUoZnVuY3Rpb24gKGNyaXRlcmlhKSB7XG5cdFx0XHRcdFx0Y3JpdGVyaWEgPSBfY2xvc2VzdChvcmlnaW5hbFRhcmdldCwgY3JpdGVyaWEudHJpbSgpLCBlbCk7XG5cblx0XHRcdFx0XHRpZiAoY3JpdGVyaWEpIHtcblx0XHRcdFx0XHRcdF9kaXNwYXRjaEV2ZW50KF90aGlzLCBjcml0ZXJpYSwgJ2ZpbHRlcicsIHRhcmdldCwgZWwsIHN0YXJ0SW5kZXgpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRpZiAoZmlsdGVyKSB7XG5cdFx0XHRcdFx0cHJldmVudE9uRmlsdGVyICYmIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdHJldHVybjsgLy8gY2FuY2VsIGRuZFxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChvcHRpb25zLmhhbmRsZSAmJiAhX2Nsb3Nlc3Qob3JpZ2luYWxUYXJnZXQsIG9wdGlvbnMuaGFuZGxlLCBlbCkpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBQcmVwYXJlIGBkcmFnc3RhcnRgXG5cdFx0XHR0aGlzLl9wcmVwYXJlRHJhZ1N0YXJ0KGV2dCwgdG91Y2gsIHRhcmdldCwgc3RhcnRJbmRleCk7XG5cdFx0fSxcblxuXHRcdF9wcmVwYXJlRHJhZ1N0YXJ0OiBmdW5jdGlvbiAoLyoqIEV2ZW50ICovZXZ0LCAvKiogVG91Y2ggKi90b3VjaCwgLyoqIEhUTUxFbGVtZW50ICovdGFyZ2V0LCAvKiogTnVtYmVyICovc3RhcnRJbmRleCkge1xuXHRcdFx0dmFyIF90aGlzID0gdGhpcyxcblx0XHRcdFx0ZWwgPSBfdGhpcy5lbCxcblx0XHRcdFx0b3B0aW9ucyA9IF90aGlzLm9wdGlvbnMsXG5cdFx0XHRcdG93bmVyRG9jdW1lbnQgPSBlbC5vd25lckRvY3VtZW50LFxuXHRcdFx0XHRkcmFnU3RhcnRGbjtcblxuXHRcdFx0aWYgKHRhcmdldCAmJiAhZHJhZ0VsICYmICh0YXJnZXQucGFyZW50Tm9kZSA9PT0gZWwpKSB7XG5cdFx0XHRcdHRhcEV2dCA9IGV2dDtcblxuXHRcdFx0XHRyb290RWwgPSBlbDtcblx0XHRcdFx0ZHJhZ0VsID0gdGFyZ2V0O1xuXHRcdFx0XHRwYXJlbnRFbCA9IGRyYWdFbC5wYXJlbnROb2RlO1xuXHRcdFx0XHRuZXh0RWwgPSBkcmFnRWwubmV4dFNpYmxpbmc7XG5cdFx0XHRcdGxhc3REb3duRWwgPSB0YXJnZXQ7XG5cdFx0XHRcdGFjdGl2ZUdyb3VwID0gb3B0aW9ucy5ncm91cDtcblx0XHRcdFx0b2xkSW5kZXggPSBzdGFydEluZGV4O1xuXG5cdFx0XHRcdHRoaXMuX2xhc3RYID0gKHRvdWNoIHx8IGV2dCkuY2xpZW50WDtcblx0XHRcdFx0dGhpcy5fbGFzdFkgPSAodG91Y2ggfHwgZXZ0KS5jbGllbnRZO1xuXG5cdFx0XHRcdGRyYWdFbC5zdHlsZVsnd2lsbC1jaGFuZ2UnXSA9ICd0cmFuc2Zvcm0nO1xuXG5cdFx0XHRcdGRyYWdTdGFydEZuID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdC8vIERlbGF5ZWQgZHJhZyBoYXMgYmVlbiB0cmlnZ2VyZWRcblx0XHRcdFx0XHQvLyB3ZSBjYW4gcmUtZW5hYmxlIHRoZSBldmVudHM6IHRvdWNobW92ZS9tb3VzZW1vdmVcblx0XHRcdFx0XHRfdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnKCk7XG5cblx0XHRcdFx0XHQvLyBNYWtlIHRoZSBlbGVtZW50IGRyYWdnYWJsZVxuXHRcdFx0XHRcdGRyYWdFbC5kcmFnZ2FibGUgPSBfdGhpcy5uYXRpdmVEcmFnZ2FibGU7XG5cblx0XHRcdFx0XHQvLyBDaG9zZW4gaXRlbVxuXHRcdFx0XHRcdF90b2dnbGVDbGFzcyhkcmFnRWwsIG9wdGlvbnMuY2hvc2VuQ2xhc3MsIHRydWUpO1xuXG5cdFx0XHRcdFx0Ly8gQmluZCB0aGUgZXZlbnRzOiBkcmFnc3RhcnQvZHJhZ2VuZFxuXHRcdFx0XHRcdF90aGlzLl90cmlnZ2VyRHJhZ1N0YXJ0KGV2dCwgdG91Y2gpO1xuXG5cdFx0XHRcdFx0Ly8gRHJhZyBzdGFydCBldmVudFxuXHRcdFx0XHRcdF9kaXNwYXRjaEV2ZW50KF90aGlzLCByb290RWwsICdjaG9vc2UnLCBkcmFnRWwsIHJvb3RFbCwgb2xkSW5kZXgpO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdC8vIERpc2FibGUgXCJkcmFnZ2FibGVcIlxuXHRcdFx0XHRvcHRpb25zLmlnbm9yZS5zcGxpdCgnLCcpLmZvckVhY2goZnVuY3Rpb24gKGNyaXRlcmlhKSB7XG5cdFx0XHRcdFx0X2ZpbmQoZHJhZ0VsLCBjcml0ZXJpYS50cmltKCksIF9kaXNhYmxlRHJhZ2dhYmxlKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0X29uKG93bmVyRG9jdW1lbnQsICdtb3VzZXVwJywgX3RoaXMuX29uRHJvcCk7XG5cdFx0XHRcdF9vbihvd25lckRvY3VtZW50LCAndG91Y2hlbmQnLCBfdGhpcy5fb25Ecm9wKTtcblx0XHRcdFx0X29uKG93bmVyRG9jdW1lbnQsICd0b3VjaGNhbmNlbCcsIF90aGlzLl9vbkRyb3ApO1xuXHRcdFx0XHRfb24ob3duZXJEb2N1bWVudCwgJ3BvaW50ZXJjYW5jZWwnLCBfdGhpcy5fb25Ecm9wKTtcblx0XHRcdFx0X29uKG93bmVyRG9jdW1lbnQsICdzZWxlY3RzdGFydCcsIF90aGlzKTtcblxuXHRcdFx0XHRpZiAob3B0aW9ucy5kZWxheSkge1xuXHRcdFx0XHRcdC8vIElmIHRoZSB1c2VyIG1vdmVzIHRoZSBwb2ludGVyIG9yIGxldCBnbyB0aGUgY2xpY2sgb3IgdG91Y2hcblx0XHRcdFx0XHQvLyBiZWZvcmUgdGhlIGRlbGF5IGhhcyBiZWVuIHJlYWNoZWQ6XG5cdFx0XHRcdFx0Ly8gZGlzYWJsZSB0aGUgZGVsYXllZCBkcmFnXG5cdFx0XHRcdFx0X29uKG93bmVyRG9jdW1lbnQsICdtb3VzZXVwJywgX3RoaXMuX2Rpc2FibGVEZWxheWVkRHJhZyk7XG5cdFx0XHRcdFx0X29uKG93bmVyRG9jdW1lbnQsICd0b3VjaGVuZCcsIF90aGlzLl9kaXNhYmxlRGVsYXllZERyYWcpO1xuXHRcdFx0XHRcdF9vbihvd25lckRvY3VtZW50LCAndG91Y2hjYW5jZWwnLCBfdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnKTtcblx0XHRcdFx0XHRfb24ob3duZXJEb2N1bWVudCwgJ21vdXNlbW92ZScsIF90aGlzLl9kaXNhYmxlRGVsYXllZERyYWcpO1xuXHRcdFx0XHRcdF9vbihvd25lckRvY3VtZW50LCAndG91Y2htb3ZlJywgX3RoaXMuX2Rpc2FibGVEZWxheWVkRHJhZyk7XG5cdFx0XHRcdFx0X29uKG93bmVyRG9jdW1lbnQsICdwb2ludGVybW92ZScsIF90aGlzLl9kaXNhYmxlRGVsYXllZERyYWcpO1xuXG5cdFx0XHRcdFx0X3RoaXMuX2RyYWdTdGFydFRpbWVyID0gc2V0VGltZW91dChkcmFnU3RhcnRGbiwgb3B0aW9ucy5kZWxheSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZHJhZ1N0YXJ0Rm4oKTtcblx0XHRcdFx0fVxuXG5cblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0X2Rpc2FibGVEZWxheWVkRHJhZzogZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIG93bmVyRG9jdW1lbnQgPSB0aGlzLmVsLm93bmVyRG9jdW1lbnQ7XG5cblx0XHRcdGNsZWFyVGltZW91dCh0aGlzLl9kcmFnU3RhcnRUaW1lcik7XG5cdFx0XHRfb2ZmKG93bmVyRG9jdW1lbnQsICdtb3VzZXVwJywgdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnKTtcblx0XHRcdF9vZmYob3duZXJEb2N1bWVudCwgJ3RvdWNoZW5kJywgdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnKTtcblx0XHRcdF9vZmYob3duZXJEb2N1bWVudCwgJ3RvdWNoY2FuY2VsJywgdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnKTtcblx0XHRcdF9vZmYob3duZXJEb2N1bWVudCwgJ21vdXNlbW92ZScsIHRoaXMuX2Rpc2FibGVEZWxheWVkRHJhZyk7XG5cdFx0XHRfb2ZmKG93bmVyRG9jdW1lbnQsICd0b3VjaG1vdmUnLCB0aGlzLl9kaXNhYmxlRGVsYXllZERyYWcpO1xuXHRcdFx0X29mZihvd25lckRvY3VtZW50LCAncG9pbnRlcm1vdmUnLCB0aGlzLl9kaXNhYmxlRGVsYXllZERyYWcpO1xuXHRcdH0sXG5cblx0XHRfdHJpZ2dlckRyYWdTdGFydDogZnVuY3Rpb24gKC8qKiBFdmVudCAqL2V2dCwgLyoqIFRvdWNoICovdG91Y2gpIHtcblx0XHRcdHRvdWNoID0gdG91Y2ggfHwgKGV2dC5wb2ludGVyVHlwZSA9PSAndG91Y2gnID8gZXZ0IDogbnVsbCk7XG5cblx0XHRcdGlmICh0b3VjaCkge1xuXHRcdFx0XHQvLyBUb3VjaCBkZXZpY2Ugc3VwcG9ydFxuXHRcdFx0XHR0YXBFdnQgPSB7XG5cdFx0XHRcdFx0dGFyZ2V0OiBkcmFnRWwsXG5cdFx0XHRcdFx0Y2xpZW50WDogdG91Y2guY2xpZW50WCxcblx0XHRcdFx0XHRjbGllbnRZOiB0b3VjaC5jbGllbnRZXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dGhpcy5fb25EcmFnU3RhcnQodGFwRXZ0LCAndG91Y2gnKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCF0aGlzLm5hdGl2ZURyYWdnYWJsZSkge1xuXHRcdFx0XHR0aGlzLl9vbkRyYWdTdGFydCh0YXBFdnQsIHRydWUpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdF9vbihkcmFnRWwsICdkcmFnZW5kJywgdGhpcyk7XG5cdFx0XHRcdF9vbihyb290RWwsICdkcmFnc3RhcnQnLCB0aGlzLl9vbkRyYWdTdGFydCk7XG5cdFx0XHR9XG5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdGlmIChkb2N1bWVudC5zZWxlY3Rpb24pIHtcblx0XHRcdFx0XHQvLyBUaW1lb3V0IG5lY2Nlc3NhcnkgZm9yIElFOVxuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0ZG9jdW1lbnQuc2VsZWN0aW9uLmVtcHR5KCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0d2luZG93LmdldFNlbGVjdGlvbigpLnJlbW92ZUFsbFJhbmdlcygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0X2RyYWdTdGFydGVkOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAocm9vdEVsICYmIGRyYWdFbCkge1xuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuXHRcdFx0XHQvLyBBcHBseSBlZmZlY3Rcblx0XHRcdFx0X3RvZ2dsZUNsYXNzKGRyYWdFbCwgb3B0aW9ucy5naG9zdENsYXNzLCB0cnVlKTtcblx0XHRcdFx0X3RvZ2dsZUNsYXNzKGRyYWdFbCwgb3B0aW9ucy5kcmFnQ2xhc3MsIGZhbHNlKTtcblxuXHRcdFx0XHRTb3J0YWJsZS5hY3RpdmUgPSB0aGlzO1xuXG5cdFx0XHRcdC8vIERyYWcgc3RhcnQgZXZlbnRcblx0XHRcdFx0X2Rpc3BhdGNoRXZlbnQodGhpcywgcm9vdEVsLCAnc3RhcnQnLCBkcmFnRWwsIHJvb3RFbCwgb2xkSW5kZXgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5fbnVsbGluZygpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRfZW11bGF0ZURyYWdPdmVyOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAodG91Y2hFdnQpIHtcblx0XHRcdFx0aWYgKHRoaXMuX2xhc3RYID09PSB0b3VjaEV2dC5jbGllbnRYICYmIHRoaXMuX2xhc3RZID09PSB0b3VjaEV2dC5jbGllbnRZKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5fbGFzdFggPSB0b3VjaEV2dC5jbGllbnRYO1xuXHRcdFx0XHR0aGlzLl9sYXN0WSA9IHRvdWNoRXZ0LmNsaWVudFk7XG5cblx0XHRcdFx0aWYgKCFzdXBwb3J0Q3NzUG9pbnRlckV2ZW50cykge1xuXHRcdFx0XHRcdF9jc3MoZ2hvc3RFbCwgJ2Rpc3BsYXknLCAnbm9uZScpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIHRhcmdldCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQodG91Y2hFdnQuY2xpZW50WCwgdG91Y2hFdnQuY2xpZW50WSksXG5cdFx0XHRcdFx0cGFyZW50ID0gdGFyZ2V0LFxuXHRcdFx0XHRcdGkgPSB0b3VjaERyYWdPdmVyTGlzdGVuZXJzLmxlbmd0aDtcblxuXHRcdFx0XHRpZiAocGFyZW50KSB7XG5cdFx0XHRcdFx0ZG8ge1xuXHRcdFx0XHRcdFx0aWYgKHBhcmVudFtleHBhbmRvXSkge1xuXHRcdFx0XHRcdFx0XHR3aGlsZSAoaS0tKSB7XG5cdFx0XHRcdFx0XHRcdFx0dG91Y2hEcmFnT3Zlckxpc3RlbmVyc1tpXSh7XG5cdFx0XHRcdFx0XHRcdFx0XHRjbGllbnRYOiB0b3VjaEV2dC5jbGllbnRYLFxuXHRcdFx0XHRcdFx0XHRcdFx0Y2xpZW50WTogdG91Y2hFdnQuY2xpZW50WSxcblx0XHRcdFx0XHRcdFx0XHRcdHRhcmdldDogdGFyZ2V0LFxuXHRcdFx0XHRcdFx0XHRcdFx0cm9vdEVsOiBwYXJlbnRcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR0YXJnZXQgPSBwYXJlbnQ7IC8vIHN0b3JlIGxhc3QgZWxlbWVudFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvKiBqc2hpbnQgYm9zczp0cnVlICovXG5cdFx0XHRcdFx0d2hpbGUgKHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICghc3VwcG9ydENzc1BvaW50ZXJFdmVudHMpIHtcblx0XHRcdFx0XHRfY3NzKGdob3N0RWwsICdkaXNwbGF5JywgJycpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblxuXG5cdFx0X29uVG91Y2hNb3ZlOiBmdW5jdGlvbiAoLyoqVG91Y2hFdmVudCovZXZ0KSB7XG5cdFx0XHRpZiAodGFwRXZ0KSB7XG5cdFx0XHRcdHZhclx0b3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcblx0XHRcdFx0XHRmYWxsYmFja1RvbGVyYW5jZSA9IG9wdGlvbnMuZmFsbGJhY2tUb2xlcmFuY2UsXG5cdFx0XHRcdFx0ZmFsbGJhY2tPZmZzZXQgPSBvcHRpb25zLmZhbGxiYWNrT2Zmc2V0LFxuXHRcdFx0XHRcdHRvdWNoID0gZXZ0LnRvdWNoZXMgPyBldnQudG91Y2hlc1swXSA6IGV2dCxcblx0XHRcdFx0XHRkeCA9ICh0b3VjaC5jbGllbnRYIC0gdGFwRXZ0LmNsaWVudFgpICsgZmFsbGJhY2tPZmZzZXQueCxcblx0XHRcdFx0XHRkeSA9ICh0b3VjaC5jbGllbnRZIC0gdGFwRXZ0LmNsaWVudFkpICsgZmFsbGJhY2tPZmZzZXQueSxcblx0XHRcdFx0XHR0cmFuc2xhdGUzZCA9IGV2dC50b3VjaGVzID8gJ3RyYW5zbGF0ZTNkKCcgKyBkeCArICdweCwnICsgZHkgKyAncHgsMCknIDogJ3RyYW5zbGF0ZSgnICsgZHggKyAncHgsJyArIGR5ICsgJ3B4KSc7XG5cblx0XHRcdFx0Ly8gb25seSBzZXQgdGhlIHN0YXR1cyB0byBkcmFnZ2luZywgd2hlbiB3ZSBhcmUgYWN0dWFsbHkgZHJhZ2dpbmdcblx0XHRcdFx0aWYgKCFTb3J0YWJsZS5hY3RpdmUpIHtcblx0XHRcdFx0XHRpZiAoZmFsbGJhY2tUb2xlcmFuY2UgJiZcblx0XHRcdFx0XHRcdG1pbihhYnModG91Y2guY2xpZW50WCAtIHRoaXMuX2xhc3RYKSwgYWJzKHRvdWNoLmNsaWVudFkgLSB0aGlzLl9sYXN0WSkpIDwgZmFsbGJhY2tUb2xlcmFuY2Vcblx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR0aGlzLl9kcmFnU3RhcnRlZCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gYXMgd2VsbCBhcyBjcmVhdGluZyB0aGUgZ2hvc3QgZWxlbWVudCBvbiB0aGUgZG9jdW1lbnQgYm9keVxuXHRcdFx0XHR0aGlzLl9hcHBlbmRHaG9zdCgpO1xuXG5cdFx0XHRcdG1vdmVkID0gdHJ1ZTtcblx0XHRcdFx0dG91Y2hFdnQgPSB0b3VjaDtcblxuXHRcdFx0XHRfY3NzKGdob3N0RWwsICd3ZWJraXRUcmFuc2Zvcm0nLCB0cmFuc2xhdGUzZCk7XG5cdFx0XHRcdF9jc3MoZ2hvc3RFbCwgJ21velRyYW5zZm9ybScsIHRyYW5zbGF0ZTNkKTtcblx0XHRcdFx0X2NzcyhnaG9zdEVsLCAnbXNUcmFuc2Zvcm0nLCB0cmFuc2xhdGUzZCk7XG5cdFx0XHRcdF9jc3MoZ2hvc3RFbCwgJ3RyYW5zZm9ybScsIHRyYW5zbGF0ZTNkKTtcblxuXHRcdFx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0X2FwcGVuZEdob3N0OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAoIWdob3N0RWwpIHtcblx0XHRcdFx0dmFyIHJlY3QgPSBkcmFnRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG5cdFx0XHRcdFx0Y3NzID0gX2NzcyhkcmFnRWwpLFxuXHRcdFx0XHRcdG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG5cdFx0XHRcdFx0Z2hvc3RSZWN0O1xuXG5cdFx0XHRcdGdob3N0RWwgPSBkcmFnRWwuY2xvbmVOb2RlKHRydWUpO1xuXG5cdFx0XHRcdF90b2dnbGVDbGFzcyhnaG9zdEVsLCBvcHRpb25zLmdob3N0Q2xhc3MsIGZhbHNlKTtcblx0XHRcdFx0X3RvZ2dsZUNsYXNzKGdob3N0RWwsIG9wdGlvbnMuZmFsbGJhY2tDbGFzcywgdHJ1ZSk7XG5cdFx0XHRcdF90b2dnbGVDbGFzcyhnaG9zdEVsLCBvcHRpb25zLmRyYWdDbGFzcywgdHJ1ZSk7XG5cblx0XHRcdFx0X2NzcyhnaG9zdEVsLCAndG9wJywgcmVjdC50b3AgLSBwYXJzZUludChjc3MubWFyZ2luVG9wLCAxMCkpO1xuXHRcdFx0XHRfY3NzKGdob3N0RWwsICdsZWZ0JywgcmVjdC5sZWZ0IC0gcGFyc2VJbnQoY3NzLm1hcmdpbkxlZnQsIDEwKSk7XG5cdFx0XHRcdF9jc3MoZ2hvc3RFbCwgJ3dpZHRoJywgcmVjdC53aWR0aCk7XG5cdFx0XHRcdF9jc3MoZ2hvc3RFbCwgJ2hlaWdodCcsIHJlY3QuaGVpZ2h0KTtcblx0XHRcdFx0X2NzcyhnaG9zdEVsLCAnb3BhY2l0eScsICcwLjgnKTtcblx0XHRcdFx0X2NzcyhnaG9zdEVsLCAncG9zaXRpb24nLCAnZml4ZWQnKTtcblx0XHRcdFx0X2NzcyhnaG9zdEVsLCAnekluZGV4JywgJzEwMDAwMCcpO1xuXHRcdFx0XHRfY3NzKGdob3N0RWwsICdwb2ludGVyRXZlbnRzJywgJ25vbmUnKTtcblxuXHRcdFx0XHRvcHRpb25zLmZhbGxiYWNrT25Cb2R5ICYmIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZ2hvc3RFbCkgfHwgcm9vdEVsLmFwcGVuZENoaWxkKGdob3N0RWwpO1xuXG5cdFx0XHRcdC8vIEZpeGluZyBkaW1lbnNpb25zLlxuXHRcdFx0XHRnaG9zdFJlY3QgPSBnaG9zdEVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdFx0XHRfY3NzKGdob3N0RWwsICd3aWR0aCcsIHJlY3Qud2lkdGggKiAyIC0gZ2hvc3RSZWN0LndpZHRoKTtcblx0XHRcdFx0X2NzcyhnaG9zdEVsLCAnaGVpZ2h0JywgcmVjdC5oZWlnaHQgKiAyIC0gZ2hvc3RSZWN0LmhlaWdodCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdF9vbkRyYWdTdGFydDogZnVuY3Rpb24gKC8qKkV2ZW50Ki9ldnQsIC8qKmJvb2xlYW4qL3VzZUZhbGxiYWNrKSB7XG5cdFx0XHR2YXIgZGF0YVRyYW5zZmVyID0gZXZ0LmRhdGFUcmFuc2Zlcixcblx0XHRcdFx0b3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuXHRcdFx0dGhpcy5fb2ZmVXBFdmVudHMoKTtcblxuXHRcdFx0aWYgKGFjdGl2ZUdyb3VwLmNoZWNrUHVsbCh0aGlzLCB0aGlzLCBkcmFnRWwsIGV2dCkpIHtcblx0XHRcdFx0Y2xvbmVFbCA9IF9jbG9uZShkcmFnRWwpO1xuXG5cdFx0XHRcdGNsb25lRWwuZHJhZ2dhYmxlID0gZmFsc2U7XG5cdFx0XHRcdGNsb25lRWwuc3R5bGVbJ3dpbGwtY2hhbmdlJ10gPSAnJztcblxuXHRcdFx0XHRfY3NzKGNsb25lRWwsICdkaXNwbGF5JywgJ25vbmUnKTtcblx0XHRcdFx0X3RvZ2dsZUNsYXNzKGNsb25lRWwsIHRoaXMub3B0aW9ucy5jaG9zZW5DbGFzcywgZmFsc2UpO1xuXG5cdFx0XHRcdHJvb3RFbC5pbnNlcnRCZWZvcmUoY2xvbmVFbCwgZHJhZ0VsKTtcblx0XHRcdFx0X2Rpc3BhdGNoRXZlbnQodGhpcywgcm9vdEVsLCAnY2xvbmUnLCBkcmFnRWwpO1xuXHRcdFx0fVxuXG5cdFx0XHRfdG9nZ2xlQ2xhc3MoZHJhZ0VsLCBvcHRpb25zLmRyYWdDbGFzcywgdHJ1ZSk7XG5cblx0XHRcdGlmICh1c2VGYWxsYmFjaykge1xuXHRcdFx0XHRpZiAodXNlRmFsbGJhY2sgPT09ICd0b3VjaCcpIHtcblx0XHRcdFx0XHQvLyBCaW5kIHRvdWNoIGV2ZW50c1xuXHRcdFx0XHRcdF9vbihkb2N1bWVudCwgJ3RvdWNobW92ZScsIHRoaXMuX29uVG91Y2hNb3ZlKTtcblx0XHRcdFx0XHRfb24oZG9jdW1lbnQsICd0b3VjaGVuZCcsIHRoaXMuX29uRHJvcCk7XG5cdFx0XHRcdFx0X29uKGRvY3VtZW50LCAndG91Y2hjYW5jZWwnLCB0aGlzLl9vbkRyb3ApO1xuXHRcdFx0XHRcdF9vbihkb2N1bWVudCwgJ3BvaW50ZXJtb3ZlJywgdGhpcy5fb25Ub3VjaE1vdmUpO1xuXHRcdFx0XHRcdF9vbihkb2N1bWVudCwgJ3BvaW50ZXJ1cCcsIHRoaXMuX29uRHJvcCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gT2xkIGJyd29zZXJcblx0XHRcdFx0XHRfb24oZG9jdW1lbnQsICdtb3VzZW1vdmUnLCB0aGlzLl9vblRvdWNoTW92ZSk7XG5cdFx0XHRcdFx0X29uKGRvY3VtZW50LCAnbW91c2V1cCcsIHRoaXMuX29uRHJvcCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLl9sb29wSWQgPSBzZXRJbnRlcnZhbCh0aGlzLl9lbXVsYXRlRHJhZ092ZXIsIDUwKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRpZiAoZGF0YVRyYW5zZmVyKSB7XG5cdFx0XHRcdFx0ZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSAnbW92ZSc7XG5cdFx0XHRcdFx0b3B0aW9ucy5zZXREYXRhICYmIG9wdGlvbnMuc2V0RGF0YS5jYWxsKHRoaXMsIGRhdGFUcmFuc2ZlciwgZHJhZ0VsKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdF9vbihkb2N1bWVudCwgJ2Ryb3AnLCB0aGlzKTtcblx0XHRcdFx0c2V0VGltZW91dCh0aGlzLl9kcmFnU3RhcnRlZCwgMCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdF9vbkRyYWdPdmVyOiBmdW5jdGlvbiAoLyoqRXZlbnQqL2V2dCkge1xuXHRcdFx0dmFyIGVsID0gdGhpcy5lbCxcblx0XHRcdFx0dGFyZ2V0LFxuXHRcdFx0XHRkcmFnUmVjdCxcblx0XHRcdFx0dGFyZ2V0UmVjdCxcblx0XHRcdFx0cmV2ZXJ0LFxuXHRcdFx0XHRvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuXHRcdFx0XHRncm91cCA9IG9wdGlvbnMuZ3JvdXAsXG5cdFx0XHRcdGFjdGl2ZVNvcnRhYmxlID0gU29ydGFibGUuYWN0aXZlLFxuXHRcdFx0XHRpc093bmVyID0gKGFjdGl2ZUdyb3VwID09PSBncm91cCksXG5cdFx0XHRcdGlzTW92aW5nQmV0d2VlblNvcnRhYmxlID0gZmFsc2UsXG5cdFx0XHRcdGNhblNvcnQgPSBvcHRpb25zLnNvcnQ7XG5cblx0XHRcdGlmIChldnQucHJldmVudERlZmF1bHQgIT09IHZvaWQgMCkge1xuXHRcdFx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0IW9wdGlvbnMuZHJhZ292ZXJCdWJibGUgJiYgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZHJhZ0VsLmFuaW1hdGVkKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0bW92ZWQgPSB0cnVlO1xuXG5cdFx0XHRpZiAoYWN0aXZlU29ydGFibGUgJiYgIW9wdGlvbnMuZGlzYWJsZWQgJiZcblx0XHRcdFx0KGlzT3duZXJcblx0XHRcdFx0XHQ/IGNhblNvcnQgfHwgKHJldmVydCA9ICFyb290RWwuY29udGFpbnMoZHJhZ0VsKSkgLy8gUmV2ZXJ0aW5nIGl0ZW0gaW50byB0aGUgb3JpZ2luYWwgbGlzdFxuXHRcdFx0XHRcdDogKFxuXHRcdFx0XHRcdFx0cHV0U29ydGFibGUgPT09IHRoaXMgfHxcblx0XHRcdFx0XHRcdChcblx0XHRcdFx0XHRcdFx0KGFjdGl2ZVNvcnRhYmxlLmxhc3RQdWxsTW9kZSA9IGFjdGl2ZUdyb3VwLmNoZWNrUHVsbCh0aGlzLCBhY3RpdmVTb3J0YWJsZSwgZHJhZ0VsLCBldnQpKSAmJlxuXHRcdFx0XHRcdFx0XHRncm91cC5jaGVja1B1dCh0aGlzLCBhY3RpdmVTb3J0YWJsZSwgZHJhZ0VsLCBldnQpXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpICYmXG5cdFx0XHRcdChldnQucm9vdEVsID09PSB2b2lkIDAgfHwgZXZ0LnJvb3RFbCA9PT0gdGhpcy5lbCkgLy8gdG91Y2ggZmFsbGJhY2tcblx0XHRcdCkge1xuXHRcdFx0XHQvLyBTbWFydCBhdXRvLXNjcm9sbGluZ1xuXHRcdFx0XHRfYXV0b1Njcm9sbChldnQsIG9wdGlvbnMsIHRoaXMuZWwpO1xuXG5cdFx0XHRcdGlmIChfc2lsZW50KSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGFyZ2V0ID0gX2Nsb3Nlc3QoZXZ0LnRhcmdldCwgb3B0aW9ucy5kcmFnZ2FibGUsIGVsKTtcblx0XHRcdFx0ZHJhZ1JlY3QgPSBkcmFnRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cblx0XHRcdFx0aWYgKHB1dFNvcnRhYmxlICE9PSB0aGlzKSB7XG5cdFx0XHRcdFx0cHV0U29ydGFibGUgPSB0aGlzO1xuXHRcdFx0XHRcdGlzTW92aW5nQmV0d2VlblNvcnRhYmxlID0gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChyZXZlcnQpIHtcblx0XHRcdFx0XHRfY2xvbmVIaWRlKGFjdGl2ZVNvcnRhYmxlLCB0cnVlKTtcblx0XHRcdFx0XHRwYXJlbnRFbCA9IHJvb3RFbDsgLy8gYWN0dWFsaXphdGlvblxuXG5cdFx0XHRcdFx0aWYgKGNsb25lRWwgfHwgbmV4dEVsKSB7XG5cdFx0XHRcdFx0XHRyb290RWwuaW5zZXJ0QmVmb3JlKGRyYWdFbCwgY2xvbmVFbCB8fCBuZXh0RWwpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmICghY2FuU29ydCkge1xuXHRcdFx0XHRcdFx0cm9vdEVsLmFwcGVuZENoaWxkKGRyYWdFbCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblxuXHRcdFx0XHRpZiAoKGVsLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkgfHwgKGVsLmNoaWxkcmVuWzBdID09PSBnaG9zdEVsKSB8fFxuXHRcdFx0XHRcdChlbCA9PT0gZXZ0LnRhcmdldCkgJiYgKF9naG9zdElzTGFzdChlbCwgZXZ0KSlcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0Ly9hc3NpZ24gdGFyZ2V0IG9ubHkgaWYgY29uZGl0aW9uIGlzIHRydWVcblx0XHRcdFx0XHRpZiAoZWwuY2hpbGRyZW4ubGVuZ3RoICE9PSAwICYmIGVsLmNoaWxkcmVuWzBdICE9PSBnaG9zdEVsICYmIGVsID09PSBldnQudGFyZ2V0KSB7XG5cdFx0XHRcdFx0XHR0YXJnZXQgPSBlbC5sYXN0RWxlbWVudENoaWxkO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICh0YXJnZXQpIHtcblx0XHRcdFx0XHRcdGlmICh0YXJnZXQuYW5pbWF0ZWQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR0YXJnZXRSZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdF9jbG9uZUhpZGUoYWN0aXZlU29ydGFibGUsIGlzT3duZXIpO1xuXG5cdFx0XHRcdFx0aWYgKF9vbk1vdmUocm9vdEVsLCBlbCwgZHJhZ0VsLCBkcmFnUmVjdCwgdGFyZ2V0LCB0YXJnZXRSZWN0LCBldnQpICE9PSBmYWxzZSkge1xuXHRcdFx0XHRcdFx0aWYgKCFkcmFnRWwuY29udGFpbnMoZWwpKSB7XG5cdFx0XHRcdFx0XHRcdGVsLmFwcGVuZENoaWxkKGRyYWdFbCk7XG5cdFx0XHRcdFx0XHRcdHBhcmVudEVsID0gZWw7IC8vIGFjdHVhbGl6YXRpb25cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0dGhpcy5fYW5pbWF0ZShkcmFnUmVjdCwgZHJhZ0VsKTtcblx0XHRcdFx0XHRcdHRhcmdldCAmJiB0aGlzLl9hbmltYXRlKHRhcmdldFJlY3QsIHRhcmdldCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKHRhcmdldCAmJiAhdGFyZ2V0LmFuaW1hdGVkICYmIHRhcmdldCAhPT0gZHJhZ0VsICYmICh0YXJnZXQucGFyZW50Tm9kZVtleHBhbmRvXSAhPT0gdm9pZCAwKSkge1xuXHRcdFx0XHRcdGlmIChsYXN0RWwgIT09IHRhcmdldCkge1xuXHRcdFx0XHRcdFx0bGFzdEVsID0gdGFyZ2V0O1xuXHRcdFx0XHRcdFx0bGFzdENTUyA9IF9jc3ModGFyZ2V0KTtcblx0XHRcdFx0XHRcdGxhc3RQYXJlbnRDU1MgPSBfY3NzKHRhcmdldC5wYXJlbnROb2RlKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR0YXJnZXRSZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG5cdFx0XHRcdFx0dmFyIHdpZHRoID0gdGFyZ2V0UmVjdC5yaWdodCAtIHRhcmdldFJlY3QubGVmdCxcblx0XHRcdFx0XHRcdGhlaWdodCA9IHRhcmdldFJlY3QuYm90dG9tIC0gdGFyZ2V0UmVjdC50b3AsXG5cdFx0XHRcdFx0XHRmbG9hdGluZyA9IFJfRkxPQVQudGVzdChsYXN0Q1NTLmNzc0Zsb2F0ICsgbGFzdENTUy5kaXNwbGF5KVxuXHRcdFx0XHRcdFx0XHR8fCAobGFzdFBhcmVudENTUy5kaXNwbGF5ID09ICdmbGV4JyAmJiBsYXN0UGFyZW50Q1NTWydmbGV4LWRpcmVjdGlvbiddLmluZGV4T2YoJ3JvdycpID09PSAwKSxcblx0XHRcdFx0XHRcdGlzV2lkZSA9ICh0YXJnZXQub2Zmc2V0V2lkdGggPiBkcmFnRWwub2Zmc2V0V2lkdGgpLFxuXHRcdFx0XHRcdFx0aXNMb25nID0gKHRhcmdldC5vZmZzZXRIZWlnaHQgPiBkcmFnRWwub2Zmc2V0SGVpZ2h0KSxcblx0XHRcdFx0XHRcdGhhbGZ3YXkgPSAoZmxvYXRpbmcgPyAoZXZ0LmNsaWVudFggLSB0YXJnZXRSZWN0LmxlZnQpIC8gd2lkdGggOiAoZXZ0LmNsaWVudFkgLSB0YXJnZXRSZWN0LnRvcCkgLyBoZWlnaHQpID4gMC41LFxuXHRcdFx0XHRcdFx0bmV4dFNpYmxpbmcgPSB0YXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nLFxuXHRcdFx0XHRcdFx0YWZ0ZXIgPSBmYWxzZVxuXHRcdFx0XHRcdDtcblxuXHRcdFx0XHRcdGlmIChmbG9hdGluZykge1xuXHRcdFx0XHRcdFx0dmFyIGVsVG9wID0gZHJhZ0VsLm9mZnNldFRvcCxcblx0XHRcdFx0XHRcdFx0dGdUb3AgPSB0YXJnZXQub2Zmc2V0VG9wO1xuXG5cdFx0XHRcdFx0XHRpZiAoZWxUb3AgPT09IHRnVG9wKSB7XG5cdFx0XHRcdFx0XHRcdGFmdGVyID0gKHRhcmdldC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nID09PSBkcmFnRWwpICYmICFpc1dpZGUgfHwgaGFsZndheSAmJiBpc1dpZGU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmICh0YXJnZXQucHJldmlvdXNFbGVtZW50U2libGluZyA9PT0gZHJhZ0VsIHx8IGRyYWdFbC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nID09PSB0YXJnZXQpIHtcblx0XHRcdFx0XHRcdFx0YWZ0ZXIgPSAoZXZ0LmNsaWVudFkgLSB0YXJnZXRSZWN0LnRvcCkgLyBoZWlnaHQgPiAwLjU7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRhZnRlciA9IHRnVG9wID4gZWxUb3A7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCFpc01vdmluZ0JldHdlZW5Tb3J0YWJsZSkge1xuXHRcdFx0XHRcdFx0YWZ0ZXIgPSAobmV4dFNpYmxpbmcgIT09IGRyYWdFbCkgJiYgIWlzTG9uZyB8fCBoYWxmd2F5ICYmIGlzTG9uZztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR2YXIgbW92ZVZlY3RvciA9IF9vbk1vdmUocm9vdEVsLCBlbCwgZHJhZ0VsLCBkcmFnUmVjdCwgdGFyZ2V0LCB0YXJnZXRSZWN0LCBldnQsIGFmdGVyKTtcblxuXHRcdFx0XHRcdGlmIChtb3ZlVmVjdG9yICE9PSBmYWxzZSkge1xuXHRcdFx0XHRcdFx0aWYgKG1vdmVWZWN0b3IgPT09IDEgfHwgbW92ZVZlY3RvciA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0YWZ0ZXIgPSAobW92ZVZlY3RvciA9PT0gMSk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdF9zaWxlbnQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0c2V0VGltZW91dChfdW5zaWxlbnQsIDMwKTtcblxuXHRcdFx0XHRcdFx0X2Nsb25lSGlkZShhY3RpdmVTb3J0YWJsZSwgaXNPd25lcik7XG5cblx0XHRcdFx0XHRcdGlmICghZHJhZ0VsLmNvbnRhaW5zKGVsKSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoYWZ0ZXIgJiYgIW5leHRTaWJsaW5nKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZWwuYXBwZW5kQ2hpbGQoZHJhZ0VsKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHR0YXJnZXQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZHJhZ0VsLCBhZnRlciA/IG5leHRTaWJsaW5nIDogdGFyZ2V0KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRwYXJlbnRFbCA9IGRyYWdFbC5wYXJlbnROb2RlOyAvLyBhY3R1YWxpemF0aW9uXG5cblx0XHRcdFx0XHRcdHRoaXMuX2FuaW1hdGUoZHJhZ1JlY3QsIGRyYWdFbCk7XG5cdFx0XHRcdFx0XHR0aGlzLl9hbmltYXRlKHRhcmdldFJlY3QsIHRhcmdldCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdF9hbmltYXRlOiBmdW5jdGlvbiAocHJldlJlY3QsIHRhcmdldCkge1xuXHRcdFx0dmFyIG1zID0gdGhpcy5vcHRpb25zLmFuaW1hdGlvbjtcblxuXHRcdFx0aWYgKG1zKSB7XG5cdFx0XHRcdHZhciBjdXJyZW50UmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuXHRcdFx0XHRpZiAocHJldlJlY3Qubm9kZVR5cGUgPT09IDEpIHtcblx0XHRcdFx0XHRwcmV2UmVjdCA9IHByZXZSZWN0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0X2Nzcyh0YXJnZXQsICd0cmFuc2l0aW9uJywgJ25vbmUnKTtcblx0XHRcdFx0X2Nzcyh0YXJnZXQsICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlM2QoJ1xuXHRcdFx0XHRcdCsgKHByZXZSZWN0LmxlZnQgLSBjdXJyZW50UmVjdC5sZWZ0KSArICdweCwnXG5cdFx0XHRcdFx0KyAocHJldlJlY3QudG9wIC0gY3VycmVudFJlY3QudG9wKSArICdweCwwKSdcblx0XHRcdFx0KTtcblxuXHRcdFx0XHR0YXJnZXQub2Zmc2V0V2lkdGg7IC8vIHJlcGFpbnRcblxuXHRcdFx0XHRfY3NzKHRhcmdldCwgJ3RyYW5zaXRpb24nLCAnYWxsICcgKyBtcyArICdtcycpO1xuXHRcdFx0XHRfY3NzKHRhcmdldCwgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUzZCgwLDAsMCknKTtcblxuXHRcdFx0XHRjbGVhclRpbWVvdXQodGFyZ2V0LmFuaW1hdGVkKTtcblx0XHRcdFx0dGFyZ2V0LmFuaW1hdGVkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0X2Nzcyh0YXJnZXQsICd0cmFuc2l0aW9uJywgJycpO1xuXHRcdFx0XHRcdF9jc3ModGFyZ2V0LCAndHJhbnNmb3JtJywgJycpO1xuXHRcdFx0XHRcdHRhcmdldC5hbmltYXRlZCA9IGZhbHNlO1xuXHRcdFx0XHR9LCBtcyk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdF9vZmZVcEV2ZW50czogZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIG93bmVyRG9jdW1lbnQgPSB0aGlzLmVsLm93bmVyRG9jdW1lbnQ7XG5cblx0XHRcdF9vZmYoZG9jdW1lbnQsICd0b3VjaG1vdmUnLCB0aGlzLl9vblRvdWNoTW92ZSk7XG5cdFx0XHRfb2ZmKGRvY3VtZW50LCAncG9pbnRlcm1vdmUnLCB0aGlzLl9vblRvdWNoTW92ZSk7XG5cdFx0XHRfb2ZmKG93bmVyRG9jdW1lbnQsICdtb3VzZXVwJywgdGhpcy5fb25Ecm9wKTtcblx0XHRcdF9vZmYob3duZXJEb2N1bWVudCwgJ3RvdWNoZW5kJywgdGhpcy5fb25Ecm9wKTtcblx0XHRcdF9vZmYob3duZXJEb2N1bWVudCwgJ3BvaW50ZXJ1cCcsIHRoaXMuX29uRHJvcCk7XG5cdFx0XHRfb2ZmKG93bmVyRG9jdW1lbnQsICd0b3VjaGNhbmNlbCcsIHRoaXMuX29uRHJvcCk7XG5cdFx0XHRfb2ZmKG93bmVyRG9jdW1lbnQsICdwb2ludGVyY2FuY2VsJywgdGhpcy5fb25Ecm9wKTtcblx0XHRcdF9vZmYob3duZXJEb2N1bWVudCwgJ3NlbGVjdHN0YXJ0JywgdGhpcyk7XG5cdFx0fSxcblxuXHRcdF9vbkRyb3A6IGZ1bmN0aW9uICgvKipFdmVudCovZXZ0KSB7XG5cdFx0XHR2YXIgZWwgPSB0aGlzLmVsLFxuXHRcdFx0XHRvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG5cdFx0XHRjbGVhckludGVydmFsKHRoaXMuX2xvb3BJZCk7XG5cdFx0XHRjbGVhckludGVydmFsKGF1dG9TY3JvbGwucGlkKTtcblx0XHRcdGNsZWFyVGltZW91dCh0aGlzLl9kcmFnU3RhcnRUaW1lcik7XG5cblx0XHRcdC8vIFVuYmluZCBldmVudHNcblx0XHRcdF9vZmYoZG9jdW1lbnQsICdtb3VzZW1vdmUnLCB0aGlzLl9vblRvdWNoTW92ZSk7XG5cblx0XHRcdGlmICh0aGlzLm5hdGl2ZURyYWdnYWJsZSkge1xuXHRcdFx0XHRfb2ZmKGRvY3VtZW50LCAnZHJvcCcsIHRoaXMpO1xuXHRcdFx0XHRfb2ZmKGVsLCAnZHJhZ3N0YXJ0JywgdGhpcy5fb25EcmFnU3RhcnQpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9vZmZVcEV2ZW50cygpO1xuXG5cdFx0XHRpZiAoZXZ0KSB7XG5cdFx0XHRcdGlmIChtb3ZlZCkge1xuXHRcdFx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdCFvcHRpb25zLmRyb3BCdWJibGUgJiYgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Z2hvc3RFbCAmJiBnaG9zdEVsLnBhcmVudE5vZGUgJiYgZ2hvc3RFbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGdob3N0RWwpO1xuXG5cdFx0XHRcdGlmIChyb290RWwgPT09IHBhcmVudEVsIHx8IFNvcnRhYmxlLmFjdGl2ZS5sYXN0UHVsbE1vZGUgIT09ICdjbG9uZScpIHtcblx0XHRcdFx0XHQvLyBSZW1vdmUgY2xvbmVcblx0XHRcdFx0XHRjbG9uZUVsICYmIGNsb25lRWwucGFyZW50Tm9kZSAmJiBjbG9uZUVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoY2xvbmVFbCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoZHJhZ0VsKSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMubmF0aXZlRHJhZ2dhYmxlKSB7XG5cdFx0XHRcdFx0XHRfb2ZmKGRyYWdFbCwgJ2RyYWdlbmQnLCB0aGlzKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRfZGlzYWJsZURyYWdnYWJsZShkcmFnRWwpO1xuXHRcdFx0XHRcdGRyYWdFbC5zdHlsZVsnd2lsbC1jaGFuZ2UnXSA9ICcnO1xuXG5cdFx0XHRcdFx0Ly8gUmVtb3ZlIGNsYXNzJ3Ncblx0XHRcdFx0XHRfdG9nZ2xlQ2xhc3MoZHJhZ0VsLCB0aGlzLm9wdGlvbnMuZ2hvc3RDbGFzcywgZmFsc2UpO1xuXHRcdFx0XHRcdF90b2dnbGVDbGFzcyhkcmFnRWwsIHRoaXMub3B0aW9ucy5jaG9zZW5DbGFzcywgZmFsc2UpO1xuXG5cdFx0XHRcdFx0Ly8gRHJhZyBzdG9wIGV2ZW50XG5cdFx0XHRcdFx0X2Rpc3BhdGNoRXZlbnQodGhpcywgcm9vdEVsLCAndW5jaG9vc2UnLCBkcmFnRWwsIHJvb3RFbCwgb2xkSW5kZXgpO1xuXG5cdFx0XHRcdFx0aWYgKHJvb3RFbCAhPT0gcGFyZW50RWwpIHtcblx0XHRcdFx0XHRcdG5ld0luZGV4ID0gX2luZGV4KGRyYWdFbCwgb3B0aW9ucy5kcmFnZ2FibGUpO1xuXG5cdFx0XHRcdFx0XHRpZiAobmV3SW5kZXggPj0gMCkge1xuXHRcdFx0XHRcdFx0XHQvLyBBZGQgZXZlbnRcblx0XHRcdFx0XHRcdFx0X2Rpc3BhdGNoRXZlbnQobnVsbCwgcGFyZW50RWwsICdhZGQnLCBkcmFnRWwsIHJvb3RFbCwgb2xkSW5kZXgsIG5ld0luZGV4KTtcblxuXHRcdFx0XHRcdFx0XHQvLyBSZW1vdmUgZXZlbnRcblx0XHRcdFx0XHRcdFx0X2Rpc3BhdGNoRXZlbnQodGhpcywgcm9vdEVsLCAncmVtb3ZlJywgZHJhZ0VsLCByb290RWwsIG9sZEluZGV4LCBuZXdJbmRleCk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gZHJhZyBmcm9tIG9uZSBsaXN0IGFuZCBkcm9wIGludG8gYW5vdGhlclxuXHRcdFx0XHRcdFx0XHRfZGlzcGF0Y2hFdmVudChudWxsLCBwYXJlbnRFbCwgJ3NvcnQnLCBkcmFnRWwsIHJvb3RFbCwgb2xkSW5kZXgsIG5ld0luZGV4KTtcblx0XHRcdFx0XHRcdFx0X2Rpc3BhdGNoRXZlbnQodGhpcywgcm9vdEVsLCAnc29ydCcsIGRyYWdFbCwgcm9vdEVsLCBvbGRJbmRleCwgbmV3SW5kZXgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdGlmIChkcmFnRWwubmV4dFNpYmxpbmcgIT09IG5leHRFbCkge1xuXHRcdFx0XHRcdFx0XHQvLyBHZXQgdGhlIGluZGV4IG9mIHRoZSBkcmFnZ2VkIGVsZW1lbnQgd2l0aGluIGl0cyBwYXJlbnRcblx0XHRcdFx0XHRcdFx0bmV3SW5kZXggPSBfaW5kZXgoZHJhZ0VsLCBvcHRpb25zLmRyYWdnYWJsZSk7XG5cblx0XHRcdFx0XHRcdFx0aWYgKG5ld0luZGV4ID49IDApIHtcblx0XHRcdFx0XHRcdFx0XHQvLyBkcmFnICYgZHJvcCB3aXRoaW4gdGhlIHNhbWUgbGlzdFxuXHRcdFx0XHRcdFx0XHRcdF9kaXNwYXRjaEV2ZW50KHRoaXMsIHJvb3RFbCwgJ3VwZGF0ZScsIGRyYWdFbCwgcm9vdEVsLCBvbGRJbmRleCwgbmV3SW5kZXgpO1xuXHRcdFx0XHRcdFx0XHRcdF9kaXNwYXRjaEV2ZW50KHRoaXMsIHJvb3RFbCwgJ3NvcnQnLCBkcmFnRWwsIHJvb3RFbCwgb2xkSW5kZXgsIG5ld0luZGV4KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChTb3J0YWJsZS5hY3RpdmUpIHtcblx0XHRcdFx0XHRcdC8qIGpzaGludCBlcW51bGw6dHJ1ZSAqL1xuXHRcdFx0XHRcdFx0aWYgKG5ld0luZGV4ID09IG51bGwgfHwgbmV3SW5kZXggPT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdG5ld0luZGV4ID0gb2xkSW5kZXg7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdF9kaXNwYXRjaEV2ZW50KHRoaXMsIHJvb3RFbCwgJ2VuZCcsIGRyYWdFbCwgcm9vdEVsLCBvbGRJbmRleCwgbmV3SW5kZXgpO1xuXG5cdFx0XHRcdFx0XHQvLyBTYXZlIHNvcnRpbmdcblx0XHRcdFx0XHRcdHRoaXMuc2F2ZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuX251bGxpbmcoKTtcblx0XHR9LFxuXG5cdFx0X251bGxpbmc6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cm9vdEVsID1cblx0XHRcdGRyYWdFbCA9XG5cdFx0XHRwYXJlbnRFbCA9XG5cdFx0XHRnaG9zdEVsID1cblx0XHRcdG5leHRFbCA9XG5cdFx0XHRjbG9uZUVsID1cblx0XHRcdGxhc3REb3duRWwgPVxuXG5cdFx0XHRzY3JvbGxFbCA9XG5cdFx0XHRzY3JvbGxQYXJlbnRFbCA9XG5cblx0XHRcdHRhcEV2dCA9XG5cdFx0XHR0b3VjaEV2dCA9XG5cblx0XHRcdG1vdmVkID1cblx0XHRcdG5ld0luZGV4ID1cblxuXHRcdFx0bGFzdEVsID1cblx0XHRcdGxhc3RDU1MgPVxuXG5cdFx0XHRwdXRTb3J0YWJsZSA9XG5cdFx0XHRhY3RpdmVHcm91cCA9XG5cdFx0XHRTb3J0YWJsZS5hY3RpdmUgPSBudWxsO1xuXG5cdFx0XHRzYXZlZElucHV0Q2hlY2tlZC5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuXHRcdFx0XHRlbC5jaGVja2VkID0gdHJ1ZTtcblx0XHRcdH0pO1xuXHRcdFx0c2F2ZWRJbnB1dENoZWNrZWQubGVuZ3RoID0gMDtcblx0XHR9LFxuXG5cdFx0aGFuZGxlRXZlbnQ6IGZ1bmN0aW9uICgvKipFdmVudCovZXZ0KSB7XG5cdFx0XHRzd2l0Y2ggKGV2dC50eXBlKSB7XG5cdFx0XHRcdGNhc2UgJ2Ryb3AnOlxuXHRcdFx0XHRjYXNlICdkcmFnZW5kJzpcblx0XHRcdFx0XHR0aGlzLl9vbkRyb3AoZXZ0KTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlICdkcmFnb3Zlcic6XG5cdFx0XHRcdGNhc2UgJ2RyYWdlbnRlcic6XG5cdFx0XHRcdFx0aWYgKGRyYWdFbCkge1xuXHRcdFx0XHRcdFx0dGhpcy5fb25EcmFnT3ZlcihldnQpO1xuXHRcdFx0XHRcdFx0X2dsb2JhbERyYWdPdmVyKGV2dCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgJ3NlbGVjdHN0YXJ0Jzpcblx0XHRcdFx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiBTZXJpYWxpemVzIHRoZSBpdGVtIGludG8gYW4gYXJyYXkgb2Ygc3RyaW5nLlxuXHRcdCAqIEByZXR1cm5zIHtTdHJpbmdbXX1cblx0XHQgKi9cblx0XHR0b0FycmF5OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgb3JkZXIgPSBbXSxcblx0XHRcdFx0ZWwsXG5cdFx0XHRcdGNoaWxkcmVuID0gdGhpcy5lbC5jaGlsZHJlbixcblx0XHRcdFx0aSA9IDAsXG5cdFx0XHRcdG4gPSBjaGlsZHJlbi5sZW5ndGgsXG5cdFx0XHRcdG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cblx0XHRcdGZvciAoOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRcdGVsID0gY2hpbGRyZW5baV07XG5cdFx0XHRcdGlmIChfY2xvc2VzdChlbCwgb3B0aW9ucy5kcmFnZ2FibGUsIHRoaXMuZWwpKSB7XG5cdFx0XHRcdFx0b3JkZXIucHVzaChlbC5nZXRBdHRyaWJ1dGUob3B0aW9ucy5kYXRhSWRBdHRyKSB8fCBfZ2VuZXJhdGVJZChlbCkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBvcmRlcjtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiBTb3J0cyB0aGUgZWxlbWVudHMgYWNjb3JkaW5nIHRvIHRoZSBhcnJheS5cblx0XHQgKiBAcGFyYW0gIHtTdHJpbmdbXX0gIG9yZGVyICBvcmRlciBvZiB0aGUgaXRlbXNcblx0XHQgKi9cblx0XHRzb3J0OiBmdW5jdGlvbiAob3JkZXIpIHtcblx0XHRcdHZhciBpdGVtcyA9IHt9LCByb290RWwgPSB0aGlzLmVsO1xuXG5cdFx0XHR0aGlzLnRvQXJyYXkoKS5mb3JFYWNoKGZ1bmN0aW9uIChpZCwgaSkge1xuXHRcdFx0XHR2YXIgZWwgPSByb290RWwuY2hpbGRyZW5baV07XG5cblx0XHRcdFx0aWYgKF9jbG9zZXN0KGVsLCB0aGlzLm9wdGlvbnMuZHJhZ2dhYmxlLCByb290RWwpKSB7XG5cdFx0XHRcdFx0aXRlbXNbaWRdID0gZWw7XG5cdFx0XHRcdH1cblx0XHRcdH0sIHRoaXMpO1xuXG5cdFx0XHRvcmRlci5mb3JFYWNoKGZ1bmN0aW9uIChpZCkge1xuXHRcdFx0XHRpZiAoaXRlbXNbaWRdKSB7XG5cdFx0XHRcdFx0cm9vdEVsLnJlbW92ZUNoaWxkKGl0ZW1zW2lkXSk7XG5cdFx0XHRcdFx0cm9vdEVsLmFwcGVuZENoaWxkKGl0ZW1zW2lkXSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqIFNhdmUgdGhlIGN1cnJlbnQgc29ydGluZ1xuXHRcdCAqL1xuXHRcdHNhdmU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBzdG9yZSA9IHRoaXMub3B0aW9ucy5zdG9yZTtcblx0XHRcdHN0b3JlICYmIHN0b3JlLnNldCh0aGlzKTtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiBGb3IgZWFjaCBlbGVtZW50IGluIHRoZSBzZXQsIGdldCB0aGUgZmlyc3QgZWxlbWVudCB0aGF0IG1hdGNoZXMgdGhlIHNlbGVjdG9yIGJ5IHRlc3RpbmcgdGhlIGVsZW1lbnQgaXRzZWxmIGFuZCB0cmF2ZXJzaW5nIHVwIHRocm91Z2ggaXRzIGFuY2VzdG9ycyBpbiB0aGUgRE9NIHRyZWUuXG5cdFx0ICogQHBhcmFtICAge0hUTUxFbGVtZW50fSAgZWxcblx0XHQgKiBAcGFyYW0gICB7U3RyaW5nfSAgICAgICBbc2VsZWN0b3JdICBkZWZhdWx0OiBgb3B0aW9ucy5kcmFnZ2FibGVgXG5cdFx0ICogQHJldHVybnMge0hUTUxFbGVtZW50fG51bGx9XG5cdFx0ICovXG5cdFx0Y2xvc2VzdDogZnVuY3Rpb24gKGVsLCBzZWxlY3Rvcikge1xuXHRcdFx0cmV0dXJuIF9jbG9zZXN0KGVsLCBzZWxlY3RvciB8fCB0aGlzLm9wdGlvbnMuZHJhZ2dhYmxlLCB0aGlzLmVsKTtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiBTZXQvZ2V0IG9wdGlvblxuXHRcdCAqIEBwYXJhbSAgIHtzdHJpbmd9IG5hbWVcblx0XHQgKiBAcGFyYW0gICB7Kn0gICAgICBbdmFsdWVdXG5cdFx0ICogQHJldHVybnMgeyp9XG5cdFx0ICovXG5cdFx0b3B0aW9uOiBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcblx0XHRcdHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG5cdFx0XHRpZiAodmFsdWUgPT09IHZvaWQgMCkge1xuXHRcdFx0XHRyZXR1cm4gb3B0aW9uc1tuYW1lXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG9wdGlvbnNbbmFtZV0gPSB2YWx1ZTtcblxuXHRcdFx0XHRpZiAobmFtZSA9PT0gJ2dyb3VwJykge1xuXHRcdFx0XHRcdF9wcmVwYXJlR3JvdXAob3B0aW9ucyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiBEZXN0cm95XG5cdFx0ICovXG5cdFx0ZGVzdHJveTogZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGVsID0gdGhpcy5lbDtcblxuXHRcdFx0ZWxbZXhwYW5kb10gPSBudWxsO1xuXG5cdFx0XHRfb2ZmKGVsLCAnbW91c2Vkb3duJywgdGhpcy5fb25UYXBTdGFydCk7XG5cdFx0XHRfb2ZmKGVsLCAndG91Y2hzdGFydCcsIHRoaXMuX29uVGFwU3RhcnQpO1xuXHRcdFx0X29mZihlbCwgJ3BvaW50ZXJkb3duJywgdGhpcy5fb25UYXBTdGFydCk7XG5cblx0XHRcdGlmICh0aGlzLm5hdGl2ZURyYWdnYWJsZSkge1xuXHRcdFx0XHRfb2ZmKGVsLCAnZHJhZ292ZXInLCB0aGlzKTtcblx0XHRcdFx0X29mZihlbCwgJ2RyYWdlbnRlcicsIHRoaXMpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBSZW1vdmUgZHJhZ2dhYmxlIGF0dHJpYnV0ZXNcblx0XHRcdEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoZWwucXVlcnlTZWxlY3RvckFsbCgnW2RyYWdnYWJsZV0nKSwgZnVuY3Rpb24gKGVsKSB7XG5cdFx0XHRcdGVsLnJlbW92ZUF0dHJpYnV0ZSgnZHJhZ2dhYmxlJyk7XG5cdFx0XHR9KTtcblxuXHRcdFx0dG91Y2hEcmFnT3Zlckxpc3RlbmVycy5zcGxpY2UodG91Y2hEcmFnT3Zlckxpc3RlbmVycy5pbmRleE9mKHRoaXMuX29uRHJhZ092ZXIpLCAxKTtcblxuXHRcdFx0dGhpcy5fb25Ecm9wKCk7XG5cblx0XHRcdHRoaXMuZWwgPSBlbCA9IG51bGw7XG5cdFx0fVxuXHR9O1xuXG5cblx0ZnVuY3Rpb24gX2Nsb25lSGlkZShzb3J0YWJsZSwgc3RhdGUpIHtcblx0XHRpZiAoc29ydGFibGUubGFzdFB1bGxNb2RlICE9PSAnY2xvbmUnKSB7XG5cdFx0XHRzdGF0ZSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKGNsb25lRWwgJiYgKGNsb25lRWwuc3RhdGUgIT09IHN0YXRlKSkge1xuXHRcdFx0X2NzcyhjbG9uZUVsLCAnZGlzcGxheScsIHN0YXRlID8gJ25vbmUnIDogJycpO1xuXG5cdFx0XHRpZiAoIXN0YXRlKSB7XG5cdFx0XHRcdGlmIChjbG9uZUVsLnN0YXRlKSB7XG5cdFx0XHRcdFx0aWYgKHNvcnRhYmxlLm9wdGlvbnMuZ3JvdXAucmV2ZXJ0Q2xvbmUpIHtcblx0XHRcdFx0XHRcdHJvb3RFbC5pbnNlcnRCZWZvcmUoY2xvbmVFbCwgbmV4dEVsKTtcblx0XHRcdFx0XHRcdHNvcnRhYmxlLl9hbmltYXRlKGRyYWdFbCwgY2xvbmVFbCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJvb3RFbC5pbnNlcnRCZWZvcmUoY2xvbmVFbCwgZHJhZ0VsKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Y2xvbmVFbC5zdGF0ZSA9IHN0YXRlO1xuXHRcdH1cblx0fVxuXG5cblx0ZnVuY3Rpb24gX2Nsb3Nlc3QoLyoqSFRNTEVsZW1lbnQqL2VsLCAvKipTdHJpbmcqL3NlbGVjdG9yLCAvKipIVE1MRWxlbWVudCovY3R4KSB7XG5cdFx0aWYgKGVsKSB7XG5cdFx0XHRjdHggPSBjdHggfHwgZG9jdW1lbnQ7XG5cblx0XHRcdGRvIHtcblx0XHRcdFx0aWYgKChzZWxlY3RvciA9PT0gJz4qJyAmJiBlbC5wYXJlbnROb2RlID09PSBjdHgpIHx8IF9tYXRjaGVzKGVsLCBzZWxlY3RvcikpIHtcblx0XHRcdFx0XHRyZXR1cm4gZWw7XG5cdFx0XHRcdH1cblx0XHRcdFx0LyoganNoaW50IGJvc3M6dHJ1ZSAqL1xuXHRcdFx0fSB3aGlsZSAoZWwgPSBfZ2V0UGFyZW50T3JIb3N0KGVsKSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXG5cdGZ1bmN0aW9uIF9nZXRQYXJlbnRPckhvc3QoZWwpIHtcblx0XHR2YXIgcGFyZW50ID0gZWwuaG9zdDtcblxuXHRcdHJldHVybiAocGFyZW50ICYmIHBhcmVudC5ub2RlVHlwZSkgPyBwYXJlbnQgOiBlbC5wYXJlbnROb2RlO1xuXHR9XG5cblxuXHRmdW5jdGlvbiBfZ2xvYmFsRHJhZ092ZXIoLyoqRXZlbnQqL2V2dCkge1xuXHRcdGlmIChldnQuZGF0YVRyYW5zZmVyKSB7XG5cdFx0XHRldnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnbW92ZSc7XG5cdFx0fVxuXHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9XG5cblxuXHRmdW5jdGlvbiBfb24oZWwsIGV2ZW50LCBmbikge1xuXHRcdGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGZuLCBjYXB0dXJlTW9kZSk7XG5cdH1cblxuXG5cdGZ1bmN0aW9uIF9vZmYoZWwsIGV2ZW50LCBmbikge1xuXHRcdGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGZuLCBjYXB0dXJlTW9kZSk7XG5cdH1cblxuXG5cdGZ1bmN0aW9uIF90b2dnbGVDbGFzcyhlbCwgbmFtZSwgc3RhdGUpIHtcblx0XHRpZiAoZWwpIHtcblx0XHRcdGlmIChlbC5jbGFzc0xpc3QpIHtcblx0XHRcdFx0ZWwuY2xhc3NMaXN0W3N0YXRlID8gJ2FkZCcgOiAncmVtb3ZlJ10obmFtZSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0dmFyIGNsYXNzTmFtZSA9ICgnICcgKyBlbC5jbGFzc05hbWUgKyAnICcpLnJlcGxhY2UoUl9TUEFDRSwgJyAnKS5yZXBsYWNlKCcgJyArIG5hbWUgKyAnICcsICcgJyk7XG5cdFx0XHRcdGVsLmNsYXNzTmFtZSA9IChjbGFzc05hbWUgKyAoc3RhdGUgPyAnICcgKyBuYW1lIDogJycpKS5yZXBsYWNlKFJfU1BBQ0UsICcgJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblxuXHRmdW5jdGlvbiBfY3NzKGVsLCBwcm9wLCB2YWwpIHtcblx0XHR2YXIgc3R5bGUgPSBlbCAmJiBlbC5zdHlsZTtcblxuXHRcdGlmIChzdHlsZSkge1xuXHRcdFx0aWYgKHZhbCA9PT0gdm9pZCAwKSB7XG5cdFx0XHRcdGlmIChkb2N1bWVudC5kZWZhdWx0VmlldyAmJiBkb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKSB7XG5cdFx0XHRcdFx0dmFsID0gZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZShlbCwgJycpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKGVsLmN1cnJlbnRTdHlsZSkge1xuXHRcdFx0XHRcdHZhbCA9IGVsLmN1cnJlbnRTdHlsZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBwcm9wID09PSB2b2lkIDAgPyB2YWwgOiB2YWxbcHJvcF07XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYgKCEocHJvcCBpbiBzdHlsZSkpIHtcblx0XHRcdFx0XHRwcm9wID0gJy13ZWJraXQtJyArIHByb3A7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzdHlsZVtwcm9wXSA9IHZhbCArICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJyA/ICcnIDogJ3B4Jyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblxuXHRmdW5jdGlvbiBfZmluZChjdHgsIHRhZ05hbWUsIGl0ZXJhdG9yKSB7XG5cdFx0aWYgKGN0eCkge1xuXHRcdFx0dmFyIGxpc3QgPSBjdHguZ2V0RWxlbWVudHNCeVRhZ05hbWUodGFnTmFtZSksIGkgPSAwLCBuID0gbGlzdC5sZW5ndGg7XG5cblx0XHRcdGlmIChpdGVyYXRvcikge1xuXHRcdFx0XHRmb3IgKDsgaSA8IG47IGkrKykge1xuXHRcdFx0XHRcdGl0ZXJhdG9yKGxpc3RbaV0sIGkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBsaXN0O1xuXHRcdH1cblxuXHRcdHJldHVybiBbXTtcblx0fVxuXG5cblxuXHRmdW5jdGlvbiBfZGlzcGF0Y2hFdmVudChzb3J0YWJsZSwgcm9vdEVsLCBuYW1lLCB0YXJnZXRFbCwgZnJvbUVsLCBzdGFydEluZGV4LCBuZXdJbmRleCkge1xuXHRcdHNvcnRhYmxlID0gKHNvcnRhYmxlIHx8IHJvb3RFbFtleHBhbmRvXSk7XG5cblx0XHR2YXIgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50JyksXG5cdFx0XHRvcHRpb25zID0gc29ydGFibGUub3B0aW9ucyxcblx0XHRcdG9uTmFtZSA9ICdvbicgKyBuYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zdWJzdHIoMSk7XG5cblx0XHRldnQuaW5pdEV2ZW50KG5hbWUsIHRydWUsIHRydWUpO1xuXG5cdFx0ZXZ0LnRvID0gcm9vdEVsO1xuXHRcdGV2dC5mcm9tID0gZnJvbUVsIHx8IHJvb3RFbDtcblx0XHRldnQuaXRlbSA9IHRhcmdldEVsIHx8IHJvb3RFbDtcblx0XHRldnQuY2xvbmUgPSBjbG9uZUVsO1xuXG5cdFx0ZXZ0Lm9sZEluZGV4ID0gc3RhcnRJbmRleDtcblx0XHRldnQubmV3SW5kZXggPSBuZXdJbmRleDtcblxuXHRcdHJvb3RFbC5kaXNwYXRjaEV2ZW50KGV2dCk7XG5cblx0XHRpZiAob3B0aW9uc1tvbk5hbWVdKSB7XG5cdFx0XHRvcHRpb25zW29uTmFtZV0uY2FsbChzb3J0YWJsZSwgZXZ0KTtcblx0XHR9XG5cdH1cblxuXG5cdGZ1bmN0aW9uIF9vbk1vdmUoZnJvbUVsLCB0b0VsLCBkcmFnRWwsIGRyYWdSZWN0LCB0YXJnZXRFbCwgdGFyZ2V0UmVjdCwgb3JpZ2luYWxFdnQsIHdpbGxJbnNlcnRBZnRlcikge1xuXHRcdHZhciBldnQsXG5cdFx0XHRzb3J0YWJsZSA9IGZyb21FbFtleHBhbmRvXSxcblx0XHRcdG9uTW92ZUZuID0gc29ydGFibGUub3B0aW9ucy5vbk1vdmUsXG5cdFx0XHRyZXRWYWw7XG5cblx0XHRldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcblx0XHRldnQuaW5pdEV2ZW50KCdtb3ZlJywgdHJ1ZSwgdHJ1ZSk7XG5cblx0XHRldnQudG8gPSB0b0VsO1xuXHRcdGV2dC5mcm9tID0gZnJvbUVsO1xuXHRcdGV2dC5kcmFnZ2VkID0gZHJhZ0VsO1xuXHRcdGV2dC5kcmFnZ2VkUmVjdCA9IGRyYWdSZWN0O1xuXHRcdGV2dC5yZWxhdGVkID0gdGFyZ2V0RWwgfHwgdG9FbDtcblx0XHRldnQucmVsYXRlZFJlY3QgPSB0YXJnZXRSZWN0IHx8IHRvRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0ZXZ0LndpbGxJbnNlcnRBZnRlciA9IHdpbGxJbnNlcnRBZnRlcjtcblxuXHRcdGZyb21FbC5kaXNwYXRjaEV2ZW50KGV2dCk7XG5cblx0XHRpZiAob25Nb3ZlRm4pIHtcblx0XHRcdHJldFZhbCA9IG9uTW92ZUZuLmNhbGwoc29ydGFibGUsIGV2dCwgb3JpZ2luYWxFdnQpO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXRWYWw7XG5cdH1cblxuXG5cdGZ1bmN0aW9uIF9kaXNhYmxlRHJhZ2dhYmxlKGVsKSB7XG5cdFx0ZWwuZHJhZ2dhYmxlID0gZmFsc2U7XG5cdH1cblxuXG5cdGZ1bmN0aW9uIF91bnNpbGVudCgpIHtcblx0XHRfc2lsZW50ID0gZmFsc2U7XG5cdH1cblxuXG5cdC8qKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR8ZmFsc2V9ICovXG5cdGZ1bmN0aW9uIF9naG9zdElzTGFzdChlbCwgZXZ0KSB7XG5cdFx0dmFyIGxhc3RFbCA9IGVsLmxhc3RFbGVtZW50Q2hpbGQsXG5cdFx0XHRyZWN0ID0gbGFzdEVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG5cdFx0Ly8gNSDigJQgbWluIGRlbHRhXG5cdFx0Ly8gYWJzIOKAlCDQvdC10LvRjNC30Y8g0LTQvtCx0LDQstC70Y/RgtGMLCDQsCDRgtC+INCz0LvRjtC60Lgg0L/RgNC4INC90LDQstC10LTQtdC90LjQuCDRgdCy0LXRgNGF0YNcblx0XHRyZXR1cm4gKGV2dC5jbGllbnRZIC0gKHJlY3QudG9wICsgcmVjdC5oZWlnaHQpID4gNSkgfHxcblx0XHRcdChldnQuY2xpZW50WCAtIChyZWN0LmxlZnQgKyByZWN0LndpZHRoKSA+IDUpO1xuXHR9XG5cblxuXHQvKipcblx0ICogR2VuZXJhdGUgaWRcblx0ICogQHBhcmFtICAge0hUTUxFbGVtZW50fSBlbFxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfVxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0ZnVuY3Rpb24gX2dlbmVyYXRlSWQoZWwpIHtcblx0XHR2YXIgc3RyID0gZWwudGFnTmFtZSArIGVsLmNsYXNzTmFtZSArIGVsLnNyYyArIGVsLmhyZWYgKyBlbC50ZXh0Q29udGVudCxcblx0XHRcdGkgPSBzdHIubGVuZ3RoLFxuXHRcdFx0c3VtID0gMDtcblxuXHRcdHdoaWxlIChpLS0pIHtcblx0XHRcdHN1bSArPSBzdHIuY2hhckNvZGVBdChpKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gc3VtLnRvU3RyaW5nKDM2KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBpbmRleCBvZiBhbiBlbGVtZW50IHdpdGhpbiBpdHMgcGFyZW50IGZvciBhIHNlbGVjdGVkIHNldCBvZlxuXHQgKiBlbGVtZW50c1xuXHQgKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxcblx0ICogQHBhcmFtICB7c2VsZWN0b3J9IHNlbGVjdG9yXG5cdCAqIEByZXR1cm4ge251bWJlcn1cblx0ICovXG5cdGZ1bmN0aW9uIF9pbmRleChlbCwgc2VsZWN0b3IpIHtcblx0XHR2YXIgaW5kZXggPSAwO1xuXG5cdFx0aWYgKCFlbCB8fCAhZWwucGFyZW50Tm9kZSkge1xuXHRcdFx0cmV0dXJuIC0xO1xuXHRcdH1cblxuXHRcdHdoaWxlIChlbCAmJiAoZWwgPSBlbC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKSkge1xuXHRcdFx0aWYgKChlbC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpICE9PSAnVEVNUExBVEUnKSAmJiAoc2VsZWN0b3IgPT09ICc+KicgfHwgX21hdGNoZXMoZWwsIHNlbGVjdG9yKSkpIHtcblx0XHRcdFx0aW5kZXgrKztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gaW5kZXg7XG5cdH1cblxuXHRmdW5jdGlvbiBfbWF0Y2hlcygvKipIVE1MRWxlbWVudCovZWwsIC8qKlN0cmluZyovc2VsZWN0b3IpIHtcblx0XHRpZiAoZWwpIHtcblx0XHRcdHNlbGVjdG9yID0gc2VsZWN0b3Iuc3BsaXQoJy4nKTtcblxuXHRcdFx0dmFyIHRhZyA9IHNlbGVjdG9yLnNoaWZ0KCkudG9VcHBlckNhc2UoKSxcblx0XHRcdFx0cmUgPSBuZXcgUmVnRXhwKCdcXFxccygnICsgc2VsZWN0b3Iuam9pbignfCcpICsgJykoPz1cXFxccyknLCAnZycpO1xuXG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHQodGFnID09PSAnJyB8fCBlbC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpID09IHRhZykgJiZcblx0XHRcdFx0KCFzZWxlY3Rvci5sZW5ndGggfHwgKCgnICcgKyBlbC5jbGFzc05hbWUgKyAnICcpLm1hdGNoKHJlKSB8fCBbXSkubGVuZ3RoID09IHNlbGVjdG9yLmxlbmd0aClcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0ZnVuY3Rpb24gX3Rocm90dGxlKGNhbGxiYWNrLCBtcykge1xuXHRcdHZhciBhcmdzLCBfdGhpcztcblxuXHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAoYXJncyA9PT0gdm9pZCAwKSB7XG5cdFx0XHRcdGFyZ3MgPSBhcmd1bWVudHM7XG5cdFx0XHRcdF90aGlzID0gdGhpcztcblxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpZiAoYXJncy5sZW5ndGggPT09IDEpIHtcblx0XHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwoX3RoaXMsIGFyZ3NbMF0pO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjYWxsYmFjay5hcHBseShfdGhpcywgYXJncyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0YXJncyA9IHZvaWQgMDtcblx0XHRcdFx0fSwgbXMpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBfZXh0ZW5kKGRzdCwgc3JjKSB7XG5cdFx0aWYgKGRzdCAmJiBzcmMpIHtcblx0XHRcdGZvciAodmFyIGtleSBpbiBzcmMpIHtcblx0XHRcdFx0aWYgKHNyYy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdFx0XHRcdFx0ZHN0W2tleV0gPSBzcmNba2V5XTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBkc3Q7XG5cdH1cblxuXHRmdW5jdGlvbiBfY2xvbmUoZWwpIHtcblx0XHRyZXR1cm4gJFxuXHRcdFx0PyAkKGVsKS5jbG9uZSh0cnVlKVswXVxuXHRcdFx0OiAoUG9seW1lciAmJiBQb2x5bWVyLmRvbVxuXHRcdFx0XHQ/IFBvbHltZXIuZG9tKGVsKS5jbG9uZU5vZGUodHJ1ZSlcblx0XHRcdFx0OiBlbC5jbG9uZU5vZGUodHJ1ZSlcblx0XHRcdCk7XG5cdH1cblxuXHRmdW5jdGlvbiBfc2F2ZUlucHV0Q2hlY2tlZFN0YXRlKHJvb3QpIHtcblx0XHR2YXIgaW5wdXRzID0gcm9vdC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW5wdXQnKTtcblx0XHR2YXIgaWR4ID0gaW5wdXRzLmxlbmd0aDtcblxuXHRcdHdoaWxlIChpZHgtLSkge1xuXHRcdFx0dmFyIGVsID0gaW5wdXRzW2lkeF07XG5cdFx0XHRlbC5jaGVja2VkICYmIHNhdmVkSW5wdXRDaGVja2VkLnB1c2goZWwpO1xuXHRcdH1cblx0fVxuXG5cdC8vIEZpeGVkICM5NzM6IFxuXHRfb24oZG9jdW1lbnQsICd0b3VjaG1vdmUnLCBmdW5jdGlvbiAoZXZ0KSB7XG5cdFx0aWYgKFNvcnRhYmxlLmFjdGl2ZSkge1xuXHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fVxuXHR9KTtcblxuXHR0cnkge1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0ZXN0JywgbnVsbCwgT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAncGFzc2l2ZScsIHtcblx0XHRcdGdldDogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRjYXB0dXJlTW9kZSA9IHtcblx0XHRcdFx0XHRjYXB0dXJlOiBmYWxzZSxcblx0XHRcdFx0XHRwYXNzaXZlOiBmYWxzZVxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH0pKTtcblx0fSBjYXRjaCAoZXJyKSB7fVxuXG5cdC8vIEV4cG9ydCB1dGlsc1xuXHRTb3J0YWJsZS51dGlscyA9IHtcblx0XHRvbjogX29uLFxuXHRcdG9mZjogX29mZixcblx0XHRjc3M6IF9jc3MsXG5cdFx0ZmluZDogX2ZpbmQsXG5cdFx0aXM6IGZ1bmN0aW9uIChlbCwgc2VsZWN0b3IpIHtcblx0XHRcdHJldHVybiAhIV9jbG9zZXN0KGVsLCBzZWxlY3RvciwgZWwpO1xuXHRcdH0sXG5cdFx0ZXh0ZW5kOiBfZXh0ZW5kLFxuXHRcdHRocm90dGxlOiBfdGhyb3R0bGUsXG5cdFx0Y2xvc2VzdDogX2Nsb3Nlc3QsXG5cdFx0dG9nZ2xlQ2xhc3M6IF90b2dnbGVDbGFzcyxcblx0XHRjbG9uZTogX2Nsb25lLFxuXHRcdGluZGV4OiBfaW5kZXhcblx0fTtcblxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgc29ydGFibGUgaW5zdGFuY2Vcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gIGVsXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSAgICAgIFtvcHRpb25zXVxuXHQgKi9cblx0U29ydGFibGUuY3JlYXRlID0gZnVuY3Rpb24gKGVsLCBvcHRpb25zKSB7XG5cdFx0cmV0dXJuIG5ldyBTb3J0YWJsZShlbCwgb3B0aW9ucyk7XG5cdH07XG5cblxuXHQvLyBFeHBvcnRcblx0U29ydGFibGUudmVyc2lvbiA9ICcxLjYuMSc7XG5cdHJldHVybiBTb3J0YWJsZTtcbn0pO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvc29ydGFibGVqcy9Tb3J0YWJsZS5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvc29ydGFibGVqcy9Tb3J0YWJsZS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJTb3J0YWJsZSA9IHJlcXVpcmUoJ3NvcnRhYmxlanMnKTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBTb3J0YWJsZSByZWdpc3RlclxyXG5cclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbc29ydGFibGU9dHJ1ZV1cIikuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KSB7XHJcbiAgICAgICAgbGV0IHNvcnQgPSBuZXcgU29ydGFibGUoZWxlbWVudCwge1xyXG4gICAgICAgICAgICBkcmFnZ2FibGU6IGVsZW1lbnQuZGF0YXNldC5kcmFnZ2FibGUsXHJcbiAgICAgICAgICAgIG9uRW5kKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGlzdCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5waG90by1jb250YWluZXInKS5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3RbaXRlbS5kYXRhc2V0LnBob3RvSWRdID0gaW5kZXggKyAxO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGV2ZW50LnRhcmdldC5kYXRhc2V0LnNvcnRlZEZpZWxkKS5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS52YWx1ZSA9IEpTT04uc3RyaW5naWZ5KGxpc3QpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9LCB0aGlzKTtcclxuXHJcbn0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3Jlc291cmNlcy9hc3NldHMvanMvYWRtaW4uanMiXSwic291cmNlUm9vdCI6IiJ9