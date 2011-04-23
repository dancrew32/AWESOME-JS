// Awesome ensues 
var AWESOME = (function () {
	return {
		ready: function (fn, ctx) {
			var ready, timer,
				onStateChange = function (e) {
				// Mozilla & Opera
				if (e && e.type === 'DOMContentLoaded') {
					fireDOMReady();
					// Legacy
				} else if (e && e.type === 'load') {
					fireDOMReady();
					// Safari & IE
				} else if (document.readyState) {
					if ((/loaded|complete/).test(document.readyState)) {
						fireDOMReady();
						// IE, courtesy of Diego Perini (http://javascript.nwbox.com/IEContentLoaded/)
					} else if ( !! document.documentElement.doScroll) {
						try {
							ready || document.documentElement.doScroll('left');
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
					// Call the onload function in given context or window object
					fn.call(ctx || window);
					// Clean up after the DOM is ready
					if (document.removeEventListener) 
						document.removeEventListener('DOMContentLoaded', onStateChange, false);
						document.onreadystatechange = null;
						window.onload = null;
						clearInterval(timer);
						timer = null;
				}
			};
			// Mozilla & Opera
			if (document.addEventListener) 
				document.addEventListener('DOMContentLoaded', onStateChange, false);
				// IE
				document.onreadystatechange = onStateChange;
				// Safari & IE
				timer = setInterval(onStateChange, 5);
				// Legacy
				window.onload = onStateChange;
		},
		log: function (data) {
			if (typeof console !== 'undefined') {
				console.log(data);
			}
		},
		cancelEvent: function (event) {
			event = event || window.event;
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
			if (typeof obj === 'undefined' || obj === null) {return;}
			delegate = delegate || false;
			if (typeof obj.length === 'undefined') {
				obj = [obj];	
			}
			var i = obj.length;
			while (i--) {
				if (obj[i].addEventListener) {
					obj[i].addEventListener(type, handler, delegate); // false: bubble (^). true: capture (v).
				} else if (obj.attachEvent) {
					obj[i].attachEvent('on' + type, handler);
				} else {
					obj[i]['on' + type] = handler;
				}
			}
		},
		unbind: function (obj, type, handler, delegate) {
			if (typeof obj === 'undefined' || obj === null) {return;}
			delegate = delegate || false;
			if (typeof obj.length === 'undefined') {
				obj = [obj];	
			}
			var i = obj.length;
			while (i--) {
				if (obj[i].removeEventListener) {
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
			if (document.createEventObject) { // ie
				evt = document.createEventObject();
				return obj.fireEvent('on'+ ev, evt);
			}
			delegate = delegate || false;
			cancelable = cancelable || true;
			evt = document.createEvent('HTMLEvents');
			evt.initEvent(ev, delegate, cancelable);
			return !obj.dispatchEvent(evt);
		},
		hover: function (obj, over, out, delegate) {
			if (typeof obj === 'undefined') {return;}
			var $this = this;
			out = out || null;
			$this.bind(obj, 'mouseover', over, delegate);
			if (out) 
				$this.bind(obj, 'mouseout', out, delegate);
		},
		hasClass: function (el, cls) {
			var re = el.className.split(" ");
			if (!Array.indexOf) {
				Array.prototype.indexOf = function(obj) {
					for(var i = 0; i < this.length; i++) {
						if (this[i] === obj){
							return i;
						}
					}
					return -1;
				}
			}
			if (typeof re === 'undefined') { return false; }
			return -1 !== re.indexOf(cls);
		},
		addClass: function (el, cls) {
			if (!this.hasClass(el, cls)) 
				el.className += ' ' + cls;
		},
		removeClass: function (el, cls) {
			if (this.hasClass(el, cls)) 
				var re = el.className.split(' ');
				if (typeof re === 'undefined') { return;	}
				re.splice(re.indexOf(cls), 1);
				var i = re.length;
				el.className = ''; // empty
				while(i--) { // reload
					el.className += re[i] + ' ';
				}
		},
		getId: function (id) {
			return document.getElementById(id);
		},
		getTag: function (tag, context) {
			context = context || document;
			tag = tag || '*';
			return context.getElementsByTagName(tag);
		},
		getClass: function (searchClass, context, tag) {
			var classElements = [];
			var els = this.getTag(tag, context);
			var elsLen = els.length;
			var pattern = /('(^|\\s)' + searchClass + '(\\s|$)')/;
			for (var i = 0, j = 0; i < elsLen; ++i) {
				if (pattern.test(els[i].className)) {
					classElements[j] = els[i];
					j++;
				}
			}
			return classElements;
		},
		toCamelCase: function (string) {
			var oStringList = string.split('-');
			if (oStringList.length === 1) return oStringList[0];

			var ccstr = string.indexOf('-') === 0 ? oStringList[0].charAt(0).toUpperCase() + oStringList[0].substring(1) : oStringList[0];

			for (var i = 1, len = oStringList.length; i < len; ++i) {
				var s = oStringList[i];
				ccstr += s.charAt(0).toUpperCase() + s.substring(1);
			}
			return ccstr;
		},
		style: function (el, prop, newVal) {
			if (el)
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
				var view = document.defaultView;
				if (view && view.getComputedStyle) {
					return view.getComputedStyle(el, '')[prop] || null;
				} else {
					if (prop === 'opacity') {
						var opacity = el.filters('alpha').opacity;
						return isNaN(opacity) ? 1 : (opacity ? opacity / 100 : 0);
					}
					return el.currentStyle[prop] || null;
				}
			}
		},
		docHeight: function () {
			var D = document;
			return Math.max(
				Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
				Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
				Math.max(D.body.clientHeight, D.documentElement.clientHeight)
			);
		},
		docWidth: function () {
			var D = document;
			return Math.max(D.body.clientWidth, D.documentElement.clientWidth);
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
			return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
		},
		text: function (obj, txt) {
			if (typeof obj !== 'undefined') {
				if (txt) {
					if (obj.innerText !== 'undefined') {
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
			node.appendChild(newNode)
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
		remove: function (ele) {
			if (!ele) return false;
			if (!('length' in ele)) {
				ele = [ele];
			}
			var i = ele.length;
			while (i--) {
				if (typeof ele[i].parentNode !== 'undefined') {
					ele[i].parentNode.removeChild(ele[i]);
				}
			}
		},
		create: function (tag) {
			// TODO: add a name attribute try/catch to solve <= ie7 submitName issue
			return document.createElement(tag);
		},
		// Cookies
		createCookie: function (name, value, days, domain) {
			var expires = '';
			domain = domain || window.location.host;
			if (days) {
				var date = new Date();
				date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
				expires = '; expires=' + date.toGMTString();
			}
			// document.cookie = name +'='+ value + expires +'; domain=.'+ domain +' ;path=/';
			document.cookie = name + '=' + value + expires + ';';
		},
		eraseCookie: function (name) {
			this.createCookie(name, '', -1);
		},
		readCookie: function (c_name) {
			if (document.cookie.length > 0) {
				var c_start = document.cookie.indexOf(c_name + "=");
				if (c_start !== -1) {
					c_start = c_start + c_name.length + 1;
					var c_end = document.cookie.indexOf(";", c_start);
					if (c_end === -1) {
						c_end = document.cookie.length;
					}
					return unescape(document.cookie.substring(c_start, c_end));
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
		// Ajax
		getUrlVars: function () {
			var vars = [];
			var hash;
			var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
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
			for (var i=0; i < rawChildrenLen; ++i) {
				var currentNode = rawChildren[i];
				switch(rawChildren[i].nodeName.toLowerCase()) {
					case 'input':
						switch(currentNode.type) {
							case 'text':
								formChildren.push(currentNode);
							break;
							case 'hidden':
								formChildren.push(currentNode);
							break;
							case 'password':
								formChildren.push(currentNode);
							break;
							case 'checkbox':
								if (currentNode.checked) {
									formChildren.push(currentNode);
								}
							break;
							case 'radio':
								if (currentNode.checked) {
									formChildren.push(currentNode);
								}
							break;
						}
					break;
					case 'select':
						formChildren.push(currentNode);
					break;
					case 'textarea':
						formChildren.push(currentNode);
					break;
				}
			}
			//build object of the name-value pairs
			var formChildrenLen = formChildren.length;
			for (var i = 0; i < formChildrenLen; ++i) {
				var currentNode = formChildren[i];
				if (!returnObject.hasOwnProperty(currentNode.name)) {
					returnObject[currentNode.name] = currentNode.value;
				} else {
					if (typeof returnObject[currentNode.name] === 'string') {
						returnObject[currentNode.name] = [returnObject[currentNode.name], currentNode.value.toString()];					
					} else {
						returnObject[currentNode.name].push(currentNode.value.toString());
					}
				}
			}
			return returnObject;
		},
		formatParams: function (obj) {
			if (obj === null) {return '';}
			var q = [];
			for (p in obj) {
				if (obj.hasOwnProperty(p)) {
					q.push( encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]) );
				}
			}
			return q.join("&");
		},
		setDefaults: function(defaults, options) {
			if (!options) {
				options = defaults;
			} else {
				for (var index in defaults) {
					if (typeof options[index] === 'undefined') {
						options[index] = defaults[index];
					}
				}
			}
			return options;
		},
		parse: function(str, type) {
			type = type.toLowerCase() || 'json';	
			var result;
			switch (type) {
				case 'xml':
					if (window.DOMParser) {
						var parser = new DOMParser();
						result = parser.parseFromString(str, 'text/xml');
					} else { // ie
						var xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
						xmlDoc.async = 'false';
						result = xmlDoc.loadXML(str); }
				break;
				case 'json':
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
					var EMPTY_STRING = new String('');
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
							default:  // sign or digit
								cont = stack[0];
								cont[key || cont.length] = +(tok);
								key = void 0;
								break;
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
		ajax: function(options) {
			options = this.setDefaults({
				url:          null,
				data:         null, // key:val
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

			// init
			switch (options.type.toUpperCase()) {
				case 'GET':
					get(options.url, options.data);
				break;
				case 'POST':
					post(options.url, options.data);
				break;
				case 'JSONP':
					getJSONP(options.url, options.requestId);
				break;
			}
			
			//private
			function open(method, url) {
				var req = getRequest();
				if (req === null) {return;}
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
					switch (req.readyState) {
						case 0:
							options.beforeSend();
						break
						case 1:
							options.sendPrepared();
						break;
						case 2:
							options.afterSend();
						break;
						case 3:
							options.preComplete(req);
						break;
						case 4:
							if (req.status >= 200 && req.status < 300) {
								options.complete(req);	
							} else if (req.status === 0) { // file:/// ajax
								options.complete(req);
							} else {
								options.failure(req);
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

			function getJSONP(url, id) {
				var script = $this.create('script');	
				script.type = 'text/javascript';
				script.src = url;
				script.id = id || 'awesome-jsonp'; // id to remove 
				$this.append(script, $this.getTag('head')[0]);
			}
		
			function getRequest() {
				if (typeof(XMLHttpRequest) !== 'undefined')
					return new XMLHttpRequest();
				try {
					return new ActiveXObject('Msxml2.XMLHTTP.6.0');
				} catch(e) { }
				try {
					return new ActiveXObject('Msxml2.XMLHTTP.3.0');
				} catch(e) { }
				try {
					return new ActiveXObject('Msxml2.XMLHTTP');
				} catch(e) { }
				try {
					return new ActiveXObject('Microsoft.XMLHTTP');
				} catch(e) { }
				return null;
			}
		}
	};
}());
