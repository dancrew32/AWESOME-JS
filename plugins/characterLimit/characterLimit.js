(function($) {
$.characterLimit = (function (options) {
	options = $.setDefaults({
		obj: null,
		limit: 140,
		warning: 10,
		warningClass: 'warning',
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
		counter.innerHTML = '<span class="number"></span>';
		if (options.position == 'after') {
			$.after(counter, obj);
		} else {
			$.before(counter, obj);
		}
		var num = $.getClass('number', counter, 'span')[0];
		num.innerHTML = getCount(obj.textLength);	

		$.bind(obj, 'keyup', function(e) {
			var count = getCount(this.textLength);	
			if (count <= 0) {
				//this.value = this.value.substr(-1);	
				//todo: find how to cut back 1 character:wq
				
			}
			num.innerHTML = count;
		});
	}
	function getCount(len) {
		return options.limit - len;
	}
});
}(AWESOME));
