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

"use strict";


var Sortable = __webpack_require__("./node_modules/sortablejs/Sortable.js");

/**
 * Methods
 */

window.admin_photoDeletable = function (deletable) {
    document.querySelectorAll("input.delete-photo").forEach(function (item) {
        deletable ? item.removeAttribute('disabled') : item.setAttribute('disabled', 'disabled');
    });
};
var cmsEvent = new Event('CMS_load');

window.addEventListener('CMS_load', function () {
    // Sortable register

    document.querySelectorAll("[sortable=true]").forEach(function (element) {
        var original_list = {};
        element.querySelectorAll('.photo-container').forEach(function (item, index) {
            original_list[item.dataset.photoId] = index + 1;
        });
        var sort = new Sortable(element, {
            draggable: element.dataset.draggable,
            onEnd: function onEnd(event) {
                var list = {};
                event.target.querySelectorAll('.photo-container').forEach(function (item, index) {
                    list[item.dataset.photoId] = index + 1;
                });
                document.querySelectorAll(event.target.dataset.sortedField).forEach(function (item) {
                    item.value = JSON.stringify([list, original_list]);
                });
            }
        });
    }, this);
});

window.addEventListener('load', function () {
    window.dispatchEvent(cmsEvent);
});

/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./resources/assets/js/admin.js");


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYWFiMTllOWQxOWM3YWU4ZDc1ZGQiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NvcnRhYmxlanMvU29ydGFibGUuanMiLCJ3ZWJwYWNrOi8vLy4vcmVzb3VyY2VzL2Fzc2V0cy9qcy9hZG1pbi5qcyJdLCJuYW1lcyI6WyJTb3J0YWJsZSIsInJlcXVpcmUiLCJ3aW5kb3ciLCJhZG1pbl9waG90b0RlbGV0YWJsZSIsImRlbGV0YWJsZSIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJpdGVtIiwicmVtb3ZlQXR0cmlidXRlIiwic2V0QXR0cmlidXRlIiwiY21zRXZlbnQiLCJFdmVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlbGVtZW50Iiwib3JpZ2luYWxfbGlzdCIsImluZGV4IiwiZGF0YXNldCIsInBob3RvSWQiLCJzb3J0IiwiZHJhZ2dhYmxlIiwib25FbmQiLCJldmVudCIsImxpc3QiLCJ0YXJnZXQiLCJzb3J0ZWRGaWVsZCIsInZhbHVlIiwiSlNPTiIsInN0cmluZ2lmeSIsImRpc3BhdGNoRXZlbnQiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpQkFBaUI7O0FBRWpCO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUI7QUFDckI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsYUFBYSxZQUFZO0FBQ3pCLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQSw0REFBNEQ7QUFDNUQ7O0FBRUEsZUFBZTtBQUNmLHFDQUFxQzs7O0FBR3JDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxXQUFXO0FBQ1g7OztBQUdBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7O0FBR0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTs7QUFFQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBdUI7O0FBRXZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBLG1DQUFtQzs7QUFFbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVCQUF1Qjs7QUFFdkI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUyxPQUFPO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0EsY0FBYyxTQUFTO0FBQ3ZCO0FBQ0E7QUFDQSxpQkFBaUI7O0FBRWpCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQSxlQUFlLFlBQVk7QUFDM0IsZUFBZSxPQUFPO0FBQ3RCLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsRUFBRTtBQUNqQixlQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxVQUFVLE9BQU87QUFDakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7OztBQUlBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBLGVBQWUsa0JBQWtCO0FBQ2pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsY0FBYyxZQUFZO0FBQzFCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxZQUFZO0FBQ3pCLGFBQWEsU0FBUztBQUN0QixhQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0EsZ0VBQWdFO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSxZQUFZLFlBQVk7QUFDeEIsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7QUNsOUNEOztBQUVBLElBQU1BLFdBQVcsbUJBQUFDLENBQVEsdUNBQVIsQ0FBakI7O0FBR0E7Ozs7QUFJQUMsT0FBT0Msb0JBQVAsR0FBOEIsVUFBQ0MsU0FBRCxFQUFlO0FBQ3pDQyxhQUFTQyxnQkFBVCxDQUEwQixvQkFBMUIsRUFBZ0RDLE9BQWhELENBQXdELFVBQUNDLElBQUQsRUFBVTtBQUM3REosaUJBQUQsR0FBY0ksS0FBS0MsZUFBTCxDQUFxQixVQUFyQixDQUFkLEdBQWlERCxLQUFLRSxZQUFMLENBQWtCLFVBQWxCLEVBQThCLFVBQTlCLENBQWpEO0FBQ0gsS0FGRDtBQUdILENBSkQ7QUFLQSxJQUFJQyxXQUFXLElBQUlDLEtBQUosQ0FBVSxVQUFWLENBQWY7O0FBRUFWLE9BQU9XLGdCQUFQLENBQXdCLFVBQXhCLEVBQW9DLFlBQVc7QUFDM0M7O0FBRUFSLGFBQVNDLGdCQUFULENBQTBCLGlCQUExQixFQUE2Q0MsT0FBN0MsQ0FBcUQsVUFBU08sT0FBVCxFQUFrQjtBQUNuRSxZQUFJQyxnQkFBZ0IsRUFBcEI7QUFDQUQsZ0JBQVFSLGdCQUFSLENBQXlCLGtCQUF6QixFQUE2Q0MsT0FBN0MsQ0FBcUQsVUFBQ0MsSUFBRCxFQUFPUSxLQUFQLEVBQWlCO0FBQ2xFRCwwQkFBY1AsS0FBS1MsT0FBTCxDQUFhQyxPQUEzQixJQUFzQ0YsUUFBUSxDQUE5QztBQUNILFNBRkQ7QUFHQSxZQUFJRyxPQUFPLElBQUluQixRQUFKLENBQWFjLE9BQWIsRUFBc0I7QUFDN0JNLHVCQUFXTixRQUFRRyxPQUFSLENBQWdCRyxTQURFO0FBRTdCQyxpQkFGNkIsaUJBRXZCQyxLQUZ1QixFQUVoQjtBQUNULG9CQUFJQyxPQUFPLEVBQVg7QUFDQUQsc0JBQU1FLE1BQU4sQ0FBYWxCLGdCQUFiLENBQThCLGtCQUE5QixFQUFrREMsT0FBbEQsQ0FBMEQsVUFBQ0MsSUFBRCxFQUFPUSxLQUFQLEVBQWlCO0FBQ3ZFTyx5QkFBS2YsS0FBS1MsT0FBTCxDQUFhQyxPQUFsQixJQUE2QkYsUUFBUSxDQUFyQztBQUNILGlCQUZEO0FBR0FYLHlCQUFTQyxnQkFBVCxDQUEwQmdCLE1BQU1FLE1BQU4sQ0FBYVAsT0FBYixDQUFxQlEsV0FBL0MsRUFBNERsQixPQUE1RCxDQUFvRSxVQUFDQyxJQUFELEVBQVU7QUFDMUVBLHlCQUFLa0IsS0FBTCxHQUFhQyxLQUFLQyxTQUFMLENBQWUsQ0FBQ0wsSUFBRCxFQUFPUixhQUFQLENBQWYsQ0FBYjtBQUNILGlCQUZEO0FBR0g7QUFWNEIsU0FBdEIsQ0FBWDtBQVlILEtBakJELEVBaUJHLElBakJIO0FBbUJILENBdEJEOztBQXdCQWIsT0FBT1csZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsWUFBTTtBQUNsQ1gsV0FBTzJCLGFBQVAsQ0FBcUJsQixRQUFyQjtBQUNILENBRkQsRSIsImZpbGUiOiJcXGpzXFxhZG1pbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDEpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGFhYjE5ZTlkMTljN2FlOGQ3NWRkIiwiLyoqIVxuICogU29ydGFibGVcbiAqIEBhdXRob3JcdFJ1YmFYYSAgIDx0cmFzaEBydWJheGEub3JnPlxuICogQGxpY2Vuc2UgTUlUXG4gKi9cblxuKGZ1bmN0aW9uIHNvcnRhYmxlTW9kdWxlKGZhY3RvcnkpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0aWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0ZGVmaW5lKGZhY3RvcnkpO1xuXHR9XG5cdGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdC8qIGpzaGludCBzdWI6dHJ1ZSAqL1xuXHRcdHdpbmRvd1tcIlNvcnRhYmxlXCJdID0gZmFjdG9yeSgpO1xuXHR9XG59KShmdW5jdGlvbiBzb3J0YWJsZUZhY3RvcnkoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGlmICh0eXBlb2Ygd2luZG93ID09IFwidW5kZWZpbmVkXCIgfHwgIXdpbmRvdy5kb2N1bWVudCkge1xuXHRcdHJldHVybiBmdW5jdGlvbiBzb3J0YWJsZUVycm9yKCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiU29ydGFibGUuanMgcmVxdWlyZXMgYSB3aW5kb3cgd2l0aCBhIGRvY3VtZW50XCIpO1xuXHRcdH07XG5cdH1cblxuXHR2YXIgZHJhZ0VsLFxuXHRcdHBhcmVudEVsLFxuXHRcdGdob3N0RWwsXG5cdFx0Y2xvbmVFbCxcblx0XHRyb290RWwsXG5cdFx0bmV4dEVsLFxuXHRcdGxhc3REb3duRWwsXG5cblx0XHRzY3JvbGxFbCxcblx0XHRzY3JvbGxQYXJlbnRFbCxcblx0XHRzY3JvbGxDdXN0b21GbixcblxuXHRcdGxhc3RFbCxcblx0XHRsYXN0Q1NTLFxuXHRcdGxhc3RQYXJlbnRDU1MsXG5cblx0XHRvbGRJbmRleCxcblx0XHRuZXdJbmRleCxcblxuXHRcdGFjdGl2ZUdyb3VwLFxuXHRcdHB1dFNvcnRhYmxlLFxuXG5cdFx0YXV0b1Njcm9sbCA9IHt9LFxuXG5cdFx0dGFwRXZ0LFxuXHRcdHRvdWNoRXZ0LFxuXG5cdFx0bW92ZWQsXG5cblx0XHQvKiogQGNvbnN0ICovXG5cdFx0Ul9TUEFDRSA9IC9cXHMrL2csXG5cdFx0Ul9GTE9BVCA9IC9sZWZ0fHJpZ2h0fGlubGluZS8sXG5cblx0XHRleHBhbmRvID0gJ1NvcnRhYmxlJyArIChuZXcgRGF0ZSkuZ2V0VGltZSgpLFxuXG5cdFx0d2luID0gd2luZG93LFxuXHRcdGRvY3VtZW50ID0gd2luLmRvY3VtZW50LFxuXHRcdHBhcnNlSW50ID0gd2luLnBhcnNlSW50LFxuXG5cdFx0JCA9IHdpbi5qUXVlcnkgfHwgd2luLlplcHRvLFxuXHRcdFBvbHltZXIgPSB3aW4uUG9seW1lcixcblxuXHRcdGNhcHR1cmVNb2RlID0gZmFsc2UsXG5cblx0XHRzdXBwb3J0RHJhZ2dhYmxlID0gISEoJ2RyYWdnYWJsZScgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpLFxuXHRcdHN1cHBvcnRDc3NQb2ludGVyRXZlbnRzID0gKGZ1bmN0aW9uIChlbCkge1xuXHRcdFx0Ly8gZmFsc2Ugd2hlbiBJRTExXG5cdFx0XHRpZiAoISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9UcmlkZW50LipydlsgOl0/MTFcXC4vKSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3gnKTtcblx0XHRcdGVsLnN0eWxlLmNzc1RleHQgPSAncG9pbnRlci1ldmVudHM6YXV0byc7XG5cdFx0XHRyZXR1cm4gZWwuc3R5bGUucG9pbnRlckV2ZW50cyA9PT0gJ2F1dG8nO1xuXHRcdH0pKCksXG5cblx0XHRfc2lsZW50ID0gZmFsc2UsXG5cblx0XHRhYnMgPSBNYXRoLmFicyxcblx0XHRtaW4gPSBNYXRoLm1pbixcblxuXHRcdHNhdmVkSW5wdXRDaGVja2VkID0gW10sXG5cdFx0dG91Y2hEcmFnT3Zlckxpc3RlbmVycyA9IFtdLFxuXG5cdFx0X2F1dG9TY3JvbGwgPSBfdGhyb3R0bGUoZnVuY3Rpb24gKC8qKkV2ZW50Ki9ldnQsIC8qKk9iamVjdCovb3B0aW9ucywgLyoqSFRNTEVsZW1lbnQqL3Jvb3RFbCkge1xuXHRcdFx0Ly8gQnVnOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD01MDU1MjFcblx0XHRcdGlmIChyb290RWwgJiYgb3B0aW9ucy5zY3JvbGwpIHtcblx0XHRcdFx0dmFyIF90aGlzID0gcm9vdEVsW2V4cGFuZG9dLFxuXHRcdFx0XHRcdGVsLFxuXHRcdFx0XHRcdHJlY3QsXG5cdFx0XHRcdFx0c2VucyA9IG9wdGlvbnMuc2Nyb2xsU2Vuc2l0aXZpdHksXG5cdFx0XHRcdFx0c3BlZWQgPSBvcHRpb25zLnNjcm9sbFNwZWVkLFxuXG5cdFx0XHRcdFx0eCA9IGV2dC5jbGllbnRYLFxuXHRcdFx0XHRcdHkgPSBldnQuY2xpZW50WSxcblxuXHRcdFx0XHRcdHdpbldpZHRoID0gd2luZG93LmlubmVyV2lkdGgsXG5cdFx0XHRcdFx0d2luSGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0LFxuXG5cdFx0XHRcdFx0dngsXG5cdFx0XHRcdFx0dnksXG5cblx0XHRcdFx0XHRzY3JvbGxPZmZzZXRYLFxuXHRcdFx0XHRcdHNjcm9sbE9mZnNldFlcblx0XHRcdFx0O1xuXG5cdFx0XHRcdC8vIERlbGVjdCBzY3JvbGxFbFxuXHRcdFx0XHRpZiAoc2Nyb2xsUGFyZW50RWwgIT09IHJvb3RFbCkge1xuXHRcdFx0XHRcdHNjcm9sbEVsID0gb3B0aW9ucy5zY3JvbGw7XG5cdFx0XHRcdFx0c2Nyb2xsUGFyZW50RWwgPSByb290RWw7XG5cdFx0XHRcdFx0c2Nyb2xsQ3VzdG9tRm4gPSBvcHRpb25zLnNjcm9sbEZuO1xuXG5cdFx0XHRcdFx0aWYgKHNjcm9sbEVsID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRzY3JvbGxFbCA9IHJvb3RFbDtcblxuXHRcdFx0XHRcdFx0ZG8ge1xuXHRcdFx0XHRcdFx0XHRpZiAoKHNjcm9sbEVsLm9mZnNldFdpZHRoIDwgc2Nyb2xsRWwuc2Nyb2xsV2lkdGgpIHx8XG5cdFx0XHRcdFx0XHRcdFx0KHNjcm9sbEVsLm9mZnNldEhlaWdodCA8IHNjcm9sbEVsLnNjcm9sbEhlaWdodClcblx0XHRcdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0LyoganNoaW50IGJvc3M6dHJ1ZSAqL1xuXHRcdFx0XHRcdFx0fSB3aGlsZSAoc2Nyb2xsRWwgPSBzY3JvbGxFbC5wYXJlbnROb2RlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoc2Nyb2xsRWwpIHtcblx0XHRcdFx0XHRlbCA9IHNjcm9sbEVsO1xuXHRcdFx0XHRcdHJlY3QgPSBzY3JvbGxFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHRcdFx0XHR2eCA9IChhYnMocmVjdC5yaWdodCAtIHgpIDw9IHNlbnMpIC0gKGFicyhyZWN0LmxlZnQgLSB4KSA8PSBzZW5zKTtcblx0XHRcdFx0XHR2eSA9IChhYnMocmVjdC5ib3R0b20gLSB5KSA8PSBzZW5zKSAtIChhYnMocmVjdC50b3AgLSB5KSA8PSBzZW5zKTtcblx0XHRcdFx0fVxuXG5cblx0XHRcdFx0aWYgKCEodnggfHwgdnkpKSB7XG5cdFx0XHRcdFx0dnggPSAod2luV2lkdGggLSB4IDw9IHNlbnMpIC0gKHggPD0gc2Vucyk7XG5cdFx0XHRcdFx0dnkgPSAod2luSGVpZ2h0IC0geSA8PSBzZW5zKSAtICh5IDw9IHNlbnMpO1xuXG5cdFx0XHRcdFx0LyoganNoaW50IGV4cHI6dHJ1ZSAqL1xuXHRcdFx0XHRcdCh2eCB8fCB2eSkgJiYgKGVsID0gd2luKTtcblx0XHRcdFx0fVxuXG5cblx0XHRcdFx0aWYgKGF1dG9TY3JvbGwudnggIT09IHZ4IHx8IGF1dG9TY3JvbGwudnkgIT09IHZ5IHx8IGF1dG9TY3JvbGwuZWwgIT09IGVsKSB7XG5cdFx0XHRcdFx0YXV0b1Njcm9sbC5lbCA9IGVsO1xuXHRcdFx0XHRcdGF1dG9TY3JvbGwudnggPSB2eDtcblx0XHRcdFx0XHRhdXRvU2Nyb2xsLnZ5ID0gdnk7XG5cblx0XHRcdFx0XHRjbGVhckludGVydmFsKGF1dG9TY3JvbGwucGlkKTtcblxuXHRcdFx0XHRcdGlmIChlbCkge1xuXHRcdFx0XHRcdFx0YXV0b1Njcm9sbC5waWQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdHNjcm9sbE9mZnNldFkgPSB2eSA/IHZ5ICogc3BlZWQgOiAwO1xuXHRcdFx0XHRcdFx0XHRzY3JvbGxPZmZzZXRYID0gdnggPyB2eCAqIHNwZWVkIDogMDtcblxuXHRcdFx0XHRcdFx0XHRpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mKHNjcm9sbEN1c3RvbUZuKSkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBzY3JvbGxDdXN0b21Gbi5jYWxsKF90aGlzLCBzY3JvbGxPZmZzZXRYLCBzY3JvbGxPZmZzZXRZLCBldnQpO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0aWYgKGVsID09PSB3aW4pIHtcblx0XHRcdFx0XHRcdFx0XHR3aW4uc2Nyb2xsVG8od2luLnBhZ2VYT2Zmc2V0ICsgc2Nyb2xsT2Zmc2V0WCwgd2luLnBhZ2VZT2Zmc2V0ICsgc2Nyb2xsT2Zmc2V0WSk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0ZWwuc2Nyb2xsVG9wICs9IHNjcm9sbE9mZnNldFk7XG5cdFx0XHRcdFx0XHRcdFx0ZWwuc2Nyb2xsTGVmdCArPSBzY3JvbGxPZmZzZXRYO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LCAyNCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSwgMzApLFxuXG5cdFx0X3ByZXBhcmVHcm91cCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cdFx0XHRmdW5jdGlvbiB0b0ZuKHZhbHVlLCBwdWxsKSB7XG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gdm9pZCAwIHx8IHZhbHVlID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBncm91cC5uYW1lO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHRvLCBmcm9tKSB7XG5cdFx0XHRcdFx0XHR2YXIgZnJvbUdyb3VwID0gZnJvbS5vcHRpb25zLmdyb3VwLm5hbWU7XG5cblx0XHRcdFx0XHRcdHJldHVybiBwdWxsXG5cdFx0XHRcdFx0XHRcdD8gdmFsdWVcblx0XHRcdFx0XHRcdFx0OiB2YWx1ZSAmJiAodmFsdWUuam9pblxuXHRcdFx0XHRcdFx0XHRcdD8gdmFsdWUuaW5kZXhPZihmcm9tR3JvdXApID4gLTFcblx0XHRcdFx0XHRcdFx0XHQ6IChmcm9tR3JvdXAgPT0gdmFsdWUpXG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR2YXIgZ3JvdXAgPSB7fTtcblx0XHRcdHZhciBvcmlnaW5hbEdyb3VwID0gb3B0aW9ucy5ncm91cDtcblxuXHRcdFx0aWYgKCFvcmlnaW5hbEdyb3VwIHx8IHR5cGVvZiBvcmlnaW5hbEdyb3VwICE9ICdvYmplY3QnKSB7XG5cdFx0XHRcdG9yaWdpbmFsR3JvdXAgPSB7bmFtZTogb3JpZ2luYWxHcm91cH07XG5cdFx0XHR9XG5cblx0XHRcdGdyb3VwLm5hbWUgPSBvcmlnaW5hbEdyb3VwLm5hbWU7XG5cdFx0XHRncm91cC5jaGVja1B1bGwgPSB0b0ZuKG9yaWdpbmFsR3JvdXAucHVsbCwgdHJ1ZSk7XG5cdFx0XHRncm91cC5jaGVja1B1dCA9IHRvRm4ob3JpZ2luYWxHcm91cC5wdXQpO1xuXHRcdFx0Z3JvdXAucmV2ZXJ0Q2xvbmUgPSBvcmlnaW5hbEdyb3VwLnJldmVydENsb25lO1xuXG5cdFx0XHRvcHRpb25zLmdyb3VwID0gZ3JvdXA7XG5cdFx0fVxuXHQ7XG5cblxuXHQvKipcblx0ICogQGNsYXNzICBTb3J0YWJsZVxuXHQgKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gIGVsXG5cdCAqIEBwYXJhbSAge09iamVjdH0gICAgICAgW29wdGlvbnNdXG5cdCAqL1xuXHRmdW5jdGlvbiBTb3J0YWJsZShlbCwgb3B0aW9ucykge1xuXHRcdGlmICghKGVsICYmIGVsLm5vZGVUeXBlICYmIGVsLm5vZGVUeXBlID09PSAxKSkge1xuXHRcdFx0dGhyb3cgJ1NvcnRhYmxlOiBgZWxgIG11c3QgYmUgSFRNTEVsZW1lbnQsIGFuZCBub3QgJyArIHt9LnRvU3RyaW5nLmNhbGwoZWwpO1xuXHRcdH1cblxuXHRcdHRoaXMuZWwgPSBlbDsgLy8gcm9vdCBlbGVtZW50XG5cdFx0dGhpcy5vcHRpb25zID0gb3B0aW9ucyA9IF9leHRlbmQoe30sIG9wdGlvbnMpO1xuXG5cblx0XHQvLyBFeHBvcnQgaW5zdGFuY2Vcblx0XHRlbFtleHBhbmRvXSA9IHRoaXM7XG5cblx0XHQvLyBEZWZhdWx0IG9wdGlvbnNcblx0XHR2YXIgZGVmYXVsdHMgPSB7XG5cdFx0XHRncm91cDogTWF0aC5yYW5kb20oKSxcblx0XHRcdHNvcnQ6IHRydWUsXG5cdFx0XHRkaXNhYmxlZDogZmFsc2UsXG5cdFx0XHRzdG9yZTogbnVsbCxcblx0XHRcdGhhbmRsZTogbnVsbCxcblx0XHRcdHNjcm9sbDogdHJ1ZSxcblx0XHRcdHNjcm9sbFNlbnNpdGl2aXR5OiAzMCxcblx0XHRcdHNjcm9sbFNwZWVkOiAxMCxcblx0XHRcdGRyYWdnYWJsZTogL1t1b11sL2kudGVzdChlbC5ub2RlTmFtZSkgPyAnbGknIDogJz4qJyxcblx0XHRcdGdob3N0Q2xhc3M6ICdzb3J0YWJsZS1naG9zdCcsXG5cdFx0XHRjaG9zZW5DbGFzczogJ3NvcnRhYmxlLWNob3NlbicsXG5cdFx0XHRkcmFnQ2xhc3M6ICdzb3J0YWJsZS1kcmFnJyxcblx0XHRcdGlnbm9yZTogJ2EsIGltZycsXG5cdFx0XHRmaWx0ZXI6IG51bGwsXG5cdFx0XHRwcmV2ZW50T25GaWx0ZXI6IHRydWUsXG5cdFx0XHRhbmltYXRpb246IDAsXG5cdFx0XHRzZXREYXRhOiBmdW5jdGlvbiAoZGF0YVRyYW5zZmVyLCBkcmFnRWwpIHtcblx0XHRcdFx0ZGF0YVRyYW5zZmVyLnNldERhdGEoJ1RleHQnLCBkcmFnRWwudGV4dENvbnRlbnQpO1xuXHRcdFx0fSxcblx0XHRcdGRyb3BCdWJibGU6IGZhbHNlLFxuXHRcdFx0ZHJhZ292ZXJCdWJibGU6IGZhbHNlLFxuXHRcdFx0ZGF0YUlkQXR0cjogJ2RhdGEtaWQnLFxuXHRcdFx0ZGVsYXk6IDAsXG5cdFx0XHRmb3JjZUZhbGxiYWNrOiBmYWxzZSxcblx0XHRcdGZhbGxiYWNrQ2xhc3M6ICdzb3J0YWJsZS1mYWxsYmFjaycsXG5cdFx0XHRmYWxsYmFja09uQm9keTogZmFsc2UsXG5cdFx0XHRmYWxsYmFja1RvbGVyYW5jZTogMCxcblx0XHRcdGZhbGxiYWNrT2Zmc2V0OiB7eDogMCwgeTogMH1cblx0XHR9O1xuXG5cblx0XHQvLyBTZXQgZGVmYXVsdCBvcHRpb25zXG5cdFx0Zm9yICh2YXIgbmFtZSBpbiBkZWZhdWx0cykge1xuXHRcdFx0IShuYW1lIGluIG9wdGlvbnMpICYmIChvcHRpb25zW25hbWVdID0gZGVmYXVsdHNbbmFtZV0pO1xuXHRcdH1cblxuXHRcdF9wcmVwYXJlR3JvdXAob3B0aW9ucyk7XG5cblx0XHQvLyBCaW5kIGFsbCBwcml2YXRlIG1ldGhvZHNcblx0XHRmb3IgKHZhciBmbiBpbiB0aGlzKSB7XG5cdFx0XHRpZiAoZm4uY2hhckF0KDApID09PSAnXycgJiYgdHlwZW9mIHRoaXNbZm5dID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdHRoaXNbZm5dID0gdGhpc1tmbl0uYmluZCh0aGlzKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBTZXR1cCBkcmFnIG1vZGVcblx0XHR0aGlzLm5hdGl2ZURyYWdnYWJsZSA9IG9wdGlvbnMuZm9yY2VGYWxsYmFjayA/IGZhbHNlIDogc3VwcG9ydERyYWdnYWJsZTtcblxuXHRcdC8vIEJpbmQgZXZlbnRzXG5cdFx0X29uKGVsLCAnbW91c2Vkb3duJywgdGhpcy5fb25UYXBTdGFydCk7XG5cdFx0X29uKGVsLCAndG91Y2hzdGFydCcsIHRoaXMuX29uVGFwU3RhcnQpO1xuXHRcdF9vbihlbCwgJ3BvaW50ZXJkb3duJywgdGhpcy5fb25UYXBTdGFydCk7XG5cblx0XHRpZiAodGhpcy5uYXRpdmVEcmFnZ2FibGUpIHtcblx0XHRcdF9vbihlbCwgJ2RyYWdvdmVyJywgdGhpcyk7XG5cdFx0XHRfb24oZWwsICdkcmFnZW50ZXInLCB0aGlzKTtcblx0XHR9XG5cblx0XHR0b3VjaERyYWdPdmVyTGlzdGVuZXJzLnB1c2godGhpcy5fb25EcmFnT3Zlcik7XG5cblx0XHQvLyBSZXN0b3JlIHNvcnRpbmdcblx0XHRvcHRpb25zLnN0b3JlICYmIHRoaXMuc29ydChvcHRpb25zLnN0b3JlLmdldCh0aGlzKSk7XG5cdH1cblxuXG5cdFNvcnRhYmxlLnByb3RvdHlwZSA9IC8qKiBAbGVuZHMgU29ydGFibGUucHJvdG90eXBlICovIHtcblx0XHRjb25zdHJ1Y3RvcjogU29ydGFibGUsXG5cblx0XHRfb25UYXBTdGFydDogZnVuY3Rpb24gKC8qKiBFdmVudHxUb3VjaEV2ZW50ICovZXZ0KSB7XG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzLFxuXHRcdFx0XHRlbCA9IHRoaXMuZWwsXG5cdFx0XHRcdG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG5cdFx0XHRcdHByZXZlbnRPbkZpbHRlciA9IG9wdGlvbnMucHJldmVudE9uRmlsdGVyLFxuXHRcdFx0XHR0eXBlID0gZXZ0LnR5cGUsXG5cdFx0XHRcdHRvdWNoID0gZXZ0LnRvdWNoZXMgJiYgZXZ0LnRvdWNoZXNbMF0sXG5cdFx0XHRcdHRhcmdldCA9ICh0b3VjaCB8fCBldnQpLnRhcmdldCxcblx0XHRcdFx0b3JpZ2luYWxUYXJnZXQgPSBldnQudGFyZ2V0LnNoYWRvd1Jvb3QgJiYgKGV2dC5wYXRoICYmIGV2dC5wYXRoWzBdKSB8fCB0YXJnZXQsXG5cdFx0XHRcdGZpbHRlciA9IG9wdGlvbnMuZmlsdGVyLFxuXHRcdFx0XHRzdGFydEluZGV4O1xuXG5cdFx0XHRfc2F2ZUlucHV0Q2hlY2tlZFN0YXRlKGVsKTtcblxuXG5cdFx0XHQvLyBEb24ndCB0cmlnZ2VyIHN0YXJ0IGV2ZW50IHdoZW4gYW4gZWxlbWVudCBpcyBiZWVuIGRyYWdnZWQsIG90aGVyd2lzZSB0aGUgZXZ0Lm9sZGluZGV4IGFsd2F5cyB3cm9uZyB3aGVuIHNldCBvcHRpb24uZ3JvdXAuXG5cdFx0XHRpZiAoZHJhZ0VsKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKC9tb3VzZWRvd258cG9pbnRlcmRvd24vLnRlc3QodHlwZSkgJiYgZXZ0LmJ1dHRvbiAhPT0gMCB8fCBvcHRpb25zLmRpc2FibGVkKSB7XG5cdFx0XHRcdHJldHVybjsgLy8gb25seSBsZWZ0IGJ1dHRvbiBvciBlbmFibGVkXG5cdFx0XHR9XG5cblxuXHRcdFx0dGFyZ2V0ID0gX2Nsb3Nlc3QodGFyZ2V0LCBvcHRpb25zLmRyYWdnYWJsZSwgZWwpO1xuXG5cdFx0XHRpZiAoIXRhcmdldCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmIChsYXN0RG93bkVsID09PSB0YXJnZXQpIHtcblx0XHRcdFx0Ly8gSWdub3JpbmcgZHVwbGljYXRlIGBkb3duYFxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIEdldCB0aGUgaW5kZXggb2YgdGhlIGRyYWdnZWQgZWxlbWVudCB3aXRoaW4gaXRzIHBhcmVudFxuXHRcdFx0c3RhcnRJbmRleCA9IF9pbmRleCh0YXJnZXQsIG9wdGlvbnMuZHJhZ2dhYmxlKTtcblxuXHRcdFx0Ly8gQ2hlY2sgZmlsdGVyXG5cdFx0XHRpZiAodHlwZW9mIGZpbHRlciA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRpZiAoZmlsdGVyLmNhbGwodGhpcywgZXZ0LCB0YXJnZXQsIHRoaXMpKSB7XG5cdFx0XHRcdFx0X2Rpc3BhdGNoRXZlbnQoX3RoaXMsIG9yaWdpbmFsVGFyZ2V0LCAnZmlsdGVyJywgdGFyZ2V0LCBlbCwgc3RhcnRJbmRleCk7XG5cdFx0XHRcdFx0cHJldmVudE9uRmlsdGVyICYmIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdHJldHVybjsgLy8gY2FuY2VsIGRuZFxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChmaWx0ZXIpIHtcblx0XHRcdFx0ZmlsdGVyID0gZmlsdGVyLnNwbGl0KCcsJykuc29tZShmdW5jdGlvbiAoY3JpdGVyaWEpIHtcblx0XHRcdFx0XHRjcml0ZXJpYSA9IF9jbG9zZXN0KG9yaWdpbmFsVGFyZ2V0LCBjcml0ZXJpYS50cmltKCksIGVsKTtcblxuXHRcdFx0XHRcdGlmIChjcml0ZXJpYSkge1xuXHRcdFx0XHRcdFx0X2Rpc3BhdGNoRXZlbnQoX3RoaXMsIGNyaXRlcmlhLCAnZmlsdGVyJywgdGFyZ2V0LCBlbCwgc3RhcnRJbmRleCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGlmIChmaWx0ZXIpIHtcblx0XHRcdFx0XHRwcmV2ZW50T25GaWx0ZXIgJiYgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0cmV0dXJuOyAvLyBjYW5jZWwgZG5kXG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKG9wdGlvbnMuaGFuZGxlICYmICFfY2xvc2VzdChvcmlnaW5hbFRhcmdldCwgb3B0aW9ucy5oYW5kbGUsIGVsKSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFByZXBhcmUgYGRyYWdzdGFydGBcblx0XHRcdHRoaXMuX3ByZXBhcmVEcmFnU3RhcnQoZXZ0LCB0b3VjaCwgdGFyZ2V0LCBzdGFydEluZGV4KTtcblx0XHR9LFxuXG5cdFx0X3ByZXBhcmVEcmFnU3RhcnQ6IGZ1bmN0aW9uICgvKiogRXZlbnQgKi9ldnQsIC8qKiBUb3VjaCAqL3RvdWNoLCAvKiogSFRNTEVsZW1lbnQgKi90YXJnZXQsIC8qKiBOdW1iZXIgKi9zdGFydEluZGV4KSB7XG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzLFxuXHRcdFx0XHRlbCA9IF90aGlzLmVsLFxuXHRcdFx0XHRvcHRpb25zID0gX3RoaXMub3B0aW9ucyxcblx0XHRcdFx0b3duZXJEb2N1bWVudCA9IGVsLm93bmVyRG9jdW1lbnQsXG5cdFx0XHRcdGRyYWdTdGFydEZuO1xuXG5cdFx0XHRpZiAodGFyZ2V0ICYmICFkcmFnRWwgJiYgKHRhcmdldC5wYXJlbnROb2RlID09PSBlbCkpIHtcblx0XHRcdFx0dGFwRXZ0ID0gZXZ0O1xuXG5cdFx0XHRcdHJvb3RFbCA9IGVsO1xuXHRcdFx0XHRkcmFnRWwgPSB0YXJnZXQ7XG5cdFx0XHRcdHBhcmVudEVsID0gZHJhZ0VsLnBhcmVudE5vZGU7XG5cdFx0XHRcdG5leHRFbCA9IGRyYWdFbC5uZXh0U2libGluZztcblx0XHRcdFx0bGFzdERvd25FbCA9IHRhcmdldDtcblx0XHRcdFx0YWN0aXZlR3JvdXAgPSBvcHRpb25zLmdyb3VwO1xuXHRcdFx0XHRvbGRJbmRleCA9IHN0YXJ0SW5kZXg7XG5cblx0XHRcdFx0dGhpcy5fbGFzdFggPSAodG91Y2ggfHwgZXZ0KS5jbGllbnRYO1xuXHRcdFx0XHR0aGlzLl9sYXN0WSA9ICh0b3VjaCB8fCBldnQpLmNsaWVudFk7XG5cblx0XHRcdFx0ZHJhZ0VsLnN0eWxlWyd3aWxsLWNoYW5nZSddID0gJ3RyYW5zZm9ybSc7XG5cblx0XHRcdFx0ZHJhZ1N0YXJ0Rm4gPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0Ly8gRGVsYXllZCBkcmFnIGhhcyBiZWVuIHRyaWdnZXJlZFxuXHRcdFx0XHRcdC8vIHdlIGNhbiByZS1lbmFibGUgdGhlIGV2ZW50czogdG91Y2htb3ZlL21vdXNlbW92ZVxuXHRcdFx0XHRcdF90aGlzLl9kaXNhYmxlRGVsYXllZERyYWcoKTtcblxuXHRcdFx0XHRcdC8vIE1ha2UgdGhlIGVsZW1lbnQgZHJhZ2dhYmxlXG5cdFx0XHRcdFx0ZHJhZ0VsLmRyYWdnYWJsZSA9IF90aGlzLm5hdGl2ZURyYWdnYWJsZTtcblxuXHRcdFx0XHRcdC8vIENob3NlbiBpdGVtXG5cdFx0XHRcdFx0X3RvZ2dsZUNsYXNzKGRyYWdFbCwgb3B0aW9ucy5jaG9zZW5DbGFzcywgdHJ1ZSk7XG5cblx0XHRcdFx0XHQvLyBCaW5kIHRoZSBldmVudHM6IGRyYWdzdGFydC9kcmFnZW5kXG5cdFx0XHRcdFx0X3RoaXMuX3RyaWdnZXJEcmFnU3RhcnQoZXZ0LCB0b3VjaCk7XG5cblx0XHRcdFx0XHQvLyBEcmFnIHN0YXJ0IGV2ZW50XG5cdFx0XHRcdFx0X2Rpc3BhdGNoRXZlbnQoX3RoaXMsIHJvb3RFbCwgJ2Nob29zZScsIGRyYWdFbCwgcm9vdEVsLCBvbGRJbmRleCk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Ly8gRGlzYWJsZSBcImRyYWdnYWJsZVwiXG5cdFx0XHRcdG9wdGlvbnMuaWdub3JlLnNwbGl0KCcsJykuZm9yRWFjaChmdW5jdGlvbiAoY3JpdGVyaWEpIHtcblx0XHRcdFx0XHRfZmluZChkcmFnRWwsIGNyaXRlcmlhLnRyaW0oKSwgX2Rpc2FibGVEcmFnZ2FibGUpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRfb24ob3duZXJEb2N1bWVudCwgJ21vdXNldXAnLCBfdGhpcy5fb25Ecm9wKTtcblx0XHRcdFx0X29uKG93bmVyRG9jdW1lbnQsICd0b3VjaGVuZCcsIF90aGlzLl9vbkRyb3ApO1xuXHRcdFx0XHRfb24ob3duZXJEb2N1bWVudCwgJ3RvdWNoY2FuY2VsJywgX3RoaXMuX29uRHJvcCk7XG5cdFx0XHRcdF9vbihvd25lckRvY3VtZW50LCAncG9pbnRlcmNhbmNlbCcsIF90aGlzLl9vbkRyb3ApO1xuXHRcdFx0XHRfb24ob3duZXJEb2N1bWVudCwgJ3NlbGVjdHN0YXJ0JywgX3RoaXMpO1xuXG5cdFx0XHRcdGlmIChvcHRpb25zLmRlbGF5KSB7XG5cdFx0XHRcdFx0Ly8gSWYgdGhlIHVzZXIgbW92ZXMgdGhlIHBvaW50ZXIgb3IgbGV0IGdvIHRoZSBjbGljayBvciB0b3VjaFxuXHRcdFx0XHRcdC8vIGJlZm9yZSB0aGUgZGVsYXkgaGFzIGJlZW4gcmVhY2hlZDpcblx0XHRcdFx0XHQvLyBkaXNhYmxlIHRoZSBkZWxheWVkIGRyYWdcblx0XHRcdFx0XHRfb24ob3duZXJEb2N1bWVudCwgJ21vdXNldXAnLCBfdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnKTtcblx0XHRcdFx0XHRfb24ob3duZXJEb2N1bWVudCwgJ3RvdWNoZW5kJywgX3RoaXMuX2Rpc2FibGVEZWxheWVkRHJhZyk7XG5cdFx0XHRcdFx0X29uKG93bmVyRG9jdW1lbnQsICd0b3VjaGNhbmNlbCcsIF90aGlzLl9kaXNhYmxlRGVsYXllZERyYWcpO1xuXHRcdFx0XHRcdF9vbihvd25lckRvY3VtZW50LCAnbW91c2Vtb3ZlJywgX3RoaXMuX2Rpc2FibGVEZWxheWVkRHJhZyk7XG5cdFx0XHRcdFx0X29uKG93bmVyRG9jdW1lbnQsICd0b3VjaG1vdmUnLCBfdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnKTtcblx0XHRcdFx0XHRfb24ob3duZXJEb2N1bWVudCwgJ3BvaW50ZXJtb3ZlJywgX3RoaXMuX2Rpc2FibGVEZWxheWVkRHJhZyk7XG5cblx0XHRcdFx0XHRfdGhpcy5fZHJhZ1N0YXJ0VGltZXIgPSBzZXRUaW1lb3V0KGRyYWdTdGFydEZuLCBvcHRpb25zLmRlbGF5KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRkcmFnU3RhcnRGbigpO1xuXHRcdFx0XHR9XG5cblxuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRfZGlzYWJsZURlbGF5ZWREcmFnOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgb3duZXJEb2N1bWVudCA9IHRoaXMuZWwub3duZXJEb2N1bWVudDtcblxuXHRcdFx0Y2xlYXJUaW1lb3V0KHRoaXMuX2RyYWdTdGFydFRpbWVyKTtcblx0XHRcdF9vZmYob3duZXJEb2N1bWVudCwgJ21vdXNldXAnLCB0aGlzLl9kaXNhYmxlRGVsYXllZERyYWcpO1xuXHRcdFx0X29mZihvd25lckRvY3VtZW50LCAndG91Y2hlbmQnLCB0aGlzLl9kaXNhYmxlRGVsYXllZERyYWcpO1xuXHRcdFx0X29mZihvd25lckRvY3VtZW50LCAndG91Y2hjYW5jZWwnLCB0aGlzLl9kaXNhYmxlRGVsYXllZERyYWcpO1xuXHRcdFx0X29mZihvd25lckRvY3VtZW50LCAnbW91c2Vtb3ZlJywgdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnKTtcblx0XHRcdF9vZmYob3duZXJEb2N1bWVudCwgJ3RvdWNobW92ZScsIHRoaXMuX2Rpc2FibGVEZWxheWVkRHJhZyk7XG5cdFx0XHRfb2ZmKG93bmVyRG9jdW1lbnQsICdwb2ludGVybW92ZScsIHRoaXMuX2Rpc2FibGVEZWxheWVkRHJhZyk7XG5cdFx0fSxcblxuXHRcdF90cmlnZ2VyRHJhZ1N0YXJ0OiBmdW5jdGlvbiAoLyoqIEV2ZW50ICovZXZ0LCAvKiogVG91Y2ggKi90b3VjaCkge1xuXHRcdFx0dG91Y2ggPSB0b3VjaCB8fCAoZXZ0LnBvaW50ZXJUeXBlID09ICd0b3VjaCcgPyBldnQgOiBudWxsKTtcblxuXHRcdFx0aWYgKHRvdWNoKSB7XG5cdFx0XHRcdC8vIFRvdWNoIGRldmljZSBzdXBwb3J0XG5cdFx0XHRcdHRhcEV2dCA9IHtcblx0XHRcdFx0XHR0YXJnZXQ6IGRyYWdFbCxcblx0XHRcdFx0XHRjbGllbnRYOiB0b3VjaC5jbGllbnRYLFxuXHRcdFx0XHRcdGNsaWVudFk6IHRvdWNoLmNsaWVudFlcblx0XHRcdFx0fTtcblxuXHRcdFx0XHR0aGlzLl9vbkRyYWdTdGFydCh0YXBFdnQsICd0b3VjaCcpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoIXRoaXMubmF0aXZlRHJhZ2dhYmxlKSB7XG5cdFx0XHRcdHRoaXMuX29uRHJhZ1N0YXJ0KHRhcEV2dCwgdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0X29uKGRyYWdFbCwgJ2RyYWdlbmQnLCB0aGlzKTtcblx0XHRcdFx0X29uKHJvb3RFbCwgJ2RyYWdzdGFydCcsIHRoaXMuX29uRHJhZ1N0YXJ0KTtcblx0XHRcdH1cblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aWYgKGRvY3VtZW50LnNlbGVjdGlvbikge1xuXHRcdFx0XHRcdC8vIFRpbWVvdXQgbmVjY2Vzc2FyeSBmb3IgSUU5XG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRkb2N1bWVudC5zZWxlY3Rpb24uZW1wdHkoKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRfZHJhZ1N0YXJ0ZWQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmIChyb290RWwgJiYgZHJhZ0VsKSB7XG5cdFx0XHRcdHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG5cdFx0XHRcdC8vIEFwcGx5IGVmZmVjdFxuXHRcdFx0XHRfdG9nZ2xlQ2xhc3MoZHJhZ0VsLCBvcHRpb25zLmdob3N0Q2xhc3MsIHRydWUpO1xuXHRcdFx0XHRfdG9nZ2xlQ2xhc3MoZHJhZ0VsLCBvcHRpb25zLmRyYWdDbGFzcywgZmFsc2UpO1xuXG5cdFx0XHRcdFNvcnRhYmxlLmFjdGl2ZSA9IHRoaXM7XG5cblx0XHRcdFx0Ly8gRHJhZyBzdGFydCBldmVudFxuXHRcdFx0XHRfZGlzcGF0Y2hFdmVudCh0aGlzLCByb290RWwsICdzdGFydCcsIGRyYWdFbCwgcm9vdEVsLCBvbGRJbmRleCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLl9udWxsaW5nKCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdF9lbXVsYXRlRHJhZ092ZXI6IGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICh0b3VjaEV2dCkge1xuXHRcdFx0XHRpZiAodGhpcy5fbGFzdFggPT09IHRvdWNoRXZ0LmNsaWVudFggJiYgdGhpcy5fbGFzdFkgPT09IHRvdWNoRXZ0LmNsaWVudFkpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLl9sYXN0WCA9IHRvdWNoRXZ0LmNsaWVudFg7XG5cdFx0XHRcdHRoaXMuX2xhc3RZID0gdG91Y2hFdnQuY2xpZW50WTtcblxuXHRcdFx0XHRpZiAoIXN1cHBvcnRDc3NQb2ludGVyRXZlbnRzKSB7XG5cdFx0XHRcdFx0X2NzcyhnaG9zdEVsLCAnZGlzcGxheScsICdub25lJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgdGFyZ2V0ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludCh0b3VjaEV2dC5jbGllbnRYLCB0b3VjaEV2dC5jbGllbnRZKSxcblx0XHRcdFx0XHRwYXJlbnQgPSB0YXJnZXQsXG5cdFx0XHRcdFx0aSA9IHRvdWNoRHJhZ092ZXJMaXN0ZW5lcnMubGVuZ3RoO1xuXG5cdFx0XHRcdGlmIChwYXJlbnQpIHtcblx0XHRcdFx0XHRkbyB7XG5cdFx0XHRcdFx0XHRpZiAocGFyZW50W2V4cGFuZG9dKSB7XG5cdFx0XHRcdFx0XHRcdHdoaWxlIChpLS0pIHtcblx0XHRcdFx0XHRcdFx0XHR0b3VjaERyYWdPdmVyTGlzdGVuZXJzW2ldKHtcblx0XHRcdFx0XHRcdFx0XHRcdGNsaWVudFg6IHRvdWNoRXZ0LmNsaWVudFgsXG5cdFx0XHRcdFx0XHRcdFx0XHRjbGllbnRZOiB0b3VjaEV2dC5jbGllbnRZLFxuXHRcdFx0XHRcdFx0XHRcdFx0dGFyZ2V0OiB0YXJnZXQsXG5cdFx0XHRcdFx0XHRcdFx0XHRyb290RWw6IHBhcmVudFxuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHRhcmdldCA9IHBhcmVudDsgLy8gc3RvcmUgbGFzdCBlbGVtZW50XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8qIGpzaGludCBib3NzOnRydWUgKi9cblx0XHRcdFx0XHR3aGlsZSAocGFyZW50ID0gcGFyZW50LnBhcmVudE5vZGUpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCFzdXBwb3J0Q3NzUG9pbnRlckV2ZW50cykge1xuXHRcdFx0XHRcdF9jc3MoZ2hvc3RFbCwgJ2Rpc3BsYXknLCAnJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXG5cblx0XHRfb25Ub3VjaE1vdmU6IGZ1bmN0aW9uICgvKipUb3VjaEV2ZW50Ki9ldnQpIHtcblx0XHRcdGlmICh0YXBFdnQpIHtcblx0XHRcdFx0dmFyXHRvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuXHRcdFx0XHRcdGZhbGxiYWNrVG9sZXJhbmNlID0gb3B0aW9ucy5mYWxsYmFja1RvbGVyYW5jZSxcblx0XHRcdFx0XHRmYWxsYmFja09mZnNldCA9IG9wdGlvbnMuZmFsbGJhY2tPZmZzZXQsXG5cdFx0XHRcdFx0dG91Y2ggPSBldnQudG91Y2hlcyA/IGV2dC50b3VjaGVzWzBdIDogZXZ0LFxuXHRcdFx0XHRcdGR4ID0gKHRvdWNoLmNsaWVudFggLSB0YXBFdnQuY2xpZW50WCkgKyBmYWxsYmFja09mZnNldC54LFxuXHRcdFx0XHRcdGR5ID0gKHRvdWNoLmNsaWVudFkgLSB0YXBFdnQuY2xpZW50WSkgKyBmYWxsYmFja09mZnNldC55LFxuXHRcdFx0XHRcdHRyYW5zbGF0ZTNkID0gZXZ0LnRvdWNoZXMgPyAndHJhbnNsYXRlM2QoJyArIGR4ICsgJ3B4LCcgKyBkeSArICdweCwwKScgOiAndHJhbnNsYXRlKCcgKyBkeCArICdweCwnICsgZHkgKyAncHgpJztcblxuXHRcdFx0XHQvLyBvbmx5IHNldCB0aGUgc3RhdHVzIHRvIGRyYWdnaW5nLCB3aGVuIHdlIGFyZSBhY3R1YWxseSBkcmFnZ2luZ1xuXHRcdFx0XHRpZiAoIVNvcnRhYmxlLmFjdGl2ZSkge1xuXHRcdFx0XHRcdGlmIChmYWxsYmFja1RvbGVyYW5jZSAmJlxuXHRcdFx0XHRcdFx0bWluKGFicyh0b3VjaC5jbGllbnRYIC0gdGhpcy5fbGFzdFgpLCBhYnModG91Y2guY2xpZW50WSAtIHRoaXMuX2xhc3RZKSkgPCBmYWxsYmFja1RvbGVyYW5jZVxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHRoaXMuX2RyYWdTdGFydGVkKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBhcyB3ZWxsIGFzIGNyZWF0aW5nIHRoZSBnaG9zdCBlbGVtZW50IG9uIHRoZSBkb2N1bWVudCBib2R5XG5cdFx0XHRcdHRoaXMuX2FwcGVuZEdob3N0KCk7XG5cblx0XHRcdFx0bW92ZWQgPSB0cnVlO1xuXHRcdFx0XHR0b3VjaEV2dCA9IHRvdWNoO1xuXG5cdFx0XHRcdF9jc3MoZ2hvc3RFbCwgJ3dlYmtpdFRyYW5zZm9ybScsIHRyYW5zbGF0ZTNkKTtcblx0XHRcdFx0X2NzcyhnaG9zdEVsLCAnbW96VHJhbnNmb3JtJywgdHJhbnNsYXRlM2QpO1xuXHRcdFx0XHRfY3NzKGdob3N0RWwsICdtc1RyYW5zZm9ybScsIHRyYW5zbGF0ZTNkKTtcblx0XHRcdFx0X2NzcyhnaG9zdEVsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlM2QpO1xuXG5cdFx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRfYXBwZW5kR2hvc3Q6IGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICghZ2hvc3RFbCkge1xuXHRcdFx0XHR2YXIgcmVjdCA9IGRyYWdFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcblx0XHRcdFx0XHRjc3MgPSBfY3NzKGRyYWdFbCksXG5cdFx0XHRcdFx0b3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcblx0XHRcdFx0XHRnaG9zdFJlY3Q7XG5cblx0XHRcdFx0Z2hvc3RFbCA9IGRyYWdFbC5jbG9uZU5vZGUodHJ1ZSk7XG5cblx0XHRcdFx0X3RvZ2dsZUNsYXNzKGdob3N0RWwsIG9wdGlvbnMuZ2hvc3RDbGFzcywgZmFsc2UpO1xuXHRcdFx0XHRfdG9nZ2xlQ2xhc3MoZ2hvc3RFbCwgb3B0aW9ucy5mYWxsYmFja0NsYXNzLCB0cnVlKTtcblx0XHRcdFx0X3RvZ2dsZUNsYXNzKGdob3N0RWwsIG9wdGlvbnMuZHJhZ0NsYXNzLCB0cnVlKTtcblxuXHRcdFx0XHRfY3NzKGdob3N0RWwsICd0b3AnLCByZWN0LnRvcCAtIHBhcnNlSW50KGNzcy5tYXJnaW5Ub3AsIDEwKSk7XG5cdFx0XHRcdF9jc3MoZ2hvc3RFbCwgJ2xlZnQnLCByZWN0LmxlZnQgLSBwYXJzZUludChjc3MubWFyZ2luTGVmdCwgMTApKTtcblx0XHRcdFx0X2NzcyhnaG9zdEVsLCAnd2lkdGgnLCByZWN0LndpZHRoKTtcblx0XHRcdFx0X2NzcyhnaG9zdEVsLCAnaGVpZ2h0JywgcmVjdC5oZWlnaHQpO1xuXHRcdFx0XHRfY3NzKGdob3N0RWwsICdvcGFjaXR5JywgJzAuOCcpO1xuXHRcdFx0XHRfY3NzKGdob3N0RWwsICdwb3NpdGlvbicsICdmaXhlZCcpO1xuXHRcdFx0XHRfY3NzKGdob3N0RWwsICd6SW5kZXgnLCAnMTAwMDAwJyk7XG5cdFx0XHRcdF9jc3MoZ2hvc3RFbCwgJ3BvaW50ZXJFdmVudHMnLCAnbm9uZScpO1xuXG5cdFx0XHRcdG9wdGlvbnMuZmFsbGJhY2tPbkJvZHkgJiYgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChnaG9zdEVsKSB8fCByb290RWwuYXBwZW5kQ2hpbGQoZ2hvc3RFbCk7XG5cblx0XHRcdFx0Ly8gRml4aW5nIGRpbWVuc2lvbnMuXG5cdFx0XHRcdGdob3N0UmVjdCA9IGdob3N0RWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0XHRcdF9jc3MoZ2hvc3RFbCwgJ3dpZHRoJywgcmVjdC53aWR0aCAqIDIgLSBnaG9zdFJlY3Qud2lkdGgpO1xuXHRcdFx0XHRfY3NzKGdob3N0RWwsICdoZWlnaHQnLCByZWN0LmhlaWdodCAqIDIgLSBnaG9zdFJlY3QuaGVpZ2h0KTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0X29uRHJhZ1N0YXJ0OiBmdW5jdGlvbiAoLyoqRXZlbnQqL2V2dCwgLyoqYm9vbGVhbiovdXNlRmFsbGJhY2spIHtcblx0XHRcdHZhciBkYXRhVHJhbnNmZXIgPSBldnQuZGF0YVRyYW5zZmVyLFxuXHRcdFx0XHRvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG5cdFx0XHR0aGlzLl9vZmZVcEV2ZW50cygpO1xuXG5cdFx0XHRpZiAoYWN0aXZlR3JvdXAuY2hlY2tQdWxsKHRoaXMsIHRoaXMsIGRyYWdFbCwgZXZ0KSkge1xuXHRcdFx0XHRjbG9uZUVsID0gX2Nsb25lKGRyYWdFbCk7XG5cblx0XHRcdFx0Y2xvbmVFbC5kcmFnZ2FibGUgPSBmYWxzZTtcblx0XHRcdFx0Y2xvbmVFbC5zdHlsZVsnd2lsbC1jaGFuZ2UnXSA9ICcnO1xuXG5cdFx0XHRcdF9jc3MoY2xvbmVFbCwgJ2Rpc3BsYXknLCAnbm9uZScpO1xuXHRcdFx0XHRfdG9nZ2xlQ2xhc3MoY2xvbmVFbCwgdGhpcy5vcHRpb25zLmNob3NlbkNsYXNzLCBmYWxzZSk7XG5cblx0XHRcdFx0cm9vdEVsLmluc2VydEJlZm9yZShjbG9uZUVsLCBkcmFnRWwpO1xuXHRcdFx0XHRfZGlzcGF0Y2hFdmVudCh0aGlzLCByb290RWwsICdjbG9uZScsIGRyYWdFbCk7XG5cdFx0XHR9XG5cblx0XHRcdF90b2dnbGVDbGFzcyhkcmFnRWwsIG9wdGlvbnMuZHJhZ0NsYXNzLCB0cnVlKTtcblxuXHRcdFx0aWYgKHVzZUZhbGxiYWNrKSB7XG5cdFx0XHRcdGlmICh1c2VGYWxsYmFjayA9PT0gJ3RvdWNoJykge1xuXHRcdFx0XHRcdC8vIEJpbmQgdG91Y2ggZXZlbnRzXG5cdFx0XHRcdFx0X29uKGRvY3VtZW50LCAndG91Y2htb3ZlJywgdGhpcy5fb25Ub3VjaE1vdmUpO1xuXHRcdFx0XHRcdF9vbihkb2N1bWVudCwgJ3RvdWNoZW5kJywgdGhpcy5fb25Ecm9wKTtcblx0XHRcdFx0XHRfb24oZG9jdW1lbnQsICd0b3VjaGNhbmNlbCcsIHRoaXMuX29uRHJvcCk7XG5cdFx0XHRcdFx0X29uKGRvY3VtZW50LCAncG9pbnRlcm1vdmUnLCB0aGlzLl9vblRvdWNoTW92ZSk7XG5cdFx0XHRcdFx0X29uKGRvY3VtZW50LCAncG9pbnRlcnVwJywgdGhpcy5fb25Ecm9wKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBPbGQgYnJ3b3NlclxuXHRcdFx0XHRcdF9vbihkb2N1bWVudCwgJ21vdXNlbW92ZScsIHRoaXMuX29uVG91Y2hNb3ZlKTtcblx0XHRcdFx0XHRfb24oZG9jdW1lbnQsICdtb3VzZXVwJywgdGhpcy5fb25Ecm9wKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMuX2xvb3BJZCA9IHNldEludGVydmFsKHRoaXMuX2VtdWxhdGVEcmFnT3ZlciwgNTApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGlmIChkYXRhVHJhbnNmZXIpIHtcblx0XHRcdFx0XHRkYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZCA9ICdtb3ZlJztcblx0XHRcdFx0XHRvcHRpb25zLnNldERhdGEgJiYgb3B0aW9ucy5zZXREYXRhLmNhbGwodGhpcywgZGF0YVRyYW5zZmVyLCBkcmFnRWwpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0X29uKGRvY3VtZW50LCAnZHJvcCcsIHRoaXMpO1xuXHRcdFx0XHRzZXRUaW1lb3V0KHRoaXMuX2RyYWdTdGFydGVkLCAwKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0X29uRHJhZ092ZXI6IGZ1bmN0aW9uICgvKipFdmVudCovZXZ0KSB7XG5cdFx0XHR2YXIgZWwgPSB0aGlzLmVsLFxuXHRcdFx0XHR0YXJnZXQsXG5cdFx0XHRcdGRyYWdSZWN0LFxuXHRcdFx0XHR0YXJnZXRSZWN0LFxuXHRcdFx0XHRyZXZlcnQsXG5cdFx0XHRcdG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG5cdFx0XHRcdGdyb3VwID0gb3B0aW9ucy5ncm91cCxcblx0XHRcdFx0YWN0aXZlU29ydGFibGUgPSBTb3J0YWJsZS5hY3RpdmUsXG5cdFx0XHRcdGlzT3duZXIgPSAoYWN0aXZlR3JvdXAgPT09IGdyb3VwKSxcblx0XHRcdFx0aXNNb3ZpbmdCZXR3ZWVuU29ydGFibGUgPSBmYWxzZSxcblx0XHRcdFx0Y2FuU29ydCA9IG9wdGlvbnMuc29ydDtcblxuXHRcdFx0aWYgKGV2dC5wcmV2ZW50RGVmYXVsdCAhPT0gdm9pZCAwKSB7XG5cdFx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQhb3B0aW9ucy5kcmFnb3ZlckJ1YmJsZSAmJiBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChkcmFnRWwuYW5pbWF0ZWQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRtb3ZlZCA9IHRydWU7XG5cblx0XHRcdGlmIChhY3RpdmVTb3J0YWJsZSAmJiAhb3B0aW9ucy5kaXNhYmxlZCAmJlxuXHRcdFx0XHQoaXNPd25lclxuXHRcdFx0XHRcdD8gY2FuU29ydCB8fCAocmV2ZXJ0ID0gIXJvb3RFbC5jb250YWlucyhkcmFnRWwpKSAvLyBSZXZlcnRpbmcgaXRlbSBpbnRvIHRoZSBvcmlnaW5hbCBsaXN0XG5cdFx0XHRcdFx0OiAoXG5cdFx0XHRcdFx0XHRwdXRTb3J0YWJsZSA9PT0gdGhpcyB8fFxuXHRcdFx0XHRcdFx0KFxuXHRcdFx0XHRcdFx0XHQoYWN0aXZlU29ydGFibGUubGFzdFB1bGxNb2RlID0gYWN0aXZlR3JvdXAuY2hlY2tQdWxsKHRoaXMsIGFjdGl2ZVNvcnRhYmxlLCBkcmFnRWwsIGV2dCkpICYmXG5cdFx0XHRcdFx0XHRcdGdyb3VwLmNoZWNrUHV0KHRoaXMsIGFjdGl2ZVNvcnRhYmxlLCBkcmFnRWwsIGV2dClcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHQpXG5cdFx0XHRcdCkgJiZcblx0XHRcdFx0KGV2dC5yb290RWwgPT09IHZvaWQgMCB8fCBldnQucm9vdEVsID09PSB0aGlzLmVsKSAvLyB0b3VjaCBmYWxsYmFja1xuXHRcdFx0KSB7XG5cdFx0XHRcdC8vIFNtYXJ0IGF1dG8tc2Nyb2xsaW5nXG5cdFx0XHRcdF9hdXRvU2Nyb2xsKGV2dCwgb3B0aW9ucywgdGhpcy5lbCk7XG5cblx0XHRcdFx0aWYgKF9zaWxlbnQpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0YXJnZXQgPSBfY2xvc2VzdChldnQudGFyZ2V0LCBvcHRpb25zLmRyYWdnYWJsZSwgZWwpO1xuXHRcdFx0XHRkcmFnUmVjdCA9IGRyYWdFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuXHRcdFx0XHRpZiAocHV0U29ydGFibGUgIT09IHRoaXMpIHtcblx0XHRcdFx0XHRwdXRTb3J0YWJsZSA9IHRoaXM7XG5cdFx0XHRcdFx0aXNNb3ZpbmdCZXR3ZWVuU29ydGFibGUgPSB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHJldmVydCkge1xuXHRcdFx0XHRcdF9jbG9uZUhpZGUoYWN0aXZlU29ydGFibGUsIHRydWUpO1xuXHRcdFx0XHRcdHBhcmVudEVsID0gcm9vdEVsOyAvLyBhY3R1YWxpemF0aW9uXG5cblx0XHRcdFx0XHRpZiAoY2xvbmVFbCB8fCBuZXh0RWwpIHtcblx0XHRcdFx0XHRcdHJvb3RFbC5pbnNlcnRCZWZvcmUoZHJhZ0VsLCBjbG9uZUVsIHx8IG5leHRFbCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgaWYgKCFjYW5Tb3J0KSB7XG5cdFx0XHRcdFx0XHRyb290RWwuYXBwZW5kQ2hpbGQoZHJhZ0VsKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXG5cdFx0XHRcdGlmICgoZWwuY2hpbGRyZW4ubGVuZ3RoID09PSAwKSB8fCAoZWwuY2hpbGRyZW5bMF0gPT09IGdob3N0RWwpIHx8XG5cdFx0XHRcdFx0KGVsID09PSBldnQudGFyZ2V0KSAmJiAoX2dob3N0SXNMYXN0KGVsLCBldnQpKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHQvL2Fzc2lnbiB0YXJnZXQgb25seSBpZiBjb25kaXRpb24gaXMgdHJ1ZVxuXHRcdFx0XHRcdGlmIChlbC5jaGlsZHJlbi5sZW5ndGggIT09IDAgJiYgZWwuY2hpbGRyZW5bMF0gIT09IGdob3N0RWwgJiYgZWwgPT09IGV2dC50YXJnZXQpIHtcblx0XHRcdFx0XHRcdHRhcmdldCA9IGVsLmxhc3RFbGVtZW50Q2hpbGQ7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHRhcmdldCkge1xuXHRcdFx0XHRcdFx0aWYgKHRhcmdldC5hbmltYXRlZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHRhcmdldFJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0X2Nsb25lSGlkZShhY3RpdmVTb3J0YWJsZSwgaXNPd25lcik7XG5cblx0XHRcdFx0XHRpZiAoX29uTW92ZShyb290RWwsIGVsLCBkcmFnRWwsIGRyYWdSZWN0LCB0YXJnZXQsIHRhcmdldFJlY3QsIGV2dCkgIT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0XHRpZiAoIWRyYWdFbC5jb250YWlucyhlbCkpIHtcblx0XHRcdFx0XHRcdFx0ZWwuYXBwZW5kQ2hpbGQoZHJhZ0VsKTtcblx0XHRcdFx0XHRcdFx0cGFyZW50RWwgPSBlbDsgLy8gYWN0dWFsaXphdGlvblxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR0aGlzLl9hbmltYXRlKGRyYWdSZWN0LCBkcmFnRWwpO1xuXHRcdFx0XHRcdFx0dGFyZ2V0ICYmIHRoaXMuX2FuaW1hdGUodGFyZ2V0UmVjdCwgdGFyZ2V0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAodGFyZ2V0ICYmICF0YXJnZXQuYW5pbWF0ZWQgJiYgdGFyZ2V0ICE9PSBkcmFnRWwgJiYgKHRhcmdldC5wYXJlbnROb2RlW2V4cGFuZG9dICE9PSB2b2lkIDApKSB7XG5cdFx0XHRcdFx0aWYgKGxhc3RFbCAhPT0gdGFyZ2V0KSB7XG5cdFx0XHRcdFx0XHRsYXN0RWwgPSB0YXJnZXQ7XG5cdFx0XHRcdFx0XHRsYXN0Q1NTID0gX2Nzcyh0YXJnZXQpO1xuXHRcdFx0XHRcdFx0bGFzdFBhcmVudENTUyA9IF9jc3ModGFyZ2V0LnBhcmVudE5vZGUpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHRhcmdldFJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cblx0XHRcdFx0XHR2YXIgd2lkdGggPSB0YXJnZXRSZWN0LnJpZ2h0IC0gdGFyZ2V0UmVjdC5sZWZ0LFxuXHRcdFx0XHRcdFx0aGVpZ2h0ID0gdGFyZ2V0UmVjdC5ib3R0b20gLSB0YXJnZXRSZWN0LnRvcCxcblx0XHRcdFx0XHRcdGZsb2F0aW5nID0gUl9GTE9BVC50ZXN0KGxhc3RDU1MuY3NzRmxvYXQgKyBsYXN0Q1NTLmRpc3BsYXkpXG5cdFx0XHRcdFx0XHRcdHx8IChsYXN0UGFyZW50Q1NTLmRpc3BsYXkgPT0gJ2ZsZXgnICYmIGxhc3RQYXJlbnRDU1NbJ2ZsZXgtZGlyZWN0aW9uJ10uaW5kZXhPZigncm93JykgPT09IDApLFxuXHRcdFx0XHRcdFx0aXNXaWRlID0gKHRhcmdldC5vZmZzZXRXaWR0aCA+IGRyYWdFbC5vZmZzZXRXaWR0aCksXG5cdFx0XHRcdFx0XHRpc0xvbmcgPSAodGFyZ2V0Lm9mZnNldEhlaWdodCA+IGRyYWdFbC5vZmZzZXRIZWlnaHQpLFxuXHRcdFx0XHRcdFx0aGFsZndheSA9IChmbG9hdGluZyA/IChldnQuY2xpZW50WCAtIHRhcmdldFJlY3QubGVmdCkgLyB3aWR0aCA6IChldnQuY2xpZW50WSAtIHRhcmdldFJlY3QudG9wKSAvIGhlaWdodCkgPiAwLjUsXG5cdFx0XHRcdFx0XHRuZXh0U2libGluZyA9IHRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmcsXG5cdFx0XHRcdFx0XHRhZnRlciA9IGZhbHNlXG5cdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0aWYgKGZsb2F0aW5nKSB7XG5cdFx0XHRcdFx0XHR2YXIgZWxUb3AgPSBkcmFnRWwub2Zmc2V0VG9wLFxuXHRcdFx0XHRcdFx0XHR0Z1RvcCA9IHRhcmdldC5vZmZzZXRUb3A7XG5cblx0XHRcdFx0XHRcdGlmIChlbFRvcCA9PT0gdGdUb3ApIHtcblx0XHRcdFx0XHRcdFx0YWZ0ZXIgPSAodGFyZ2V0LnByZXZpb3VzRWxlbWVudFNpYmxpbmcgPT09IGRyYWdFbCkgJiYgIWlzV2lkZSB8fCBoYWxmd2F5ICYmIGlzV2lkZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKHRhcmdldC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nID09PSBkcmFnRWwgfHwgZHJhZ0VsLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgPT09IHRhcmdldCkge1xuXHRcdFx0XHRcdFx0XHRhZnRlciA9IChldnQuY2xpZW50WSAtIHRhcmdldFJlY3QudG9wKSAvIGhlaWdodCA+IDAuNTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGFmdGVyID0gdGdUb3AgPiBlbFRvcDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoIWlzTW92aW5nQmV0d2VlblNvcnRhYmxlKSB7XG5cdFx0XHRcdFx0XHRhZnRlciA9IChuZXh0U2libGluZyAhPT0gZHJhZ0VsKSAmJiAhaXNMb25nIHx8IGhhbGZ3YXkgJiYgaXNMb25nO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHZhciBtb3ZlVmVjdG9yID0gX29uTW92ZShyb290RWwsIGVsLCBkcmFnRWwsIGRyYWdSZWN0LCB0YXJnZXQsIHRhcmdldFJlY3QsIGV2dCwgYWZ0ZXIpO1xuXG5cdFx0XHRcdFx0aWYgKG1vdmVWZWN0b3IgIT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0XHRpZiAobW92ZVZlY3RvciA9PT0gMSB8fCBtb3ZlVmVjdG9yID09PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRhZnRlciA9IChtb3ZlVmVjdG9yID09PSAxKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0X3NpbGVudCA9IHRydWU7XG5cdFx0XHRcdFx0XHRzZXRUaW1lb3V0KF91bnNpbGVudCwgMzApO1xuXG5cdFx0XHRcdFx0XHRfY2xvbmVIaWRlKGFjdGl2ZVNvcnRhYmxlLCBpc093bmVyKTtcblxuXHRcdFx0XHRcdFx0aWYgKCFkcmFnRWwuY29udGFpbnMoZWwpKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChhZnRlciAmJiAhbmV4dFNpYmxpbmcpIHtcblx0XHRcdFx0XHRcdFx0XHRlbC5hcHBlbmRDaGlsZChkcmFnRWwpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHRhcmdldC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShkcmFnRWwsIGFmdGVyID8gbmV4dFNpYmxpbmcgOiB0YXJnZXQpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHBhcmVudEVsID0gZHJhZ0VsLnBhcmVudE5vZGU7IC8vIGFjdHVhbGl6YXRpb25cblxuXHRcdFx0XHRcdFx0dGhpcy5fYW5pbWF0ZShkcmFnUmVjdCwgZHJhZ0VsKTtcblx0XHRcdFx0XHRcdHRoaXMuX2FuaW1hdGUodGFyZ2V0UmVjdCwgdGFyZ2V0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0X2FuaW1hdGU6IGZ1bmN0aW9uIChwcmV2UmVjdCwgdGFyZ2V0KSB7XG5cdFx0XHR2YXIgbXMgPSB0aGlzLm9wdGlvbnMuYW5pbWF0aW9uO1xuXG5cdFx0XHRpZiAobXMpIHtcblx0XHRcdFx0dmFyIGN1cnJlbnRSZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG5cdFx0XHRcdGlmIChwcmV2UmVjdC5ub2RlVHlwZSA9PT0gMSkge1xuXHRcdFx0XHRcdHByZXZSZWN0ID0gcHJldlJlY3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRfY3NzKHRhcmdldCwgJ3RyYW5zaXRpb24nLCAnbm9uZScpO1xuXHRcdFx0XHRfY3NzKHRhcmdldCwgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUzZCgnXG5cdFx0XHRcdFx0KyAocHJldlJlY3QubGVmdCAtIGN1cnJlbnRSZWN0LmxlZnQpICsgJ3B4LCdcblx0XHRcdFx0XHQrIChwcmV2UmVjdC50b3AgLSBjdXJyZW50UmVjdC50b3ApICsgJ3B4LDApJ1xuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHRhcmdldC5vZmZzZXRXaWR0aDsgLy8gcmVwYWludFxuXG5cdFx0XHRcdF9jc3ModGFyZ2V0LCAndHJhbnNpdGlvbicsICdhbGwgJyArIG1zICsgJ21zJyk7XG5cdFx0XHRcdF9jc3ModGFyZ2V0LCAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZTNkKDAsMCwwKScpO1xuXG5cdFx0XHRcdGNsZWFyVGltZW91dCh0YXJnZXQuYW5pbWF0ZWQpO1xuXHRcdFx0XHR0YXJnZXQuYW5pbWF0ZWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRfY3NzKHRhcmdldCwgJ3RyYW5zaXRpb24nLCAnJyk7XG5cdFx0XHRcdFx0X2Nzcyh0YXJnZXQsICd0cmFuc2Zvcm0nLCAnJyk7XG5cdFx0XHRcdFx0dGFyZ2V0LmFuaW1hdGVkID0gZmFsc2U7XG5cdFx0XHRcdH0sIG1zKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0X29mZlVwRXZlbnRzOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgb3duZXJEb2N1bWVudCA9IHRoaXMuZWwub3duZXJEb2N1bWVudDtcblxuXHRcdFx0X29mZihkb2N1bWVudCwgJ3RvdWNobW92ZScsIHRoaXMuX29uVG91Y2hNb3ZlKTtcblx0XHRcdF9vZmYoZG9jdW1lbnQsICdwb2ludGVybW92ZScsIHRoaXMuX29uVG91Y2hNb3ZlKTtcblx0XHRcdF9vZmYob3duZXJEb2N1bWVudCwgJ21vdXNldXAnLCB0aGlzLl9vbkRyb3ApO1xuXHRcdFx0X29mZihvd25lckRvY3VtZW50LCAndG91Y2hlbmQnLCB0aGlzLl9vbkRyb3ApO1xuXHRcdFx0X29mZihvd25lckRvY3VtZW50LCAncG9pbnRlcnVwJywgdGhpcy5fb25Ecm9wKTtcblx0XHRcdF9vZmYob3duZXJEb2N1bWVudCwgJ3RvdWNoY2FuY2VsJywgdGhpcy5fb25Ecm9wKTtcblx0XHRcdF9vZmYob3duZXJEb2N1bWVudCwgJ3BvaW50ZXJjYW5jZWwnLCB0aGlzLl9vbkRyb3ApO1xuXHRcdFx0X29mZihvd25lckRvY3VtZW50LCAnc2VsZWN0c3RhcnQnLCB0aGlzKTtcblx0XHR9LFxuXG5cdFx0X29uRHJvcDogZnVuY3Rpb24gKC8qKkV2ZW50Ki9ldnQpIHtcblx0XHRcdHZhciBlbCA9IHRoaXMuZWwsXG5cdFx0XHRcdG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cblx0XHRcdGNsZWFySW50ZXJ2YWwodGhpcy5fbG9vcElkKTtcblx0XHRcdGNsZWFySW50ZXJ2YWwoYXV0b1Njcm9sbC5waWQpO1xuXHRcdFx0Y2xlYXJUaW1lb3V0KHRoaXMuX2RyYWdTdGFydFRpbWVyKTtcblxuXHRcdFx0Ly8gVW5iaW5kIGV2ZW50c1xuXHRcdFx0X29mZihkb2N1bWVudCwgJ21vdXNlbW92ZScsIHRoaXMuX29uVG91Y2hNb3ZlKTtcblxuXHRcdFx0aWYgKHRoaXMubmF0aXZlRHJhZ2dhYmxlKSB7XG5cdFx0XHRcdF9vZmYoZG9jdW1lbnQsICdkcm9wJywgdGhpcyk7XG5cdFx0XHRcdF9vZmYoZWwsICdkcmFnc3RhcnQnLCB0aGlzLl9vbkRyYWdTdGFydCk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuX29mZlVwRXZlbnRzKCk7XG5cblx0XHRcdGlmIChldnQpIHtcblx0XHRcdFx0aWYgKG1vdmVkKSB7XG5cdFx0XHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0IW9wdGlvbnMuZHJvcEJ1YmJsZSAmJiBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRnaG9zdEVsICYmIGdob3N0RWwucGFyZW50Tm9kZSAmJiBnaG9zdEVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZ2hvc3RFbCk7XG5cblx0XHRcdFx0aWYgKHJvb3RFbCA9PT0gcGFyZW50RWwgfHwgU29ydGFibGUuYWN0aXZlLmxhc3RQdWxsTW9kZSAhPT0gJ2Nsb25lJykge1xuXHRcdFx0XHRcdC8vIFJlbW92ZSBjbG9uZVxuXHRcdFx0XHRcdGNsb25lRWwgJiYgY2xvbmVFbC5wYXJlbnROb2RlICYmIGNsb25lRWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjbG9uZUVsKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChkcmFnRWwpIHtcblx0XHRcdFx0XHRpZiAodGhpcy5uYXRpdmVEcmFnZ2FibGUpIHtcblx0XHRcdFx0XHRcdF9vZmYoZHJhZ0VsLCAnZHJhZ2VuZCcsIHRoaXMpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdF9kaXNhYmxlRHJhZ2dhYmxlKGRyYWdFbCk7XG5cdFx0XHRcdFx0ZHJhZ0VsLnN0eWxlWyd3aWxsLWNoYW5nZSddID0gJyc7XG5cblx0XHRcdFx0XHQvLyBSZW1vdmUgY2xhc3Mnc1xuXHRcdFx0XHRcdF90b2dnbGVDbGFzcyhkcmFnRWwsIHRoaXMub3B0aW9ucy5naG9zdENsYXNzLCBmYWxzZSk7XG5cdFx0XHRcdFx0X3RvZ2dsZUNsYXNzKGRyYWdFbCwgdGhpcy5vcHRpb25zLmNob3NlbkNsYXNzLCBmYWxzZSk7XG5cblx0XHRcdFx0XHQvLyBEcmFnIHN0b3AgZXZlbnRcblx0XHRcdFx0XHRfZGlzcGF0Y2hFdmVudCh0aGlzLCByb290RWwsICd1bmNob29zZScsIGRyYWdFbCwgcm9vdEVsLCBvbGRJbmRleCk7XG5cblx0XHRcdFx0XHRpZiAocm9vdEVsICE9PSBwYXJlbnRFbCkge1xuXHRcdFx0XHRcdFx0bmV3SW5kZXggPSBfaW5kZXgoZHJhZ0VsLCBvcHRpb25zLmRyYWdnYWJsZSk7XG5cblx0XHRcdFx0XHRcdGlmIChuZXdJbmRleCA+PSAwKSB7XG5cdFx0XHRcdFx0XHRcdC8vIEFkZCBldmVudFxuXHRcdFx0XHRcdFx0XHRfZGlzcGF0Y2hFdmVudChudWxsLCBwYXJlbnRFbCwgJ2FkZCcsIGRyYWdFbCwgcm9vdEVsLCBvbGRJbmRleCwgbmV3SW5kZXgpO1xuXG5cdFx0XHRcdFx0XHRcdC8vIFJlbW92ZSBldmVudFxuXHRcdFx0XHRcdFx0XHRfZGlzcGF0Y2hFdmVudCh0aGlzLCByb290RWwsICdyZW1vdmUnLCBkcmFnRWwsIHJvb3RFbCwgb2xkSW5kZXgsIG5ld0luZGV4KTtcblxuXHRcdFx0XHRcdFx0XHQvLyBkcmFnIGZyb20gb25lIGxpc3QgYW5kIGRyb3AgaW50byBhbm90aGVyXG5cdFx0XHRcdFx0XHRcdF9kaXNwYXRjaEV2ZW50KG51bGwsIHBhcmVudEVsLCAnc29ydCcsIGRyYWdFbCwgcm9vdEVsLCBvbGRJbmRleCwgbmV3SW5kZXgpO1xuXHRcdFx0XHRcdFx0XHRfZGlzcGF0Y2hFdmVudCh0aGlzLCByb290RWwsICdzb3J0JywgZHJhZ0VsLCByb290RWwsIG9sZEluZGV4LCBuZXdJbmRleCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKGRyYWdFbC5uZXh0U2libGluZyAhPT0gbmV4dEVsKSB7XG5cdFx0XHRcdFx0XHRcdC8vIEdldCB0aGUgaW5kZXggb2YgdGhlIGRyYWdnZWQgZWxlbWVudCB3aXRoaW4gaXRzIHBhcmVudFxuXHRcdFx0XHRcdFx0XHRuZXdJbmRleCA9IF9pbmRleChkcmFnRWwsIG9wdGlvbnMuZHJhZ2dhYmxlKTtcblxuXHRcdFx0XHRcdFx0XHRpZiAobmV3SW5kZXggPj0gMCkge1xuXHRcdFx0XHRcdFx0XHRcdC8vIGRyYWcgJiBkcm9wIHdpdGhpbiB0aGUgc2FtZSBsaXN0XG5cdFx0XHRcdFx0XHRcdFx0X2Rpc3BhdGNoRXZlbnQodGhpcywgcm9vdEVsLCAndXBkYXRlJywgZHJhZ0VsLCByb290RWwsIG9sZEluZGV4LCBuZXdJbmRleCk7XG5cdFx0XHRcdFx0XHRcdFx0X2Rpc3BhdGNoRXZlbnQodGhpcywgcm9vdEVsLCAnc29ydCcsIGRyYWdFbCwgcm9vdEVsLCBvbGRJbmRleCwgbmV3SW5kZXgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKFNvcnRhYmxlLmFjdGl2ZSkge1xuXHRcdFx0XHRcdFx0LyoganNoaW50IGVxbnVsbDp0cnVlICovXG5cdFx0XHRcdFx0XHRpZiAobmV3SW5kZXggPT0gbnVsbCB8fCBuZXdJbmRleCA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0bmV3SW5kZXggPSBvbGRJbmRleDtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0X2Rpc3BhdGNoRXZlbnQodGhpcywgcm9vdEVsLCAnZW5kJywgZHJhZ0VsLCByb290RWwsIG9sZEluZGV4LCBuZXdJbmRleCk7XG5cblx0XHRcdFx0XHRcdC8vIFNhdmUgc29ydGluZ1xuXHRcdFx0XHRcdFx0dGhpcy5zYXZlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fbnVsbGluZygpO1xuXHRcdH0sXG5cblx0XHRfbnVsbGluZzogZnVuY3Rpb24oKSB7XG5cdFx0XHRyb290RWwgPVxuXHRcdFx0ZHJhZ0VsID1cblx0XHRcdHBhcmVudEVsID1cblx0XHRcdGdob3N0RWwgPVxuXHRcdFx0bmV4dEVsID1cblx0XHRcdGNsb25lRWwgPVxuXHRcdFx0bGFzdERvd25FbCA9XG5cblx0XHRcdHNjcm9sbEVsID1cblx0XHRcdHNjcm9sbFBhcmVudEVsID1cblxuXHRcdFx0dGFwRXZ0ID1cblx0XHRcdHRvdWNoRXZ0ID1cblxuXHRcdFx0bW92ZWQgPVxuXHRcdFx0bmV3SW5kZXggPVxuXG5cdFx0XHRsYXN0RWwgPVxuXHRcdFx0bGFzdENTUyA9XG5cblx0XHRcdHB1dFNvcnRhYmxlID1cblx0XHRcdGFjdGl2ZUdyb3VwID1cblx0XHRcdFNvcnRhYmxlLmFjdGl2ZSA9IG51bGw7XG5cblx0XHRcdHNhdmVkSW5wdXRDaGVja2VkLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG5cdFx0XHRcdGVsLmNoZWNrZWQgPSB0cnVlO1xuXHRcdFx0fSk7XG5cdFx0XHRzYXZlZElucHV0Q2hlY2tlZC5sZW5ndGggPSAwO1xuXHRcdH0sXG5cblx0XHRoYW5kbGVFdmVudDogZnVuY3Rpb24gKC8qKkV2ZW50Ki9ldnQpIHtcblx0XHRcdHN3aXRjaCAoZXZ0LnR5cGUpIHtcblx0XHRcdFx0Y2FzZSAnZHJvcCc6XG5cdFx0XHRcdGNhc2UgJ2RyYWdlbmQnOlxuXHRcdFx0XHRcdHRoaXMuX29uRHJvcChldnQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgJ2RyYWdvdmVyJzpcblx0XHRcdFx0Y2FzZSAnZHJhZ2VudGVyJzpcblx0XHRcdFx0XHRpZiAoZHJhZ0VsKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9vbkRyYWdPdmVyKGV2dCk7XG5cdFx0XHRcdFx0XHRfZ2xvYmFsRHJhZ092ZXIoZXZ0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAnc2VsZWN0c3RhcnQnOlxuXHRcdFx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqIFNlcmlhbGl6ZXMgdGhlIGl0ZW0gaW50byBhbiBhcnJheSBvZiBzdHJpbmcuXG5cdFx0ICogQHJldHVybnMge1N0cmluZ1tdfVxuXHRcdCAqL1xuXHRcdHRvQXJyYXk6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBvcmRlciA9IFtdLFxuXHRcdFx0XHRlbCxcblx0XHRcdFx0Y2hpbGRyZW4gPSB0aGlzLmVsLmNoaWxkcmVuLFxuXHRcdFx0XHRpID0gMCxcblx0XHRcdFx0biA9IGNoaWxkcmVuLmxlbmd0aCxcblx0XHRcdFx0b3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuXHRcdFx0Zm9yICg7IGkgPCBuOyBpKyspIHtcblx0XHRcdFx0ZWwgPSBjaGlsZHJlbltpXTtcblx0XHRcdFx0aWYgKF9jbG9zZXN0KGVsLCBvcHRpb25zLmRyYWdnYWJsZSwgdGhpcy5lbCkpIHtcblx0XHRcdFx0XHRvcmRlci5wdXNoKGVsLmdldEF0dHJpYnV0ZShvcHRpb25zLmRhdGFJZEF0dHIpIHx8IF9nZW5lcmF0ZUlkKGVsKSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG9yZGVyO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqIFNvcnRzIHRoZSBlbGVtZW50cyBhY2NvcmRpbmcgdG8gdGhlIGFycmF5LlxuXHRcdCAqIEBwYXJhbSAge1N0cmluZ1tdfSAgb3JkZXIgIG9yZGVyIG9mIHRoZSBpdGVtc1xuXHRcdCAqL1xuXHRcdHNvcnQ6IGZ1bmN0aW9uIChvcmRlcikge1xuXHRcdFx0dmFyIGl0ZW1zID0ge30sIHJvb3RFbCA9IHRoaXMuZWw7XG5cblx0XHRcdHRoaXMudG9BcnJheSgpLmZvckVhY2goZnVuY3Rpb24gKGlkLCBpKSB7XG5cdFx0XHRcdHZhciBlbCA9IHJvb3RFbC5jaGlsZHJlbltpXTtcblxuXHRcdFx0XHRpZiAoX2Nsb3Nlc3QoZWwsIHRoaXMub3B0aW9ucy5kcmFnZ2FibGUsIHJvb3RFbCkpIHtcblx0XHRcdFx0XHRpdGVtc1tpZF0gPSBlbDtcblx0XHRcdFx0fVxuXHRcdFx0fSwgdGhpcyk7XG5cblx0XHRcdG9yZGVyLmZvckVhY2goZnVuY3Rpb24gKGlkKSB7XG5cdFx0XHRcdGlmIChpdGVtc1tpZF0pIHtcblx0XHRcdFx0XHRyb290RWwucmVtb3ZlQ2hpbGQoaXRlbXNbaWRdKTtcblx0XHRcdFx0XHRyb290RWwuYXBwZW5kQ2hpbGQoaXRlbXNbaWRdKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICogU2F2ZSB0aGUgY3VycmVudCBzb3J0aW5nXG5cdFx0ICovXG5cdFx0c2F2ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIHN0b3JlID0gdGhpcy5vcHRpb25zLnN0b3JlO1xuXHRcdFx0c3RvcmUgJiYgc3RvcmUuc2V0KHRoaXMpO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqIEZvciBlYWNoIGVsZW1lbnQgaW4gdGhlIHNldCwgZ2V0IHRoZSBmaXJzdCBlbGVtZW50IHRoYXQgbWF0Y2hlcyB0aGUgc2VsZWN0b3IgYnkgdGVzdGluZyB0aGUgZWxlbWVudCBpdHNlbGYgYW5kIHRyYXZlcnNpbmcgdXAgdGhyb3VnaCBpdHMgYW5jZXN0b3JzIGluIHRoZSBET00gdHJlZS5cblx0XHQgKiBAcGFyYW0gICB7SFRNTEVsZW1lbnR9ICBlbFxuXHRcdCAqIEBwYXJhbSAgIHtTdHJpbmd9ICAgICAgIFtzZWxlY3Rvcl0gIGRlZmF1bHQ6IGBvcHRpb25zLmRyYWdnYWJsZWBcblx0XHQgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR8bnVsbH1cblx0XHQgKi9cblx0XHRjbG9zZXN0OiBmdW5jdGlvbiAoZWwsIHNlbGVjdG9yKSB7XG5cdFx0XHRyZXR1cm4gX2Nsb3Nlc3QoZWwsIHNlbGVjdG9yIHx8IHRoaXMub3B0aW9ucy5kcmFnZ2FibGUsIHRoaXMuZWwpO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqIFNldC9nZXQgb3B0aW9uXG5cdFx0ICogQHBhcmFtICAge3N0cmluZ30gbmFtZVxuXHRcdCAqIEBwYXJhbSAgIHsqfSAgICAgIFt2YWx1ZV1cblx0XHQgKiBAcmV0dXJucyB7Kn1cblx0XHQgKi9cblx0XHRvcHRpb246IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuXHRcdFx0dmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cblx0XHRcdGlmICh2YWx1ZSA9PT0gdm9pZCAwKSB7XG5cdFx0XHRcdHJldHVybiBvcHRpb25zW25hbWVdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b3B0aW9uc1tuYW1lXSA9IHZhbHVlO1xuXG5cdFx0XHRcdGlmIChuYW1lID09PSAnZ3JvdXAnKSB7XG5cdFx0XHRcdFx0X3ByZXBhcmVHcm91cChvcHRpb25zKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqIERlc3Ryb3lcblx0XHQgKi9cblx0XHRkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgZWwgPSB0aGlzLmVsO1xuXG5cdFx0XHRlbFtleHBhbmRvXSA9IG51bGw7XG5cblx0XHRcdF9vZmYoZWwsICdtb3VzZWRvd24nLCB0aGlzLl9vblRhcFN0YXJ0KTtcblx0XHRcdF9vZmYoZWwsICd0b3VjaHN0YXJ0JywgdGhpcy5fb25UYXBTdGFydCk7XG5cdFx0XHRfb2ZmKGVsLCAncG9pbnRlcmRvd24nLCB0aGlzLl9vblRhcFN0YXJ0KTtcblxuXHRcdFx0aWYgKHRoaXMubmF0aXZlRHJhZ2dhYmxlKSB7XG5cdFx0XHRcdF9vZmYoZWwsICdkcmFnb3ZlcicsIHRoaXMpO1xuXHRcdFx0XHRfb2ZmKGVsLCAnZHJhZ2VudGVyJywgdGhpcyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJlbW92ZSBkcmFnZ2FibGUgYXR0cmlidXRlc1xuXHRcdFx0QXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChlbC5xdWVyeVNlbGVjdG9yQWxsKCdbZHJhZ2dhYmxlXScpLCBmdW5jdGlvbiAoZWwpIHtcblx0XHRcdFx0ZWwucmVtb3ZlQXR0cmlidXRlKCdkcmFnZ2FibGUnKTtcblx0XHRcdH0pO1xuXG5cdFx0XHR0b3VjaERyYWdPdmVyTGlzdGVuZXJzLnNwbGljZSh0b3VjaERyYWdPdmVyTGlzdGVuZXJzLmluZGV4T2YodGhpcy5fb25EcmFnT3ZlciksIDEpO1xuXG5cdFx0XHR0aGlzLl9vbkRyb3AoKTtcblxuXHRcdFx0dGhpcy5lbCA9IGVsID0gbnVsbDtcblx0XHR9XG5cdH07XG5cblxuXHRmdW5jdGlvbiBfY2xvbmVIaWRlKHNvcnRhYmxlLCBzdGF0ZSkge1xuXHRcdGlmIChzb3J0YWJsZS5sYXN0UHVsbE1vZGUgIT09ICdjbG9uZScpIHtcblx0XHRcdHN0YXRlID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAoY2xvbmVFbCAmJiAoY2xvbmVFbC5zdGF0ZSAhPT0gc3RhdGUpKSB7XG5cdFx0XHRfY3NzKGNsb25lRWwsICdkaXNwbGF5Jywgc3RhdGUgPyAnbm9uZScgOiAnJyk7XG5cblx0XHRcdGlmICghc3RhdGUpIHtcblx0XHRcdFx0aWYgKGNsb25lRWwuc3RhdGUpIHtcblx0XHRcdFx0XHRpZiAoc29ydGFibGUub3B0aW9ucy5ncm91cC5yZXZlcnRDbG9uZSkge1xuXHRcdFx0XHRcdFx0cm9vdEVsLmluc2VydEJlZm9yZShjbG9uZUVsLCBuZXh0RWwpO1xuXHRcdFx0XHRcdFx0c29ydGFibGUuX2FuaW1hdGUoZHJhZ0VsLCBjbG9uZUVsKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cm9vdEVsLmluc2VydEJlZm9yZShjbG9uZUVsLCBkcmFnRWwpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRjbG9uZUVsLnN0YXRlID0gc3RhdGU7XG5cdFx0fVxuXHR9XG5cblxuXHRmdW5jdGlvbiBfY2xvc2VzdCgvKipIVE1MRWxlbWVudCovZWwsIC8qKlN0cmluZyovc2VsZWN0b3IsIC8qKkhUTUxFbGVtZW50Ki9jdHgpIHtcblx0XHRpZiAoZWwpIHtcblx0XHRcdGN0eCA9IGN0eCB8fCBkb2N1bWVudDtcblxuXHRcdFx0ZG8ge1xuXHRcdFx0XHRpZiAoKHNlbGVjdG9yID09PSAnPionICYmIGVsLnBhcmVudE5vZGUgPT09IGN0eCkgfHwgX21hdGNoZXMoZWwsIHNlbGVjdG9yKSkge1xuXHRcdFx0XHRcdHJldHVybiBlbDtcblx0XHRcdFx0fVxuXHRcdFx0XHQvKiBqc2hpbnQgYm9zczp0cnVlICovXG5cdFx0XHR9IHdoaWxlIChlbCA9IF9nZXRQYXJlbnRPckhvc3QoZWwpKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cblx0ZnVuY3Rpb24gX2dldFBhcmVudE9ySG9zdChlbCkge1xuXHRcdHZhciBwYXJlbnQgPSBlbC5ob3N0O1xuXG5cdFx0cmV0dXJuIChwYXJlbnQgJiYgcGFyZW50Lm5vZGVUeXBlKSA/IHBhcmVudCA6IGVsLnBhcmVudE5vZGU7XG5cdH1cblxuXG5cdGZ1bmN0aW9uIF9nbG9iYWxEcmFnT3ZlcigvKipFdmVudCovZXZ0KSB7XG5cdFx0aWYgKGV2dC5kYXRhVHJhbnNmZXIpIHtcblx0XHRcdGV2dC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdtb3ZlJztcblx0XHR9XG5cdFx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdH1cblxuXG5cdGZ1bmN0aW9uIF9vbihlbCwgZXZlbnQsIGZuKSB7XG5cdFx0ZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZm4sIGNhcHR1cmVNb2RlKTtcblx0fVxuXG5cblx0ZnVuY3Rpb24gX29mZihlbCwgZXZlbnQsIGZuKSB7XG5cdFx0ZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgZm4sIGNhcHR1cmVNb2RlKTtcblx0fVxuXG5cblx0ZnVuY3Rpb24gX3RvZ2dsZUNsYXNzKGVsLCBuYW1lLCBzdGF0ZSkge1xuXHRcdGlmIChlbCkge1xuXHRcdFx0aWYgKGVsLmNsYXNzTGlzdCkge1xuXHRcdFx0XHRlbC5jbGFzc0xpc3Rbc3RhdGUgPyAnYWRkJyA6ICdyZW1vdmUnXShuYW1lKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR2YXIgY2xhc3NOYW1lID0gKCcgJyArIGVsLmNsYXNzTmFtZSArICcgJykucmVwbGFjZShSX1NQQUNFLCAnICcpLnJlcGxhY2UoJyAnICsgbmFtZSArICcgJywgJyAnKTtcblx0XHRcdFx0ZWwuY2xhc3NOYW1lID0gKGNsYXNzTmFtZSArIChzdGF0ZSA/ICcgJyArIG5hbWUgOiAnJykpLnJlcGxhY2UoUl9TUEFDRSwgJyAnKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXG5cdGZ1bmN0aW9uIF9jc3MoZWwsIHByb3AsIHZhbCkge1xuXHRcdHZhciBzdHlsZSA9IGVsICYmIGVsLnN0eWxlO1xuXG5cdFx0aWYgKHN0eWxlKSB7XG5cdFx0XHRpZiAodmFsID09PSB2b2lkIDApIHtcblx0XHRcdFx0aWYgKGRvY3VtZW50LmRlZmF1bHRWaWV3ICYmIGRvY3VtZW50LmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUpIHtcblx0XHRcdFx0XHR2YWwgPSBkb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKGVsLCAnJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoZWwuY3VycmVudFN0eWxlKSB7XG5cdFx0XHRcdFx0dmFsID0gZWwuY3VycmVudFN0eWxlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHByb3AgPT09IHZvaWQgMCA/IHZhbCA6IHZhbFtwcm9wXTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRpZiAoIShwcm9wIGluIHN0eWxlKSkge1xuXHRcdFx0XHRcdHByb3AgPSAnLXdlYmtpdC0nICsgcHJvcDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHN0eWxlW3Byb3BdID0gdmFsICsgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnID8gJycgOiAncHgnKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXG5cdGZ1bmN0aW9uIF9maW5kKGN0eCwgdGFnTmFtZSwgaXRlcmF0b3IpIHtcblx0XHRpZiAoY3R4KSB7XG5cdFx0XHR2YXIgbGlzdCA9IGN0eC5nZXRFbGVtZW50c0J5VGFnTmFtZSh0YWdOYW1lKSwgaSA9IDAsIG4gPSBsaXN0Lmxlbmd0aDtcblxuXHRcdFx0aWYgKGl0ZXJhdG9yKSB7XG5cdFx0XHRcdGZvciAoOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRcdFx0aXRlcmF0b3IobGlzdFtpXSwgaSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGxpc3Q7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFtdO1xuXHR9XG5cblxuXG5cdGZ1bmN0aW9uIF9kaXNwYXRjaEV2ZW50KHNvcnRhYmxlLCByb290RWwsIG5hbWUsIHRhcmdldEVsLCBmcm9tRWwsIHN0YXJ0SW5kZXgsIG5ld0luZGV4KSB7XG5cdFx0c29ydGFibGUgPSAoc29ydGFibGUgfHwgcm9vdEVsW2V4cGFuZG9dKTtcblxuXHRcdHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKSxcblx0XHRcdG9wdGlvbnMgPSBzb3J0YWJsZS5vcHRpb25zLFxuXHRcdFx0b25OYW1lID0gJ29uJyArIG5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnN1YnN0cigxKTtcblxuXHRcdGV2dC5pbml0RXZlbnQobmFtZSwgdHJ1ZSwgdHJ1ZSk7XG5cblx0XHRldnQudG8gPSByb290RWw7XG5cdFx0ZXZ0LmZyb20gPSBmcm9tRWwgfHwgcm9vdEVsO1xuXHRcdGV2dC5pdGVtID0gdGFyZ2V0RWwgfHwgcm9vdEVsO1xuXHRcdGV2dC5jbG9uZSA9IGNsb25lRWw7XG5cblx0XHRldnQub2xkSW5kZXggPSBzdGFydEluZGV4O1xuXHRcdGV2dC5uZXdJbmRleCA9IG5ld0luZGV4O1xuXG5cdFx0cm9vdEVsLmRpc3BhdGNoRXZlbnQoZXZ0KTtcblxuXHRcdGlmIChvcHRpb25zW29uTmFtZV0pIHtcblx0XHRcdG9wdGlvbnNbb25OYW1lXS5jYWxsKHNvcnRhYmxlLCBldnQpO1xuXHRcdH1cblx0fVxuXG5cblx0ZnVuY3Rpb24gX29uTW92ZShmcm9tRWwsIHRvRWwsIGRyYWdFbCwgZHJhZ1JlY3QsIHRhcmdldEVsLCB0YXJnZXRSZWN0LCBvcmlnaW5hbEV2dCwgd2lsbEluc2VydEFmdGVyKSB7XG5cdFx0dmFyIGV2dCxcblx0XHRcdHNvcnRhYmxlID0gZnJvbUVsW2V4cGFuZG9dLFxuXHRcdFx0b25Nb3ZlRm4gPSBzb3J0YWJsZS5vcHRpb25zLm9uTW92ZSxcblx0XHRcdHJldFZhbDtcblxuXHRcdGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuXHRcdGV2dC5pbml0RXZlbnQoJ21vdmUnLCB0cnVlLCB0cnVlKTtcblxuXHRcdGV2dC50byA9IHRvRWw7XG5cdFx0ZXZ0LmZyb20gPSBmcm9tRWw7XG5cdFx0ZXZ0LmRyYWdnZWQgPSBkcmFnRWw7XG5cdFx0ZXZ0LmRyYWdnZWRSZWN0ID0gZHJhZ1JlY3Q7XG5cdFx0ZXZ0LnJlbGF0ZWQgPSB0YXJnZXRFbCB8fCB0b0VsO1xuXHRcdGV2dC5yZWxhdGVkUmVjdCA9IHRhcmdldFJlY3QgfHwgdG9FbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHRldnQud2lsbEluc2VydEFmdGVyID0gd2lsbEluc2VydEFmdGVyO1xuXG5cdFx0ZnJvbUVsLmRpc3BhdGNoRXZlbnQoZXZ0KTtcblxuXHRcdGlmIChvbk1vdmVGbikge1xuXHRcdFx0cmV0VmFsID0gb25Nb3ZlRm4uY2FsbChzb3J0YWJsZSwgZXZ0LCBvcmlnaW5hbEV2dCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJldFZhbDtcblx0fVxuXG5cblx0ZnVuY3Rpb24gX2Rpc2FibGVEcmFnZ2FibGUoZWwpIHtcblx0XHRlbC5kcmFnZ2FibGUgPSBmYWxzZTtcblx0fVxuXG5cblx0ZnVuY3Rpb24gX3Vuc2lsZW50KCkge1xuXHRcdF9zaWxlbnQgPSBmYWxzZTtcblx0fVxuXG5cblx0LyoqIEByZXR1cm5zIHtIVE1MRWxlbWVudHxmYWxzZX0gKi9cblx0ZnVuY3Rpb24gX2dob3N0SXNMYXN0KGVsLCBldnQpIHtcblx0XHR2YXIgbGFzdEVsID0gZWwubGFzdEVsZW1lbnRDaGlsZCxcblx0XHRcdHJlY3QgPSBsYXN0RWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cblx0XHQvLyA1IOKAlCBtaW4gZGVsdGFcblx0XHQvLyBhYnMg4oCUINC90LXQu9GM0LfRjyDQtNC+0LHQsNCy0LvRj9GC0YwsINCwINGC0L4g0LPQu9GO0LrQuCDQv9GA0Lgg0L3QsNCy0LXQtNC10L3QuNC4INGB0LLQtdGA0YXRg1xuXHRcdHJldHVybiAoZXZ0LmNsaWVudFkgLSAocmVjdC50b3AgKyByZWN0LmhlaWdodCkgPiA1KSB8fFxuXHRcdFx0KGV2dC5jbGllbnRYIC0gKHJlY3QubGVmdCArIHJlY3Qud2lkdGgpID4gNSk7XG5cdH1cblxuXG5cdC8qKlxuXHQgKiBHZW5lcmF0ZSBpZFxuXHQgKiBAcGFyYW0gICB7SFRNTEVsZW1lbnR9IGVsXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9XG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRmdW5jdGlvbiBfZ2VuZXJhdGVJZChlbCkge1xuXHRcdHZhciBzdHIgPSBlbC50YWdOYW1lICsgZWwuY2xhc3NOYW1lICsgZWwuc3JjICsgZWwuaHJlZiArIGVsLnRleHRDb250ZW50LFxuXHRcdFx0aSA9IHN0ci5sZW5ndGgsXG5cdFx0XHRzdW0gPSAwO1xuXG5cdFx0d2hpbGUgKGktLSkge1xuXHRcdFx0c3VtICs9IHN0ci5jaGFyQ29kZUF0KGkpO1xuXHRcdH1cblxuXHRcdHJldHVybiBzdW0udG9TdHJpbmcoMzYpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGluZGV4IG9mIGFuIGVsZW1lbnQgd2l0aGluIGl0cyBwYXJlbnQgZm9yIGEgc2VsZWN0ZWQgc2V0IG9mXG5cdCAqIGVsZW1lbnRzXG5cdCAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbFxuXHQgKiBAcGFyYW0gIHtzZWxlY3Rvcn0gc2VsZWN0b3Jcblx0ICogQHJldHVybiB7bnVtYmVyfVxuXHQgKi9cblx0ZnVuY3Rpb24gX2luZGV4KGVsLCBzZWxlY3Rvcikge1xuXHRcdHZhciBpbmRleCA9IDA7XG5cblx0XHRpZiAoIWVsIHx8ICFlbC5wYXJlbnROb2RlKSB7XG5cdFx0XHRyZXR1cm4gLTE7XG5cdFx0fVxuXG5cdFx0d2hpbGUgKGVsICYmIChlbCA9IGVsLnByZXZpb3VzRWxlbWVudFNpYmxpbmcpKSB7XG5cdFx0XHRpZiAoKGVsLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgIT09ICdURU1QTEFURScpICYmIChzZWxlY3RvciA9PT0gJz4qJyB8fCBfbWF0Y2hlcyhlbCwgc2VsZWN0b3IpKSkge1xuXHRcdFx0XHRpbmRleCsrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBpbmRleDtcblx0fVxuXG5cdGZ1bmN0aW9uIF9tYXRjaGVzKC8qKkhUTUxFbGVtZW50Ki9lbCwgLyoqU3RyaW5nKi9zZWxlY3Rvcikge1xuXHRcdGlmIChlbCkge1xuXHRcdFx0c2VsZWN0b3IgPSBzZWxlY3Rvci5zcGxpdCgnLicpO1xuXG5cdFx0XHR2YXIgdGFnID0gc2VsZWN0b3Iuc2hpZnQoKS50b1VwcGVyQ2FzZSgpLFxuXHRcdFx0XHRyZSA9IG5ldyBSZWdFeHAoJ1xcXFxzKCcgKyBzZWxlY3Rvci5qb2luKCd8JykgKyAnKSg/PVxcXFxzKScsICdnJyk7XG5cblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdCh0YWcgPT09ICcnIHx8IGVsLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgPT0gdGFnKSAmJlxuXHRcdFx0XHQoIXNlbGVjdG9yLmxlbmd0aCB8fCAoKCcgJyArIGVsLmNsYXNzTmFtZSArICcgJykubWF0Y2gocmUpIHx8IFtdKS5sZW5ndGggPT0gc2VsZWN0b3IubGVuZ3RoKVxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRmdW5jdGlvbiBfdGhyb3R0bGUoY2FsbGJhY2ssIG1zKSB7XG5cdFx0dmFyIGFyZ3MsIF90aGlzO1xuXG5cdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmIChhcmdzID09PSB2b2lkIDApIHtcblx0XHRcdFx0YXJncyA9IGFyZ3VtZW50cztcblx0XHRcdFx0X3RoaXMgPSB0aGlzO1xuXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2suY2FsbChfdGhpcywgYXJnc1swXSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGNhbGxiYWNrLmFwcGx5KF90aGlzLCBhcmdzKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRhcmdzID0gdm9pZCAwO1xuXHRcdFx0XHR9LCBtcyk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIF9leHRlbmQoZHN0LCBzcmMpIHtcblx0XHRpZiAoZHN0ICYmIHNyYykge1xuXHRcdFx0Zm9yICh2YXIga2V5IGluIHNyYykge1xuXHRcdFx0XHRpZiAoc3JjLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0XHRcdFx0XHRkc3Rba2V5XSA9IHNyY1trZXldO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRzdDtcblx0fVxuXG5cdGZ1bmN0aW9uIF9jbG9uZShlbCkge1xuXHRcdHJldHVybiAkXG5cdFx0XHQ/ICQoZWwpLmNsb25lKHRydWUpWzBdXG5cdFx0XHQ6IChQb2x5bWVyICYmIFBvbHltZXIuZG9tXG5cdFx0XHRcdD8gUG9seW1lci5kb20oZWwpLmNsb25lTm9kZSh0cnVlKVxuXHRcdFx0XHQ6IGVsLmNsb25lTm9kZSh0cnVlKVxuXHRcdFx0KTtcblx0fVxuXG5cdGZ1bmN0aW9uIF9zYXZlSW5wdXRDaGVja2VkU3RhdGUocm9vdCkge1xuXHRcdHZhciBpbnB1dHMgPSByb290LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbnB1dCcpO1xuXHRcdHZhciBpZHggPSBpbnB1dHMubGVuZ3RoO1xuXG5cdFx0d2hpbGUgKGlkeC0tKSB7XG5cdFx0XHR2YXIgZWwgPSBpbnB1dHNbaWR4XTtcblx0XHRcdGVsLmNoZWNrZWQgJiYgc2F2ZWRJbnB1dENoZWNrZWQucHVzaChlbCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gRml4ZWQgIzk3MzogXG5cdF9vbihkb2N1bWVudCwgJ3RvdWNobW92ZScsIGZ1bmN0aW9uIChldnQpIHtcblx0XHRpZiAoU29ydGFibGUuYWN0aXZlKSB7XG5cdFx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0XHR9XG5cdH0pO1xuXG5cdHRyeSB7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Rlc3QnLCBudWxsLCBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdwYXNzaXZlJywge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGNhcHR1cmVNb2RlID0ge1xuXHRcdFx0XHRcdGNhcHR1cmU6IGZhbHNlLFxuXHRcdFx0XHRcdHBhc3NpdmU6IGZhbHNlXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fSkpO1xuXHR9IGNhdGNoIChlcnIpIHt9XG5cblx0Ly8gRXhwb3J0IHV0aWxzXG5cdFNvcnRhYmxlLnV0aWxzID0ge1xuXHRcdG9uOiBfb24sXG5cdFx0b2ZmOiBfb2ZmLFxuXHRcdGNzczogX2Nzcyxcblx0XHRmaW5kOiBfZmluZCxcblx0XHRpczogZnVuY3Rpb24gKGVsLCBzZWxlY3Rvcikge1xuXHRcdFx0cmV0dXJuICEhX2Nsb3Nlc3QoZWwsIHNlbGVjdG9yLCBlbCk7XG5cdFx0fSxcblx0XHRleHRlbmQ6IF9leHRlbmQsXG5cdFx0dGhyb3R0bGU6IF90aHJvdHRsZSxcblx0XHRjbG9zZXN0OiBfY2xvc2VzdCxcblx0XHR0b2dnbGVDbGFzczogX3RvZ2dsZUNsYXNzLFxuXHRcdGNsb25lOiBfY2xvbmUsXG5cdFx0aW5kZXg6IF9pbmRleFxuXHR9O1xuXG5cblx0LyoqXG5cdCAqIENyZWF0ZSBzb3J0YWJsZSBpbnN0YW5jZVxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAgZWxcblx0ICogQHBhcmFtIHtPYmplY3R9ICAgICAgW29wdGlvbnNdXG5cdCAqL1xuXHRTb3J0YWJsZS5jcmVhdGUgPSBmdW5jdGlvbiAoZWwsIG9wdGlvbnMpIHtcblx0XHRyZXR1cm4gbmV3IFNvcnRhYmxlKGVsLCBvcHRpb25zKTtcblx0fTtcblxuXG5cdC8vIEV4cG9ydFxuXHRTb3J0YWJsZS52ZXJzaW9uID0gJzEuNi4xJztcblx0cmV0dXJuIFNvcnRhYmxlO1xufSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zb3J0YWJsZWpzL1NvcnRhYmxlLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9zb3J0YWJsZWpzL1NvcnRhYmxlLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IFNvcnRhYmxlID0gcmVxdWlyZSgnc29ydGFibGVqcycpO1xyXG5cclxuXHJcbi8qKlxyXG4gKiBNZXRob2RzXHJcbiAqL1xyXG5cclxud2luZG93LmFkbWluX3Bob3RvRGVsZXRhYmxlID0gKGRlbGV0YWJsZSkgPT4ge1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImlucHV0LmRlbGV0ZS1waG90b1wiKS5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgICAgKGRlbGV0YWJsZSkgPyBpdGVtLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKSA6IGl0ZW0uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xyXG4gICAgfSk7XHJcbn1cclxudmFyIGNtc0V2ZW50ID0gbmV3IEV2ZW50KCdDTVNfbG9hZCcpO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0NNU19sb2FkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBTb3J0YWJsZSByZWdpc3RlclxyXG5cclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbc29ydGFibGU9dHJ1ZV1cIikuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KSB7XHJcbiAgICAgICAgbGV0IG9yaWdpbmFsX2xpc3QgPSB7fTtcclxuICAgICAgICBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5waG90by1jb250YWluZXInKS5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBvcmlnaW5hbF9saXN0W2l0ZW0uZGF0YXNldC5waG90b0lkXSA9IGluZGV4ICsgMTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgc29ydCA9IG5ldyBTb3J0YWJsZShlbGVtZW50LCB7XHJcbiAgICAgICAgICAgIGRyYWdnYWJsZTogZWxlbWVudC5kYXRhc2V0LmRyYWdnYWJsZSxcclxuICAgICAgICAgICAgb25FbmQoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBsaXN0ID0ge307XHJcbiAgICAgICAgICAgICAgICBldmVudC50YXJnZXQucXVlcnlTZWxlY3RvckFsbCgnLnBob3RvLWNvbnRhaW5lcicpLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdFtpdGVtLmRhdGFzZXQucGhvdG9JZF0gPSBpbmRleCArIDE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZXZlbnQudGFyZ2V0LmRhdGFzZXQuc29ydGVkRmllbGQpLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnZhbHVlID0gSlNPTi5zdHJpbmdpZnkoW2xpc3QsIG9yaWdpbmFsX2xpc3RdKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfSwgdGhpcyk7XHJcblxyXG59KTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgd2luZG93LmRpc3BhdGNoRXZlbnQoY21zRXZlbnQpO1xyXG59KVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3Jlc291cmNlcy9hc3NldHMvanMvYWRtaW4uanMiXSwic291cmNlUm9vdCI6IiJ9