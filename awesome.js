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
			if (typeof obj == 'undefined') {
				return false;
			}
			var delegate = delegate || false;
			if (!('length' in obj)) {
    			obj = [obj];
    		}
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
			if (!('length' in obj)) {
    			obj = [obj];
    		}
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
			var $that = this;
			$that.bind(obj, 'mouseover', over, delegate);
			if (out) $that.bind(obj, 'mouseout', out, delegate);
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
		bottomBar: function (ele) {
			var $that = this;
			function makeBottom() {
				var barheight = $that.attr(ele, 'offsetHeight')
				$that.style(ele, 'bottom', 'auto');
				$that.style(ele, 'top', (($that.docHeight() - barheight) + 'px'));
			}
			makeBottom();

			$that.bind(window, 'resize', function () {
				makeBottom();
			});
		},
		screenOverlay: function (options) {
			var defaults = {
				header: null,
				headerType: 'h2',
				data: null,
				lightboxId: 'lightbox',
				id: 'screen-overlayer'
			};
			if (!options) {
				var options = defaults;
			} else {
				for (var index in defaults) {
					if (typeof options[index] == 'undefined') 
						options[index] = defaults[index];
				}
			}
			var $that = this;

			// Make Viewport-sized grey area
			function makeOverlay(windowWidth, windowHeight, id) {
				var $body = document.body,
					overlayer = $that.getId(id),
					lightbox = $that.getId(options.lightboxId),
					lightboxClose = $that.getId(options.lightboxId + '-close');

				if (!overlayer && !lightbox) {
					var overlayDIV = $that.create('div'),
						lightboxDIV = $that.create('div');

					$that.prepend($body, overlayDIV);
					$that.attr(overlayDIV, 'id', id);

					$that.prepend($body, lightboxDIV);
					$that.attr(lightboxDIV, 'id', options.lightboxId);

					$that.addClass(document.documentElement, 'has-overlay');

					var overlayer = $that.getId(id),
						lightbox = $that.getId(options.lightboxId);

					// Output for lightbox
					var lightboxOutput = '<a href="#' + options.lightboxId + '-close" id="' + options.lightboxId + '-close">Close</a><div id="' + options.lightboxId + '-inner">';
					if (options.header) {
						lightboxOutput += '<div class="header"><' + options.headerType + '>' + options.header + '</' + options.headerType + '></div>';
					}
					lightboxOutput += '<div class="content">' + options.data + '</div></div>';
					lightbox.innerHTML = lightboxOutput;

					var lightboxClose = $that.getId(options.lightboxId + '-close');
				}

				$that.style(overlayer, 'width', windowWidth + 'px');
				$that.style(overlayer, 'height', windowHeight + 'px');

				function closeOverlay() {
					$that.removeClass(document.documentElement, 'has-overlay');
					$that.remove(lightbox);
					$that.remove(overlayer);
				}

				$that.bind(overlayer, 'click', function () {
					closeOverlay();
				});
				$that.bind(lightboxClose, 'click', function (e) {
					$that.cancelEvent(e);
					closeOverlay();
				});
			}
			makeOverlay($that.docWidth(), $that.docHeight(), options.id);

			$that.bind(window, 'resize', function () {
				if ($that.hasClass(document.documentElement, 'has-overlay')) 
					makeOverlay($that.docWidth(), $that.docHeight(), options.id);
			});
		},
		tabs: function (ele, options) {
			var $that = this,
				sections = $that.getClass('tab', ele, 'div'),
				seclen = sections.length,
				defaults = {
					open: 1,
					hist: false
				};
				
			if (!options) {
				var options = defaults;
			} else {
				for (var index in defaults) {
					if (typeof options[index] == 'undefined') 
						options[index] = defaults[index];
				}
			}

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
				$that.bind(tabs[j].childNodes[0], 'click', function(e) {
					$that.cancelEvent(e);

					for (var k = 0; k < seclen; k++) {
						$that.removeClass(tabs[k], 'active');
					}
					$that.addClass(this.parentNode, 'active');
					var href = $that.attr(this, 'href').split('#')[1];	
					for (var l = 0; l < seclen; l++) {
						$that.style(sections[l], 'display', 'none');
					}
					var openMe = $that.getId(href);
					$that.style(openMe, 'display', 'block');
					
				});
			}

			
			// Open Default block
			if (options.open) {
				for (var i = 0; i < sections.length; i++) {
					$that.style(sections[i], 'display', 'none');
				}
				$that.style(sections[options.open - 1], 'display', 'block');

				for (var j = 0; j < tabs.length; j++) {
					$that.removeClass(tabs[j], 'active');
				}
				$that.addClass(tabs[options.open - 1], 'active');

				options.open = null;
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
		text: function (obj, txt) {
			if (txt) {
				if (obj.innerText) {
					obj.innerText = txt;
				} else {
					obj.textContent = txt;
				}
			} else {
				return obj.innerText || obj.textContent;
			}
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
			if (!('length' in ele)) {
    			ele = [ele];
    		}
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
		animate: function (ele, props, time, callback) {
			var fx = new FX(ele, props, time, callback);
			fx.start();
		},
		truncate: function (obj, options) {
			if (obj)
			if (!('length' in obj)) {
    			obj = [obj];
    		}
			var defaults = {
				len: 80,
				elipsis: '... ',
				moreText: 'Read More &raquo;'
			};
			if (!options) {
				var options = defaults;
			} else {
				for (var index in defaults) {
					if (typeof options[index] == 'undefined') 
						options[index] = defaults[index];
				}
			}
			
			for (var i = 0, olen = obj.length; i < olen; i++) {
				var trunc = obj[i].innerHTML;
				if (trunc.length > options.len) {
					trunc = trunc.substring(0, options.len);
					trunc = trunc.replace(/\w+$/, '');
					trunc += options.elipsis + '<a href="#" ' +
					'onclick="this.parentNode.innerHTML=' +
					'unescape(\''+ escape(obj[i].innerHTML)+'\');return false;">' +
					options.moreText + '<\/a>';
					obj[i].innerHTML = trunc;
				}	
			}
		},
		tooltip: function (obj, options) {
			if (obj)
			var $that = this;
			if (!('length' in obj)) {
    			obj = [obj];
    		}
    		var defaults = {
    			pos: 'top',
    			cls: 'tooltip'
			};
			if (!options) {
				var options = defaults;
			} else {
				for (var index in defaults) {
					if (typeof options[index] == 'undefined') 
						options[index] = defaults[index];
				}
			}
    		
			for (var i = 0, olen = obj.length; i < olen; i++) {
				if (!$that.hasClass(obj[i], 'has-tip')) {
				
					var title = $that.attr(obj[i], 'title'),
						tip = $that.create('span');
			
					obj[i].title = null; // prevent browser tips
					$that.addClass(obj[i], 'has-tip');
					$that.style(obj[i], 'position', 'relative');
					$that.prepend(obj[i], tip);
					$that.style(tip, 'display', 'none');
			
					switch (options.pos) {
						case 'left':
							$that.addClass(tip, options.cls +' tipleft');
						break;
						case 'right':
							$that.addClass(tip, options.cls +' tipright');
						break;
						case 'bottom':
							$that.addClass(tip, options.cls +' tipbottom');
						break;
						default: // top
							$that.addClass(tip, options.cls +' tiptop');
					}
					$that.text(tip, title);
				}
				// Tip hover
				$that.hover(obj[i], function() {
					$that.style(this.childNodes[0], 'display', 'block');
				}, function() {
					$that.style(this.childNodes[0], 'display', 'none');    
				});
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
		},
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
