// Awesome ensues 
var AWESOME = (function (WIN, DOC) {
	var BODY = DOC.body;
	var DOCEL = DOC.documentElement;
	var CANATTACH = typeof BODY.addEventListener === 'function' 
			&& typeof BODY.attachEvent === 'undefined';
	var QUEUE = [];
	var QUEUE_TIMER = null;
	var RXP = {
		ready: /loaded|complete/,
		template: /#{([^}]*)}/g,
		amp: /&/g,
		lt: /</g,
		gt: />/g,
		quote: /"/g,
		apos: /'/g,
		number: '(?:-?\\b(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?(?:[eE][+-]?[0-9]+)?\\b)',
		oneChar: '(?:[^\\0-\\x08\\x0a-\\x1f\"\\\\]|\\\\(?:[\"/\\\\bfnrt]|u[0-9A-Fa-f]{4}))',
		jsonEscapeSeq: /\\\\(?:([^u])|u(.{4}))/g,
	};

	if (!Array.indexOf) {
		Array.prototype.indexOf = function(obj) {
			for(var i = 0; i < this.length; i++) {
				if (this[i] === obj){
					return i;
				}
			}
			return -1;
		};
	}

	return {
		ready: function (fn, ctx) {
			var contentLoaded = 'DOMContentLoaded';
			var ready;
			var timer;
			var onStateChange = function (e) {
				// Mozilla & Opera
				if (e && e.type === contentLoaded) {
					fireDOMReady();
					// Legacy
				} else if (e && e.type === 'load') {
					fireDOMReady();
					// Safari & IE
				} else if (DOC.readyState) {
					if ((RXP.ready).test(DOC.readyState)) {
						fireDOMReady();
						// IE
					} else if (!!DOCEL.doScroll) {
						try {
							ready || DOCEL.doScroll('left');
						} catch (ex) {
							return;
						}
						fireDOMReady();
					}
				}
			};
			var fireDOMReady = function () {
				if (!ready) {
					ready = true;
					// onload function in given context or window object
					fn.call(ctx || WIN);
					// Clean up after the DOM is ready
					if (CANATTACH) 
						DOC.removeEventListener(contentLoaded, onStateChange, false);
					DOC.onreadystatechange = null;
					WIN.onload = null;
					clearInterval(timer);
					timer = null;
				}
			};
			// Mozilla & Opera
			if (CANATTACH) DOC.addEventListener(contentLoaded, onStateChange, false);
			// IE
			DOC.onreadystatechange = onStateChange;
			// Safari & IE
			timer = setInterval(onStateChange, 5);
			// Legacy
			WIN.onload = onStateChange;
		},
		log: function (data, type) {
			if (typeof console === 'undefined') return;
			type = type || 'log'
			if (this.isUndefined(console)) return;
			console[type](data);
		},
		noop: function() {},
		cancelEvent: function (event) {
			event = event || WIN.event;
			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
		},
		cancelPropagation: function (event) {
			event = event || WIN.event;
			if (event.stopPropagation) {
				event.stopPropagation();
			} else {
				event.cancelBubble = true;
			}
		},
		bind: function (obj, type, handler, capture) {
			if (this.isNullOrUndefined(obj)) return;
			capture = capture || false; // bubble
			obj = this.toArray(obj);
			var i = obj.length;
			while (i--) {
				if (CANATTACH) {
					obj[i].addEventListener(type, handler, capture);
				} else if (obj[i].attachEvent) {
					obj[i].attachEvent('on'+ type, handler);
				} else {
					obj[i]['on'+ type] = handler;
				}
			}
		},
		unbind: function (obj, type, handler, capture) {
			if (this.isNullOrUndefined(obj)) return;
			capture = capture || false;
			obj = this.toArray(obj);
			var i = obj.length;
			while (i--) {
				if (CANATTACH) {
					obj[i].removeEventListener(type, handler, capture);
				} else if (obj[i].detachEvent) {
					obj[i].detachEvent('on'+ type, handler);
				} else {
					obj[i]['on'+ type] = null;
				}
			}
		},
		fire: function(obj, ev, capture, cancelable) {
			var evt;
			if (DOC.createEventObject) { // ie
				evt = DOC.createEventObject();
				return obj.fireEvent('on'+ ev, evt);
			}
			capture = capture || false;
			cancelable = cancelable || true;
			evt = DOC.createEvent('HTMLEvents');
			evt.initEvent(ev, capture, cancelable);
			return !obj.dispatchEvent(evt);
		},
		hover: function (obj, over, out, capture) {
			if (this.isUndefined(obj)) {return;}
			var $this = this;
			out = out || null;
			$this.bind(obj, 'mouseover', over, capture);
			if (out) 
				$this.bind(obj, 'mouseout', out, capture);
		},
		toArray: function(obj) {
			if (!this.isArray(obj)) {
				obj = [obj];	
			}
			return obj;
		},
		isObject: function(val) {
			return typeof val === 'object';	
		},
		isArray: function(val) {
			return this.isObject(val) && !this.isUndefined(val.length);
		},
		isString: function() {
			return typeof val === 'string';	
		},
		isUndefined: function(val) {
			return typeof val === 'undefined';	
		},
		isNull: function(val) {
			return typeof val === 'null';	
		},
		isNullOrUndefined: function(val) {
			return this.isNull(val) || this.isUndefined(val);	
		},
		hasClass: function (el, cls) {
			var re = el.className.split(' ');
			if (this.isUndefined(re)) { return false; }
			return -1 !== re.indexOf(cls);
		},
		addClass: function (el, cls) {
			if (!this.hasClass(el, cls)) el.className += ' '+ cls;
		},
		removeClass: function (el, cls) {
			if (!this.hasClass(el, cls)) return;
			var re = el.className.split(' ');
			if (this.isUndefined(re)) return;
			re.splice(re.indexOf(cls), 1);
			var i = re.length;
			el.className = ''; // empty
			while (i--) { // reload
				el.className += re[i] +' ';
			}
		},
		getId: function (id) {
			return DOC.getElementById(id);
		},
		getTag: function (tag, context) {
			context = context || DOC;
			tag = tag || '*';
			return context.getElementsByTagName(tag);
		},
		getClass: function (searchClass, context, tag) {
			var classElements = [];
			var els = this.getTag(tag, context);
			var elsLen = els.length;
			var pattern = new RegExp('^|\\s' + searchClass + '\\s|$');
			for (var i = 0, j = 0; i < elsLen; ++i) {
				if (pattern.test(els[i].className)) {
					classElements[j] = els[i];
					j++;
				}
			}
			return classElements;
		},
		is: function(el, type) {
			if (this.isUndefined(type)) return el.nodeName;
			return el.nodeName === type.toUpperCase();
		},
		toCamelCase: function (string) {
			var strs = string.split('-');
			if (strs.length === 1) return strs[0];

			var ccstr = string.indexOf('-') === 0 
				? strs[0].charAt(0).toUpperCase() + strs[0].substring(1) 
				: strs[0];

			for (var i = 1, len = strs.length; i < len; ++i) {
				var s = strs[i];
				ccstr += s.charAt(0).toUpperCase() + s.substring(1);
			}
			return ccstr;
		},
		style: function (el, prop, newVal) {
			if (!this.isUndefined(el))
			if (this.isUndefined(prop)) {
				return el.currentStyle || getComputedStyle(el, null);	
			} else {
				prop = this.toCamelCase(prop);
				newVal = newVal || null;
				if (newVal) {
					if (prop === 'opacity') {
						el.style.filter = "alpha(opacity=" + newVal * 100 + ")";
						el.style.opacity = newVal;
					} else {
						prop = this.toCamelCase(prop);
						el.style[prop] = newVal;
					}
				} else {
					var view = DOC.defaultView;
					if (view && view.getComputedStyle) {
						return view.getComputedStyle(el, '')[prop] || null;
					} else {
						if (prop === 'opacity') {
							if (el['filters'].length <= 0) {
								el.style.filter = 'alpha(opacity = 100)';
							}
							var opacity = el['filters']('alpha').opacity; 
							return isNaN(opacity) ? 1 : (opacity ? opacity / 100 : 0);
						}
						return el.currentStyle[prop] || null;
					}
				}
			}
		},
		getPosition: function(obj) {
			if (!obj) return;
			var curLeft = 0;
			var curTop = 0;
			do {
				curLeft += obj.offsetLeft;
				curTop += obj.offsetTop;
			} while (obj = obj.offsetParent);
			return {
				top: curTop,
				left: curLeft
			};
		},
		getMousePosition: function(event, relativeTo) {
			var x = event.pageX;
			var y = event.pageY;
			if (this.isNull(x) && !this.isNull(event.clientX)) {
				var xScroll = (DOCEL && DOCEL.scrollLeft || BODY && BODY.scrollLeft || 0);
				var xClient = (DOCEL && DOCEL.clientLeft || BODY && BODY.clientLeft || 0);
				var yScroll = (DOCEL && DOCEL.scrollTop || BODY && BODY.scrollTop || 0);
				var yClient = (DOCEL && DOCEL.clientTop || BODY && BODY.clientTop || 0);
				x = event.clientX + xScroll - xClient;
				y = event.clientY + yScroll - yClient;
			}
			if (!this.isNullOrUndefined(relativeTo)) {
				var tar = (typeof relativeTo === 'object') ? relativeTo : event.target;
				var tarPos = this.getPosition(tar);
				x = x - tarPos.left;
				y = y - tarPos.top;
			}
			return {
				x: x,
				y: y
			};
		},
		getScrollPosition: function() {
			if (!this.isUndefined(WIN.pageYOffset)) {
				return WIN.pageYOffset;
			}
			return DOCEL.scrollTop;
		},
		docHeight: function () {
			return Math.max(
				Math.max(BODY.scrollHeight, DOCEL.scrollHeight),
				Math.max(BODY.offsetHeight, DOCEL.offsetHeight),
				Math.max(BODY.clientHeight, DOCEL.clientHeight)
			);
		},
		docWidth: function () {
			return Math.max(BODY.clientWidth, DOCEL.clientWidth);
		},
		viewportHeight: function () {
			if (!this.isUndefined(WIN.innerHeight)) {
				return WIN.innerHeight;
			} else if (!this.isUndefined(DOCEL)
						&& !this.isUndefined(DOCEL.clientHeight)
						&& DOCEL.clientHeight) { //ie6
				return DOCEL.clientHeight;	
			}
			return BODY.clientHeight;
		},
		viewportWidth: function () {
			if (!this.isUndefined(WIN.innerWidth)) {
				return WIN.innerWidth;
			} else if (!this.isUndefined(DOCEL)
						&& !this.isUndefined(DOCEL.clientWidth)
						&& DOCEL.clientWidth) { //ie6
				return DOCEL.clientWidth;	
			}
			return BODY.clientWidth;
		},
		attr: function (ele, attr, newVal) {
			newVal = newVal || null;
			if (newVal) {
				ele.setAttribute(attr, newVal);
			} else {
				var attrs = ele.attributes,
					attrsLen = attrs.length,
					result = ele.getAttribute(attr) || ele[attr] || null;

				if (!result) {
					while (attrsLen--) {
						if (attr[attrsLen].nodeName === attr)
							result = attr[i].nodeValue;
					}
				}
				return result;
			}
		},
		template: function(template, obj){
			var cache = {};
			var strCache = template;
			var matches = 0;
			template.replace(RXP.template, function(tmpl, val) { // #{oKey}
				cache[tmpl] = val;
			});
			for (var key in cache) {
				strCache = strCache.replace(new RegExp(key, 'g'), obj[cache[key]]);
			}
			return strCache;
		},
		html: function(obj, str, coerce, coercePar) {
			coerse = coerce || false;
			if (coerce) {
				var temp = obj.ownerDocument.createElement('DIV');
				temp.innerHTML = '<'+ coercePar +'>'+ str +'</'+ coercePar +'>';
				this.swap(temp.firstChild.firstChild, obj);
			} else {
				obj.innerHTML = str;	
			}
		},
		encodeHTML: function (str) {
			return str.replace(RXP.amp, '&amp;')
				.replace(RXP.lt, '&lt;')
				.replace(RXP.gt, '&gt;')
				.replace(RXP.quote, '&quot;')
				.replace(RXP.apos, '&apos;');
		},
		stripHTML: function (str) {
			return str.replace(/<.*?>/g,'');
		},
		text: function (obj, txt) {
			if (this.isUndefined(obj)) return;
			if (txt) {
				if (!this.isUndefined(obj.innerText)) {
					obj.innerText = txt;
				}
				obj.textContent = txt;
				return;
			}
			return obj.innerText || obj.textContent || obj.text;
		},
		plural: function(count, singular, plural) {
			return count === 1 ? singular : plural;	
		},
		trim: function (str) {
			return str.replace(/^\s+|\s+$/g);
		},
		prepend: function (newNode, node) {
			node.insertBefore(this.toNode(newNode), node.childNodes[0]);
		},
		append: function (newNode, node) {
			node.appendChild(this.toNode(newNode));
		},
		before: function (newNode, node) {
			//if (node.parentNode === BODY) {
				//this.prepend(this.toNode(newNode), BODY);
				//return;
			//}
			node.parentNode.insertBefore(this.toNode(newNode), node);
		},
		after: function (newNode, node) {
			node.parentNode.insertBefore(this.toNode(newNode), node.nextSibling);
		},
		swap: function (a, b) {
			a.parentNode.replaceChild(b, a);
		},
		remove: function (ele, recursive) {
			if (!ele) return false;
			recursive = recursive || true;
			ele = this.toArray(ele);
			var i = ele.length;
			while (i--) {
				if (!this.isUndefined(ele[i].parentNode)) {
					if (recursive) {
						this.destroy(ele[i]);
						continue;
					}
					ele[i].parentNode.removeChild(ele[i]);
				}
			}
		},
		destroy: function(el) {
			if (this.isUndefined(el)) return;
			var trash = this.create('DIV');
			trash.appendChild(el);
			trash.innerHTML = '';
		},
		toNode: function(text) {
			if (!this.isString(text)) return text;
			return this.create(text);
		},
		create: function (tag) {
			return DOC.createElement(tag.toUpperCase());
		},
		frag: function(str) {
			var frag = DOC.createDocumentFragment();	
			var temp = this.create('DIV');
			temp.innerHTML = str;
			while (temp.firstChild) {
				frag.appendChild(temp.firstChild);	
			}
			return frag;
		},
		// Execution Queue
		queue: function(fn, time) {
			var timer = function(time) {
				QUEUE_TIMER = setTimeout(function() {
					fn();
				}, time || 2);
			};
		},
		clearQueue: function() {
			clearTimeout(QUEUE_TIMER);
			QUEUE = [];	
		},
		// Cookies
		createCookie: function (name, value, days, domain) {
			var expires = '';
			var cookie;
			domain = domain || WIN.location.host;
			if (days) {
				var date = new Date();
				date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
				expires = '; expires=' + date.toGMTString();
			}
			cookie = name + '=' + value + expires + ';';
			if (domain) {
				cookie += ' domain=.'+ domain +' ;';
			}
			if (path) {
				cookie += 'path='+ path;
			}
			DOC.cookie =  cookie;
		},
		eraseCookie: function (name) {
			this.createCookie(name, '', -1);
		},
		readCookie: function (c_name) {
			if (DOC.cookie.length) {
				var c_start = DOC.cookie.indexOf(c_name + "=");
				if (c_start !== -1) {
					c_start = c_start + c_name.length + 1;
					var c_end = DOC.cookie.indexOf(";", c_start);
					if (c_end === -1) {
						c_end = DOC.cookie.length;
					}
					return unescape(DOC.cookie.substring(c_start, c_end));
				}
			}
			return null;
		},
		// Math
		getMax: function (array) {
			var m = Math;
			return m.max.apply(m, array);
		},
		getMin: function (array) {
			var m = Math;
			return m.min.apply(m, array);
		},
		getRandom: function(min, max) {
			var m = Math;
			if (min) {
				return m.floor(m.random() * (max - min + 1)) + min;
			} else {
				return m.round(m.random()); // 1 or 0
			}
		},
		inArray: function(obj, arr) {
			var i = arr.length;
			while (i--) {
				if (arr[i] === obj) {
					return true;
				}
			}
			return false;
		},
		isDescendant: function(p, c) {
			var node = c.parentNode;
			while (!this.isNull(node)) {
				if (node === p) {
					return true;
				}
				node = node.parentNode;
			}
			return false;
		},
		sort: function(options) {
			options = this.setDefaults({
				arr: [],
				type: 'alphabetical',
				order: 'desc',
				property: null,
				method: null
			}, options);

			var $this = this;
			var method;
			switch(options.type) {
				case 'alphabetical':
					method = function(a, b) {
						var A = a.toLowerCase();
						var B = b.toLowerCase();
						if (options.order === 'asc') {
							if (A < B) { return -1; }
							else if (A > B) { return  1; }
							else { return 0; }
						} else {
							if (A > B) { return -1; }
							else if (A < B) { return  1; }
							else { return 0; }
						}
					};
				break;
				case 'numerical':
					if (options.order === 'asc') {
						method = function(a, b) { return a - b; };
					} else {
						method = function(a, b) { return b - a; };	
					}
				break;
				case 'random':
					method = function() {
						return Math.round(Math.random()) - 0.5;
					};
				break;
			}
			return options.arr.sort(method);
		},
		animate: function (el, options) {
			var $this = this;
			options = this.setDefaults({
				property: 'width',
				from: $this.style(el, options.property),
				to: '0px',
				duration: 200,
				easing: function(pos) {
					return (-Math.cos(pos * Math.PI) / 2) + 0.5; 
				},
				callback: $this.noop
			}, options);

			var fromNum = parseFloat(options.from);
			var fromUnit = getUnit(options.from);

			var toNum = parseFloat(options.to);
			var toUnit = getUnit(options.to) || fromUnit;

			var interval;
			var start = +new Date();
			var finish = start + options.duration;

			function interpolate(source, target, pos) {
				return (source + (target - source) * pos).toFixed(3);	
			}
			
			function getUnit(prop){
				return prop.toString().replace(/^[\-\d\.]+/,'') || '';
			}

			interval = setInterval(function() {
				var time = +new Date();
				var pos = time > finish ? 1 : (time-start) / options.duration;
				var interpolation = interpolate(fromNum, toNum, options.easing(pos));
				$this.style(el, options.property, interpolation + toUnit);
				if (time > finish) {
					clearInterval(interval);
					options.callback();
				}
			}, 10);
		},
		fadeIn: function(el, duration, callback) {
			this.fade(el, duration, 1, callback);
		},
		fadeOut: function(el, duration, callback) {
			this.fade(el, duration, 0, callback);
		},
		fade: function(el, duration, to, callback) {
			callback = callback || this.noop;
			this.animate(el, {
				property: 'opacity',
				to: to,
				duration: duration,
				callback: callback
			});
		},
		// Ajax
		getUrlVars: function () {
			var vars = [];
			var hash;
			var hashes = WIN.location.href.slice(WIN.location.href.indexOf('?') + 1).split('&');
			var hashlen = hashes.length;
			for (var i = 0; i < hashlen; ++i) {
				hash = hashes[i].split('=');
				vars.push(hash[0]);
				vars[hash[0]] = hash[1];
			}
			return vars;
		},
		serialize: function(obj) {
			var viableNodes = ['input', 'select', 'textarea'];
			var viableNodesLen = viableNodes.length;
			var rawChildren = [];
			var formChildren = [];
			var returnObject = {};
			var nodeList = [];
			for (var i = 0; i < viableNodesLen; ++i) {
				nodeList = obj.getElementsByTagName(viableNodes[i]);
				var nodeListLen = nodeList.length;
				for (var j = 0; j < nodeListLen; ++j) {
					rawChildren.push(nodeList[j]);
				}
			}
			// build list of viable form elements
			var rawChildrenLen = rawChildren.length;
			for (var k = 0; k < rawChildrenLen; ++k) {
				var currentNode = rawChildren[k];
				switch(rawChildren[k].nodeName.toLowerCase()) {
					case 'input':
						switch(currentNode.type) {
							case 'text':
							case 'hidden':
							case 'password':
								formChildren.push(currentNode);
							break;
							case 'radio':
							case 'checkbox':
								if (currentNode.checked) {
									formChildren.push(currentNode);
								}
							break;
						}
					break;
					case 'select':
					case 'textarea':
						formChildren.push(currentNode);
					break;
				}
			}
			//build object of the name-value pairs
			var formChildrenLen = formChildren.length;
			for (var m = 0; m < formChildrenLen; ++m) {
				var currentChild = formChildren[m];
				if (!returnObject.hasOwnProperty(currentChild.name)) {
					returnObject[currentChild.name] = currentChild.value;
				} else {
					if (typeof returnObject[currentChild.name] === 'string') {
						returnObject[currentChild.name] = [returnObject[currentChild.name], currentChild.value.toString()];	
					} else {
						returnObject[currentChild.name].push(currentChild.value.toString());
					}
				}
			}
			return returnObject;
		},
		formatParams: function (obj) {
			if (this.isNull(obj)) {return '';}
			var q = [];
			var encode = encodeURIComponent;
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					q.push( encode(prop) +'='+ encode(obj[prop]) );
				}
			}
			return q.join('&');
		},
		setDefaults: function(defaults, options) {
			if (!options) {
				options = defaults;
			} else {
				for (var index in defaults) {
					if (this.isUndefined(options[index])) {
						options[index] = defaults[index];
					}
				}
			}
			return options;
		},
		parse: function(str, type) {
			if (str === '') return;
			type = type || 'json';	
			var result;
			switch (type.toLowerCase()) {
				case 'xml':
					if (WIN.DOMParser) {
						var parser = new DOMParser();
						return parser.parseFromString(str, 'text/xml');
					} else { // ie
						var xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
						xmlDoc.async = 'false';
						xmlDoc.loadXML(str);
						return xmlDoc;
					}
				break;
				case 'json':
					if (JSON.parse) {
						return JSON.parse(str);
					}
					var string = '(?:\"' + RXP.oneChar + '*\")';
					var jsonToken = new RegExp(
							'(?:false|true|null|[\\{\\}\\[\\]]'
								+ '|' + RXP.number
								+ '|' + string
								+ ')', 'g');
					var escapes = {
						'"': '"',
						'/': '/',
						'\\': '\\',
						'b': '\b',
						'f': '\f',
						'n': '\n',
						'r': '\r',
						't': '\t'
					};
					function unescapeOne(_, ch, hex) {
						return ch ? escapes[ch] : String.fromCharCode(parseInt(hex, 16));
					}

					var toks = str.match(jsonToken);
					var tok = toks[0];
					var topLevelPrimitive = false;
					if ('{' === tok) {
						result = {};
					} else if ('[' === tok) {
						result = [];
					} else {
						result = [];
						topLevelPrimitive = true;
					}
					var key;
					var stack = [result];
					for (var i = 1 - topLevelPrimitive, n = toks.length; i < n; ++i) {
						tok = toks[i];
						var cont;
						switch (tok.charCodeAt(0)) {
							case 0x22:  // '"'
								tok = tok.substring(1, tok.length - 1);
								if (tok.indexOf('\\') !== -1) {
									tok = tok.replace(RXP.jsonEscapeSeq, unescapeOne);
								}
								cont = stack[0];
								if (!key) {
									if (cont instanceof Array) {
										key = cont.length;
									} else {
										key = tok || '';  // Use as key for next value seen.
										break;
									}
								}
								cont[key] = tok;
								key = void 0;
								break;
							case 0x5b:  // '['
								cont = stack[0];
								stack.unshift(cont[key || cont.length] = []);
								key = void 0;
								break;
							case 0x5d:  // ']'
								stack.shift();
								break;
							case 0x66:  // 'f'
								cont = stack[0];
								cont[key || cont.length] = false;
								key = void 0;
								break;
							case 0x6e:  // 'n'
								cont = stack[0];
								cont[key || cont.length] = null;
								key = void 0;
								break;
							case 0x74:  // 't'
								cont = stack[0];
								cont[key || cont.length] = true;
								key = void 0;
								break;
							case 0x7b:  // '{'
								cont = stack[0];
								stack.unshift(cont[key || cont.length] = {});
								key = void 0;
								break;
							case 0x7d:  // '}'
								stack.shift();
								break;
							default:  // sign or digit
								cont = stack[0];
								cont[key || cont.length] = +(tok);
								key = void 0;
								break;
						}
					}
					if (topLevelPrimitive) {
						if (stack.length !== 1) { throw new Error(); }
						result = result[0];
					} else {
						if (stack.length) { throw new Error(); }
					}
				break;
			}
			return result;
		},
		addScript: function(url, id) {
			var $this = this;
			var script = this.create('script');	
			script.type = 'text/javascript';
			script.src = url || '#';
			script.id = id || 'awesome-script'; // id to remove 
			this.append(script, $this.getTag('head')[0]);
			return true;
		},
		ajax: function(options) {
			var $this = this;
			options = this.setDefaults({
				url:          null,
				data:         null, // key:val
				dataType:     null,
				type:         'post',
				disguise:     false,
				requestId:    null,
				beforeSend:   $this.noop,
				sendPrepared: $this.noop,
				afterSend:    $this.noop,
				complete:     $this.noop,
				failure:      $this.noop
			}, options);
			var MSxml = 'Msxml2.XMLHTTP';

			// init
			switch (options.type.toUpperCase()) {
				case 'POST':
					this.postRequest(options);
				break;
				case 'JSONP':
					this.addScript(options.url, options.requestId || 'awesome-jsonp');
				break;
				default:
					this.getRequest(options);
			}
		},
		openRequest: function(options, method) {
			var req = this.getHttpRequest();
			if (this.isNull(req)) return;
			var $this = this;
			var d = new Date();
			var aborted = 'abort';
			
			req.open(method, options.url, true);
			
			if (method === 'POST') {
				req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			}
			if (!options.disguise) {
				req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			}
			req.setRequestHeader('X-Request-Id', d.getTime());
			
			req.onreadystatechange = function(e) {
				var data = '';

				switch (req.readyState) {
					case 0:
						options.beforeSend();
					break;
					case 1:
						options.sendPrepared();
					break;
					case 2:
						options.afterSend();
					break;
					case 4:

						if (!$this.isNull(options.dataType)) {
							try {
								data = $this.parse(req.responseText, options.dataType);
							} catch (erD) { data = aborted; }
						} else {
							try {
								data = req.responseText;
							} catch (erT) { data = aborted; }
						}

						if (data !== aborted && req.status >= 200 && req.status < 300) {
							options.complete(data);	
						} else if (data !== aborted && req.status === 0) { // file:/// ajax
							options.complete(data);
						} else {
							options.failure(data);
						}
					break;
				}
			};
			return req;
		},
		postRequest: function(options) {
			var req = this.openRequest(options, 'POST');
			req.send(this.formatParams(options.data));
			return req;
		},
		getRequest: function(options) {
			var req = this.openRequest(options, 'GET');
			req.send('');
			return req;
		},
		getHttpRequest: function() {
			if (typeof XMLHttpRequest !== 'undefined')
				return new XMLHttpRequest();
			try {
				return new ActiveXObject(MSxml +'.6.0');
			} catch(e1) {}
			try {
				return new ActiveXObject(MSxml +'.3.0');
			} catch(e2) {}
			try {
				return new ActiveXObject(MSxml);
			} catch(e3) {}
			try {
				return new ActiveXObject('Microsoft.XMLHTTP');
			} catch(e4) {}
		}
	};
}(window, document));
