/*
 * FX v2.0
 * Copyright (c) 2009 Ryan Morr (ryanmorr.com)
 * Licensed under the MIT license.
 */

(function(){
	
	/**
	 * Constructor - initiate with the new operator
	 * @param {Element} el The element to which the animation will be performed against
	 * @param {Object} attributes Object containing all the attributes to be animated and the values
	 * @param {Number} duration How long should the animation take in seconds (optional)
 	 * @param {String} transition Name of the method in charge of the transitional easing of the element (optional)
	 * @param {Function} callback The function to be executed after the animation is complete (optional)
	 * @param {Object} ctx The context for which the callback will be executed in (optional)
	 */
	this.FX = function(el, attributes, duration, transition, callback, ctx){
		this.el = DOM.get(el);
		this.attributes = attributes;
		this.duration = duration || 0.7;
		this.transition = (!!transition && transition in FX.transitions) ? transition : "easeInOut";
		this.callback = callback || function(){};
		this.ctx = ctx || window;
		
		/**
		 * The object that holds the CSS unit for each attribute
		 * @type Object
		 */
		 this.units = {};
		
		/**
		 * The object to carry the current values for each frame
		 * @type Object
		 */
		this.frame = {};
		
		/**
		 * The object containing all the ending values for each attribute
		 * @type Object
		 */
		this.endAttr = {};
		
		/**
		 * The object containing all the starting values for each attribute
		 * @type Object
		 */
		this.startAttr = {};
	};
	
	/**
	 * Object containing all the transitional easing methods.
	 * Is available to the global context to facilitate adding additionial transitions as desired
	 */
	this.FX.transitions = {

		linear: function(t, b, c, d){
			return c*t/d + b;
		},
		
		easeIn: function(t, b, c, d) {
			return -c * Math.cos(t/d *(Math.PI/2)) + c + b;
		},  
		
		easeOut: function(t, b, c, d) {
			return c * Math.sin(t/d *(Math.PI/2)) + b;
		}, 
		
		easeInOut: function(t, b, c, d) {
			return -c/2 *(Math.cos(Math.PI*t/d) - 1) + b;
		}
	};
	
	this.FX.prototype = {

		/**
		 * start the animation
		 */
		start: function(){
			var fx = this;
			this.getAttributes();
			this.time = new Date().getTime();
			this.animating = true;
			this.timer = setInterval(function(){
				var time = new Date().getTime();
				if(time < (fx.time + fx.duration)){
					fx.elapsed = time - fx.time;
					fx.setCurrentFrame();
				}else{
					fx.frame = fx.endAttr;
					fx.complete();
				}
				fx.setAttributes();
			}, 10)
		},
		
		/**
		 * Perform a transitional ease to keep the animation smooth
		 * @param {Number} start The starting value for the attribute
		 * @param {Number} end The ending value for the attribute
		 * @return {Number} Calculated percentage for the frame of the attribute
		 */
		ease: function(start, end){
			return FX.transitions[this.transition](this.elapsed, start, end - start, this.duration);
		},
		
		/**
		 * Complete the animation by clearing the interval and nulling out the timer,
		 * set the animating property to false, and execute the callback
		 */
		complete: function(){
			clearInterval(this.timer);
			this.timer = null;
			this.animating = false;
			this.callback.call(this.ctx);
		},
		
		/**
		 * Set the current frame for each attribute by calculating the ease and setting the new value
		 */
		setCurrentFrame: function(){
			for(var attr in this.startAttr){ 
				if(this.startAttr[attr] instanceof Array){
					this.frame[attr] = [];
					for(var i=0; i < this.startAttr[attr].length; i++){
						this.frame[attr][i] = this.ease(this.startAttr[attr][i], this.endAttr[attr][i]);
					}
				}else{
					this.frame[attr] = this.ease(this.startAttr[attr], this.endAttr[attr]);
				}
			}
		},
		
		/**
		 * Get all starting and ending values for each attribute
		 */
		getAttributes: function(){
			for(var attr in this.attributes){
				switch(attr){
					case 'color':
					case 'borderColor':
					case 'border-color':
					case 'backgroundColor':
					case 'background-color':
						this.startAttr[attr] = parseColor(this.attributes[attr].from || DOM.getStyle(this.el, attr));
						this.endAttr[attr] = parseColor(this.attributes[attr].to);
						break;
					case 'scrollTop':
					case 'scrollLeft':
						var el = (this.el == document.body) ? (document.documentElement || document.body) : this.el;
						this.startAttr[attr] = this.attributes[attr].from || el[attr];
						this.endAttr[attr] = this.attributes[attr].to;
						break;
					default:
						var start;
						var end = this.attributes[attr].to;
						var units = this.attributes[attr].units || "px";
						if(!!this.attributes[attr].from){
							start = this.attributes[attr].from;
						}else{
							start = parseFloat(DOM.getStyle(this.el, attr)) || 0;
							if(units != "px" && document.defaultView){
								DOM.setStyle(this.el, attr, (end || 1) + units);
								start = ((end || 1) / parseFloat(DOM.getStyle(this.el, attr))) * start;
								DOM.setStyle(this.el, attr, start + units);
							}
						}
						this.units[attr] = units;
						this.endAttr[attr] = end;
						this.startAttr[attr] = start;
						break;
				}  		
			}
		},
		
		/**
		 * Set the current value for each attribute for every frame
		 */
		setAttributes: function(){
			for(var attr in this.frame){
				switch(attr){
					case 'opacity':
						DOM.setStyle(this.el, attr, this.frame[attr]);
						break;
					case 'scrollLeft':
					case 'scrollTop':
						var el = (this.el == document.body) ? (document.documentElement || document.body) : this.el;
						el[attr] = this.frame[attr];
						break;
					case 'color':
					case 'borderColor':
					case 'border-color':
					case 'backgroundColor':
					case 'background-color':
						var rgb = 'rgb('+Math.floor(this.frame[attr][0])+','+Math.floor(this.frame[attr][1])+','+Math.floor(this.frame[attr][2])+')';
						DOM.setStyle(this.el, attr, rgb);
						break;
					default:
						DOM.setStyle(this.el, attr, this.frame[attr] + this.units[attr]);
						break;
				}
			}
		}
	};
	
	var DOM = {
		
		/**
		 * Get a dom node
		 * @param {String} id The id of the element to get or the element itself
		 * @return {Element} The element found
		 */
		get: function(id){
			return (typeof id == "string") ? document.getElementById(id) : id;
		},
		
		/**
		 * Get a style of an element
		 * @param {Element} el The element for the style to be retrieved from
		 * @param {String} prop The property or style that is to be found
		 * @return {Number} The value of the property
		 */
		getStyle: function(el, prop){
			prop = toCamelCase(prop);
			var view = document.defaultView;
			if(view && view.getComputedStyle){
				return view.getComputedStyle(el, "")[prop] || null;
			}else{
				if(prop == 'opacity'){
					var opacity = el.filters('alpha').opacity;
					return isNaN(opacity) ? 1 : (opacity ? opacity / 100 : 0);
				}
				return el.currentStyle[prop] || null;
			}
		},
		
		/**
		 * Set a style for an element
		 * @param {Element} el The element the new value will be applied to
		 * @param {String} prop The property or style that will be set
		 * @param {String} value The value of the property to be set
		 */
		setStyle: function(el, prop, value){
			if(prop == 'opacity'){
				el.style.filter = "alpha(opacity=" + value * 100 + ")";
				el.style.opacity = value;
			}else{
				prop = toCamelCase(prop);
				el.style[prop] = value;
			}
		}
	};
	
	/**
	 * Convert a CSS property to camel case (font-size to fontSize)
	 * @param {String} str The property that requires conversion to camel case
	 * @return {String} The camel cased property string
	 */
	var toCamelCase = (function(){
		var cache = {};
		return function(str){
			if(!cache[str]){
				var parts = str.split('-'), camel = parts[0];
				if(parts.length > 1){
					for(var i=1, len=parts.length; i < len; i++){
							camel += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);
					}
				}
				return cache[str] = camel;
			}else{
				return cache[str];
			}
		}
	})();
	
	/**
	 * parse a color to be handled by the animation, supports hex and rgb (#FFFFFF, #FFF, rgb(255, 0, 0))
	 * @param {String} str The string value of an elements color
	 * @return {Array} The rgb values of the color contained in an array
	 */
	var parseColor = (function(){
		var hex6 = (/^#?(\w{2})(\w{2})(\w{2})$/);		
		var hex3 = (/^#?(\w{1})(\w{1})(\w{1})$/);	
		var rgb = (/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/); 
							   
		return function(str){      
			var color = str.match(hex6);
			if(color && color.length == 4){
				return [parseInt(color[1], 16), parseInt(color[2], 16), parseInt(color[3], 16)];
			}
			
			color = str.match(rgb);
			if(color && color.length == 4){
				return [parseInt(color[1], 10), parseInt(color[2], 10), parseInt(color[3], 10)];
			}
		
			color = str.match(hex3);
			if(color && color.length == 4){
				return [parseInt(color[1] + color[1], 16), parseInt(color[2] + color[2], 16), parseInt(color[3] + color[3], 16)];
			}
		}
	})();

})();
