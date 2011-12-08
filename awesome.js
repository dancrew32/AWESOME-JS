// Awesome ensues 
var AWESOME = (function (WIN, DOC) {
	var BODY = DOC.body;
	var DOCEL = DOC.documentElement;
	var canAttach = typeof BODY.addEventListener === undefined;

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
					if ((/loaded|complete/).test(DOC.readyState)) {
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
					if (canAttach) 
						DOC.removeEventListener(contentLoaded, onStateChange, false);
					DOC.onreadystatechange = null;
					WIN.onload = null;
					clearInterval(timer);
					timer = null;
				}
			};
			// Mozilla & Opera
			if (canAttach) 
				DOC.addEventListener(contentLoaded, onStateChange, false);
			// IE
			DOC.onreadystatechange = onStateChange;
			// Safari & IE
			timer = setInterval(onStateChange, 5);
			// Legacy
			WIN.onload = onStateChange;
		},
		log: function (data) {
			if (!this.isUndefined(console)) {
				console.log(data);
			}
		},
		cancelEvent: function (event) {
			event = event || WIN.event;
			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
		},
		cancelPropagation: function (event) {
			if (event.stopPropagation) {
				event.stopPropagation();
			} else {
				event.cancelBubble = true;
			}
		},
		bind: function (obj, type, handler, delegate) {
			if (this.isUndefined(obj) || this.isNull(obj)) {return;}
			delegate = delegate || false;
			if (this.isUndefined(obj.length)) {
				obj = [obj];	
			}
			var i = obj.length;
			while (i--) {
				if (canAttach) {
					obj[i].addEventListener(type, handler, delegate); // false: bubble (^). true: capture (v).
				} else if (obj.attachEvent) {
					obj[i].attachEvent('on' + type, handler);
				} else {
					obj[i]['on' + type] = handler;
				}
			}
		},
		unbind: function (obj, type, handler, delegate) {
			if (this.isUndefined(obj) || this.isNull(obj)) {return;}
			delegate = delegate || false;
			if (this.isUndefined(obj.length)) {
				obj = [obj];	
			}
			var i = obj.length;
			while (i--) {
				if (canAttach) {
					obj[i].removeEventListener(type, handler, delegate);
				} else if (obj[i].detachEvent) {
					obj[i].detachEvent('on' + type, handler);
				} else {
					obj[i]['on' + type] = null;
				}
			}
		},
		fire: function(obj, ev, delegate, cancelable) {
			var evt;
			if (DOC.createEventObject) { // ie
				evt = DOC.createEventObject();
				return obj.fireEvent('on'+ ev, evt);
			}
			delegate = delegate || false;
			cancelable = cancelable || true;
			evt = DOC.createEvent('HTMLEvents');
			evt.initEvent(ev, delegate, cancelable);
			return !obj.dispatchEvent(evt);
		},
		hover: function (obj, over, out, delegate) {
			if (this.isUndefined(obj)) {return;}
			var $this = this;
			out = out || null;
			$this.bind(obj, 'mouseover', over, delegate);
			if (out) 
				$this.bind(obj, 'mouseout', out, delegate);
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
			if (this.isUndefined(re)) { return false; }
			return -1 !== re.indexOf(cls);
		},
		addClass: function (el, cls) {
			if (!this.hasClass(el, cls)) 
				el.className += ' '+ cls;
		},
		removeClass: function (el, cls) {
			if (!this.hasClass(el, cls)) return;
			var re = el.className.split(' ');
			if (this.isUndefined(re)) return;
			re.splice(re.indexOf(cls), 1);
			var i = re.length;
			el.className = ''; // empty
			while(i--) { // reload
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
			var pattern = new RegExp('(^|\\s)' + searchClass + '(\\s|$)');
			for (var i = 0, j = 0; i < elsLen; ++i) {
				if (pattern.test(els[i].className)) {
					classElements[j] = els[i];
					j++;
				}
			}
			return classElements;
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
		encodeHTML: function (str) {
			return str.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;');
		},
		stripHTML: function (str) {
			return str.replace(/<.*?>/g,'');
		},
		text: function (obj, txt) {
			if (!this.isUndefined(obj)) {
				if (txt) {
					if (!this.isUndefined(obj.innerText)) {
						obj.innerText = txt;
					}
					obj.textContent = txt;
				} else {
					return obj.innerText || obj.textContent;
				}
			}
		},
		plural: function(count, singular, plural) {
			return count === 1 ? singular : plural;	
		},
		trim: function (str) {
			return str.replace(/^\s+|\s+$/g);
		},
		prepend: function (newNode, node) {
			node.insertBefore(newNode, node.childNodes[0]);
		},
		append: function (newNode, node) {
			node.appendChild(newNode);
		},
		before: function (newNode, node) {
			node.parentNode.insertBefore(newNode, node);
		},
		after: function (newNode, node) {
			node.parentNode.insertBefore(newNode, node.nextSibling);
		},
		swap: function (a, b) {
			a.parentNode.replaceChild(b, a);
		},
		remove: function (ele, recursive) {
			if (!ele) return false;
			if (!('length' in ele)) {
				ele = [ele];
			}
			var i = ele.length;
			recursive = recursive || true;
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
		create: function (tag) {
			return DOC.createElement(tag);
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
				callback: function() {}
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
		fade: function(el, duraction, to, callback) {
			callback = callback || function() {};
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
						result = parser.parseFromString(str, 'text/xml');
					} else { // ie
						var xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
						xmlDoc.async = 'false';
						result = xmlDoc.loadXML(str); }
				break;
				case 'json':
					if (JSON.parse) {
						return JSON.parse(str);
					}
					var number = '(?:-?\\b(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?(?:[eE][+-]?[0-9]+)?\\b)';
					var oneChar = '(?:[^\\0-\\x08\\x0a-\\x1f\"\\\\]'
							+ '|\\\\(?:[\"/\\\\bfnrt]|u[0-9A-Fa-f]{4}))';
					var string = '(?:\"' + oneChar + '*\")';
					var jsonToken = new RegExp(
							'(?:false|true|null|[\\{\\}\\[\\]]'
								+ '|' + number
								+ '|' + string
								+ ')', 'g');
					var escapeSequence = new RegExp('\\\\(?:([^u])|u(.{4}))', 'g');
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
					var EMPTY_STRING = '';
					var SLASH = '\\';
					var firstTokenCtors = { '{': Object, '[': Array };
					var hop = Object.hasOwnProperty;

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
								if (tok.indexOf(SLASH) !== -1) {
									tok = tok.replace(escapeSequence, unescapeOne);
								}
								cont = stack[0];
								if (!key) {
									if (cont instanceof Array) {
										key = cont.length;
									} else {
										key = tok || EMPTY_STRING;  // Use as key for next value seen.
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
			options = this.setDefaults({
				url:          null,
				data:         null, // key:val
				dataType:     null,
				type:         'post',
				disguise:     false,
				requestId:    null,
				beforeSend:   function() {},
				sendPrepared: function() {},
				afterSend:    function() {},
				preComplete:  function() {},
				complete:     function() {},
				failure:      function() {}
			}, options);
			var $this = this;
			var MSxml = 'Msxml2.XMLHTTP';

			// init
			switch (options.type.toUpperCase()) {
				case 'POST':
					post(options.url, options.data);
				break;
				case 'JSONP':
					this.addScript(options.url, options.requestId || 'awesome-jsonp');
				break;
				default:
					get(options.url, options.data);
			}
			
			//private
			function open(method, url) {
				var req = getRequest();
				if ($this.isNull(req)) {return;}
				var d = new Date();
				
				req.open(method, url, true);
				
				if (method === 'POST') {
					req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				}
				if (!options.disguise) {
					req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				}
				req.setRequestHeader("X-Request-Id", d.getTime());
				
				req.onreadystatechange = function(e) {
					var data = req;
					if (!$this.isNull(options.dataType)) {
						switch (options.dataType) {
							case 'text':
								data = req.responseText;
							break;
							default:
								data = $this.parse(req.responseText, options.dataType);
						}
					}

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
						case 3:
							options.preComplete(data);
						break;
						case 4:
							if (req.status >= 200 && req.status < 300) {
								options.complete(data);	
							} else if (req.status === 0) { // file:/// ajax
								options.complete(data);
							} else {
								options.failure(data);
							}
						break;
					}
				};
				return req;
			}
			
			function get(url, data) {
				var req = open('GET', url + $this.formatParams(options.data));
				req.send('');
				return req;
			}
			
			function post(url, data) {
				var req = open('POST', url);
				req.send($this.formatParams(options.data));
				return req;
			}

			function getRequest() {
				if (!$this.isUndefined(XMLHttpRequest))
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
		}
	};
}(window, document));
