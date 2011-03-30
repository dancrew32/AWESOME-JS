(function($) {
$.characterLimit = (function (options) {
	options = $.setDefaults({
		obj: null,
		limit: 140,
		limitOffset: 0,
		truncate: true,
		prefixSingular: '',
		prefixPlural: '',
		suffixSingular: 'character remaining',
		suffixPlural: 'characters remaining',
		warning: 10,
		warningClass: 'warning',
		exceeded: 0,
		exceededClass: 'exceeded',
		position: 'after'
	}, options);

	if (!('length' in options.obj)) {
		options.obj = [options.obj];
	}
	var i = options.obj.length;
	while(i--) {
		var obj = options.obj[i];

		var counter = $.create('div');
		counter.className = 'counter';
		var hasPrefix = false;
		var hasSuffix = false;
		counter.innerHTML = "";
		if (options.prefixSingular != "" || options.prefixPlural != "") {
			hasPrefix = true;
			counter.innerHTML += '<span class="prefix"></span> ';
		}
		counter.innerHTML += '<span class="number"></span>';
		if (options.suffixSingular != "" || options.suffixPlural != "") {
			hasSuffix = true;
			counter.innerHTML += ' <span class="suffix"></span>';
		}
		if (options.position == 'after') {
			$.after(counter, obj);
		} else {
			$.before(counter, obj);
		}
		var num = $.getClass('number', counter, 'span')[0];
		var initCount = getCount(obj.value.length);
		num.innerHTML = initCount;
		if (hasPrefix) {
			var prefix = $.getClass('prefix', counter, 'span')[0];
			prefix.innerHTML = initCount == 1 ? options.prefixSingular : options.prefixPlural;
		}
		if (hasSuffix) {
			var suffix = $.getClass('suffix', counter, 'span')[0];
			suffix.innerHTML = initCount == 1 ? options.suffixSingular : options.suffixPlural;
		}

		$.bind(obj, 'keyup', function(e) {
			var count = getCount(this.value.length);	
			if (count <= 0 && options.truncate) {
				this.value = this.value.substring(0, options.limit + options.limitOffset);	
			}
			num.innerHTML = count;
			addLabels(counter, count);
			if (hasPrefix) {
				prefix.innerHTML = count == 1 ? options.prefixSingular : options.prefixPlural;
			}
			if (hasSuffix) {
				suffix.innerHTML = count == 1 ? options.suffixSingular : options.suffixPlural;
			}
		});
	}
	function getCount(len) {
		return options.limit - len;
	}
	function addLabels(label, count) {
		if (count <= options.warning) {
			$.addClass(label, options.warningClass);
		} else {
			$.removeClass(label, options.warningClass);
		}
		if (count <= options.exceeded) {
			$.addClass(label, options.exceededClass);
		} else {
			$.removeClass(label, options.exceededClass);
		}
	}
});
}(AWESOME));
