// Awesome ensues 
var AWESOME = (function () {
	return {
		ready: function (fn, ctx) {
			var ready, timer,
				onStateChange = function (e) {
				// Mozilla & Opera
				if (e && e.type == 'DOMContentLoaded') {
					fireDOMReady();
					// Legacy
				} else if (e && e.type == 'load') {
					fireDOMReady();
					// Safari & IE
				} else if (document.readyState) {
					if ((/loaded|complete/).test(document.readyState)) {
						fireDOMReady();
						// IE, courtesy of Diego Perini (http://javascript.nwbox.com/IEContentLoaded/)
					} else if ( !! document.documentElement.doScroll) {
						try {
							ready || document.documentElement.doScroll('left');
						} catch (e) {
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
					if (document.removeEventListener) document.removeEventListener('DOMContentLoaded', onStateChange, false);
					document.onreadystatechange = null;
					window.onload = null;
					clearInterval(timer);
					timer = null;
				}
			};
			// Mozilla & Opera
			if (document.addEventListener) document.addEventListener('DOMContentLoaded', onStateChange, false);
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
			var delegate = delegate || false;
			if (typeof obj == 'undefined') {
				return false;
			}
			obj = [].concat(obj);
			for (var i = 0, len = obj.length; i < len; i++) {
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
			var delegate = delegate || false;
			if (typeof obj == 'undefined') {
				return false;
			}
			obj = [].concat(obj);
			for (var i = 0, len = obj.length; i < len; i++) {
				if (obj[i].removeEventListener) {
					obj[i].removeEventListener(type, handler, delegate);
				} else if (obj[i].detachEvent) {
					obj[i].detachEvent('on' + type, handler);
				} else {
					obj[i]['on' + type] = null;
				}
			}
		},
		hover: function (obj, over, out, delegate) {
			var out = out || null;
			if (typeof obj == 'undefined') {
				return false;
			}
			AWESOME.bind(obj, 'mouseover', over, delegate);
			if (out) AWESOME.bind(obj, 'mouseout', out, delegate);
		},
		hasClass: function (ele, cls) {
			return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
		},
		addClass: function (ele, cls) {
			if (!this.hasClass(ele, cls)) ele.className += ' ' + cls;
		},
		removeClass: function (ele, cls) {
			if (this.hasClass(ele, cls)) var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			ele.className = ele.className.replace(reg, ' ');
		},
		getId: function (id) {
			return document.getElementById(id);
		},
		getTag: function (tag, context) {
			var context = context || document,
				tag = tag || '*',
				output = context.getElementsByTagName(tag);
			if (output.length > 1) {
				return output;
			} else {
				return output[0];
			}
		},
		getClass: function (searchClass, context, tag) {
			var classElements = new Array(),
				els = this.getTag(tag, context),
				elsLen = els.length,
				pattern = new RegExp('(^|\\s)' + searchClass + '(\\s|$)');
			for (var i = 0, j = 0; i < elsLen; i++) {
				if (pattern.test(els[i].className)) {
					classElements[j] = els[i];
					j++;
				}
			}
			if (classElements.length > 1) {
				return classElements;
			} else {
				return classElements[0];
			}
		},
		toCamelCase: function (string) {
			var oStringList = string.split('-');
			if (oStringList.length == 1) return oStringList[0];

			var ccstr = string.indexOf('-') == 0 ? oStringList[0].charAt(0).toUpperCase() + oStringList[0].substring(1) : oStringList[0];

			for (var i = 1, len = oStringList.length; i < len; i++) {
				var s = oStringList[i];
				ccstr += s.charAt(0).toUpperCase() + s.substring(1);
			}
			return ccstr;
		},
		style: function (el, prop, newVal) {
			prop = this.toCamelCase(prop);
			newVal = newVal || null;
			if (newVal) {
				if (prop == 'opacity') {
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
					if (prop == 'opacity') {
						var opacity = el.filters('alpha').opacity;
						return isNaN(opacity) ? 1 : (opacity ? opacity / 100 : 0);
					}
					return el.currentStyle[prop] || null;
				}
			}
		},
		docHeight: function () {
			var D = document;
			return Math.max(D.body.clientHeight, D.documentElement.clientHeight);
		},
		docWidth: function () {
			var D = document;
			return Math.max(D.body.clientWidth, D.documentElement.clientWidth);
		},
		bottomBar: function (ele) {
			function makeBottom() {
				var barheight = AWESOME.attr(ele, 'offsetHeight')
				AWESOME.style(ele, 'bottom', 'auto');
				AWESOME.style(ele, 'top', ((AWESOME.docHeight() - barheight) + 'px'));
			}
			makeBottom();

			AWESOME.bind(window, 'resize', function () {
				makeBottom();
			});
		},
		// Helps blank out the screen for lightbox-style effects
		// TODO: Turn this into an AWESOME plugin
		// TODO: add ARIA
		screenOverlay: function (header, data, lightboxId) {
			var header = header || null,
				data = data || null,
				lightboxId = lightboxId || 'lightbox',
				id = 'screen-overlayer';

			// Make Viewport-sized grey area
			function makeOverlay(windowWidth, windowHeight, id) {
				var $body = document.body;

				var overlayer = AWESOME.getId(id),
					lightbox = AWESOME.getId(lightboxId),
					lightboxClose = AWESOME.getId(lightboxId + '-close');

				if (!overlayer && !lightbox) {
					var overlayDIV = AWESOME.create('div'),
						lightboxDIV = AWESOME.create('div');

					AWESOME.prepend($body, overlayDIV);
					AWESOME.attr(overlayDIV, 'id', id);

					AWESOME.prepend($body, lightboxDIV);
					AWESOME.attr(lightboxDIV, 'id', lightboxId);

					AWESOME.addClass(document.documentElement, 'has-overlay');

					var overlayer = AWESOME.getId(id),
						lightbox = AWESOME.getId(lightboxId);

					// Output for lightbox
					var lightboxOutput = '<a href="#' + lightboxId + '-close" id="' + lightboxId + '-close">Close</a><div id="' + lightboxId + '-inner">';
					if (header) {
						lightboxOutput += '<div class="header"><h2>' + header + '</h2></div>'; // TODO: Determine if h2/h3 is appropriate
					}
					lightboxOutput += '<div class="content">' + data + '</div></div>';
					lightbox.innerHTML = lightboxOutput;

					var lightboxClose = AWESOME.getId(lightboxId + '-close');
				}

				AWESOME.style(overlayer, 'width', windowWidth + 'px');
				AWESOME.style(overlayer, 'height', windowHeight + 'px');

				function closeOverlay() {
					AWESOME.removeClass(document.documentElement, 'has-overlay');
					AWESOME.remove(lightbox);
					AWESOME.remove(overlayer);
				}

				AWESOME.bind(overlayer, 'click', function () {
					closeOverlay();
				});
				AWESOME.bind(lightboxClose, 'click', function (e) {
					AWESOME.cancelEvent(e);
					closeOverlay();
				});
			}
			makeOverlay(AWESOME.docWidth(), AWESOME.docHeight(), id);

			AWESOME.bind(window, 'resize', function () {
				if (AWESOME.hasClass(document.documentElement, 'has-overlay')) makeOverlay(AWESOME.docWidth(), AWESOME.docHeight(), id);
			});
		},
		// TODO: Make this an AWESOME plugin
		tabs: function (ele, open, hist) {
			var open = open || 1;
			var $that = this;
			var sections = $that.getClass('tab', ele, 'div');
			var seclen = sections.length;

			// If there are multiple sections, close sections, make tabs, open first
			if (seclen <= 1) return;
			$that.addClass(ele, 'tab-container');
			var tabs = '';
			for (var i = 0; i < seclen; i++) {
				$that.style(sections[i], 'display', 'none');
				switch (i) {
					case 0:
						tabs += '<li class="first">';
					break;
					case (seclen - 1):
						tabs += '<li class="last">';
					break;
					default:
					tabs += '<li>';
				}
				tabs += '<a href="#' + $that.attr(sections[i], 'id') + '" data-id="' + i + '">' + $that.attr(sections[i], 'title') + '</a></li>';
				tabs += '</li>';
			}
			var tabset = $that.create('ul');
			$that.prepend(ele, tabset);
			$that.addClass(tabset, 'tab-set clearfix');
			tabset.innerHTML = tabs;
			var tabs = $that.getTag('li', tabset);
			var tabslen = tabs.length;

			// Open appropriate Block
			for (var j = 0; j < seclen; j++) {
				AWESOME.bind(tabs[j].childNodes[0], 'click', function(e) {
					AWESOME.cancelEvent(e);
					var $that = this;

					for (var k = 0; k < seclen; k++) {
						AWESOME.removeClass(tabs[k], 'active');
					}
					AWESOME.addClass($that.parentNode, 'active');
					var href = AWESOME.attr($that, 'href').split('#')[1];
					for (var l = 0; l < seclen; l++) {
						AWESOME.style(sections[l], 'display', 'none');
					}
					var openMe = AWESOME.getId(href);
					AWESOME.style(openMe, 'display', 'block');
				});
			}

			// Open Default block
			if (open) {
				for (var i = 0; i < sections.length; i++) {
					AWESOME.style(sections[i], 'display', 'none');
				}
				AWESOME.style(sections[open - 1], 'display', 'block');

				for (var j = 0; j < tabs.length; j++) {
					AWESOME.removeClass(tabs[j], 'active');
				}
				AWESOME.addClass(tabs[open - 1], 'active');

				open = null;
			}
		},
		attr: function (ele, attr, newVal) {
			var newVal = newVal || null;
			if (newVal) {
				ele.setAttribute(attr, newVal);
			} else {
				var attrs = ele.attributes,
					attrslen = attrs.length,
					result = ele.getAttribute(attr) || ele[attr] || null;

				if (!result) {
					for (var i = 0; i < attrslen; i++)
					if (attr[i].nodeName === attr) result = attr[i].nodeValue;
				}
				return result;
			}
		},
		encodeHTML: function (str) {
			return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
		},
		prepend: function (p, c) {
			p.insertBefore(c, p.childNodes[0]);
		},
		insertAfter: function (p, node, refNode) {
			p.insertBefore(node, refNode.nextSibling);
		},
		swap: function (a, b) {
			a.parentNode.replaceChild(b, a);
		},
		remove: function (ele) {
			if (!ele) return false;
			ele = [].concat(ele);
			for (var i = 0, len = ele.length; i < len; i++) {
				if (!ele[i].parentNode) {
					return false;
				}
				ele[i].parentNode.removeChild(ele[i]);
			}
		},
		create: function (tag) {
			return document.createElement(tag);
		},
		// Cookies
		createCookie: function (name, value, days, domain) {
			var expires = '';
			var domain = domain || window.location.host;
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
				if (c_start != -1) {
					c_start = c_start + c_name.length + 1;
					var c_end = document.cookie.indexOf(";", c_start);
					if (c_end == -1) {
						c_end = document.cookie.length;
					}
					return unescape(document.cookie.substring(c_start, c_end));
				}
			}
			return null;
		},
		// Animation coming soon
		// animate: function (ele, props, time, callback, context) {
		//	   if (FX) {
		//		   var fx = new FX(ele, props, time);
		//		   fx.start();
		//	   }
		// },
		truncate: function(obj, len) {
			if (obj)
			var len = len || 80;
			obj = [].concat(obj);
			for (var i = 0, olen = obj.length; i < olen; i++) {
				var trunc = obj[i].innerHTML;
				if (trunc.length > len) {
					trunc = trunc.substring(0, len);
					trunc = trunc.replace(/\w+$/, '');
					trunc += '... <a href="#" ' +
					'onclick="this.parentNode.innerHTML=' +
					'unescape(\''+ escape(obj[i].innerHTML)+'\');return false;">' +
					'Read More &raquo;<\/a>';
					obj[i].innerHTML = trunc;
				}	
			}
		},
		getUrlVars: function () {
			var vars = [],
				hash;
			var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
			for (var i = 0; i < hashes.length; i++) {
				hash = hashes[i].split('=');
				vars.push(hash[0]);
				vars[hash[0]] = hash[1];
			}
			return vars;
		},
		ajax: function (url, callbackFunction) {
			this.bindFunction = function (caller, object) {
				return function () {
					return caller.apply(object, [object]);
				};
			};
			this.stateChange = function (object) {
				if (this.request.readyState == 4) this.callbackFunction(this.request.responseText);
			};
			this.getRequest = function () {
				if (window.ActiveXObject) return new ActiveXObject('Microsoft.XMLHTTP');
				else if (window.XMLHttpRequest) return new XMLHttpRequest();
				return false;
			};
			this.postBody = (arguments[2] || '');
			this.callbackFunction = callbackFunction;
			this.url = url;
			this.request = this.getRequest();
			if (this.request) {
				var req = this.request;
				req.onreadystatechange = this.bindFunction(this.stateChange, this);
				if (this.postBody !== '') {
					req.open('POST', url, true);
					req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
					req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
					req.setRequestHeader('Connection', 'close');
				} else {
					req.open('GET', url, true);
				}
				req.send(this.postBody);
			}
		}
		// getRemote: function(url, remoteSelector, localSelector) {
		//	 var localSelector = localSelector || this.getTag('body');
		//	 var remoteSelector = remoteSelector || '';
		//	 var get  = '/php/getremote.php?url='+ url;
		//		 get += '&sel='+ remoteSelector;
		//	 this.ajax(get, function(res) {
		//	   localSelector.innerHTML = res;
		//	 });
		// }
	};
})();