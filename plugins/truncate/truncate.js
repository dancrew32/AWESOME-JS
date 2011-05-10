(function($) {
$.truncate = (function (obj, options) {
	options = $.setDefaults({
		length:  80,
		moreText: 'Read More &raquo;',
		elipsis: '...',
		className: 'readmore'
	}, options);
	if (!('length' in obj)) {
		obj = [obj];
	}
	var i = obj.length;
	while(i--) {
		var trunc = obj[i].innerHTML;
		if (trunc.length > options.length) {
			trunc = trunc.substring(0, options.length);
			trunc = trunc.replace(/\w+$/, "");
			trunc += options.elipsis +'<a class="'+ options.className +'" href="#" onclick="this.parentNode.innerHTML=unescape(\''+ escape(obj[i].innerHTML)+'\'); return false;">'+ options.moreText +'<\/a>';
			obj[i].innerHTML = trunc;
		}   
	}
});
}(AWESOME));
