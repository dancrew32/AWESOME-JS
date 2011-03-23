(function($) {
$.truncate = (function (options) {
	options = $.setDefaults({
		obj:     null,
		length:  80,
		moreText: 'Read More &raquo;',
		elipsis: '...',
		className: 'readmore'
	}, options);
	if (!('length' in options.obj)) {
		options.obj = [options.obj];
	}
	var i = options.obj.length;
	while(i--) {
		var trunc = options.obj[i].innerHTML;
		if (trunc.length > options.length) {
			trunc = trunc.substring(0, options.length);
			trunc = trunc.replace(/\w+$/, "");
			trunc += options.elipsis +'<a class="'+ options.className +'" href="#" onclick="this.parentNode.innerHTML=unescape(\''+ escape(obj[i].innerHTML)+'\'); return false;">'+ options.moreText +'<\/a>';
			options.obj[i].innerHTML = trunc;
		}   
	}
});
}(AWESOME));
