(function($) {
	$.infinityScroll = (function (options) {
		options = $.setDefaults({
			checkRate: 500,
			onScroll: function() {
				this.pageHeight = $.docHeight();
				this.stop = false;
			},
			pageOffset: 1,
			viewportsToScroll: 3,
			stop: false,
			pageHeight: $.docHeight()
		}, options);

		var page = options.pageOffset;
		var scrollPosition;
		var pageHeight = $.docHeight();
		var viewPortDistancesToScroll = 3;
		var vpHeight;

		setInterval(function() {
				vpHeight = $.viewportHeight();

				var scrollPosition = $.getScrollPosition();
				var heightDifference = vpHeight * options.viewportsToScroll;
				var heightScrollDifference = pageHeight - scrollPosition;


				if (!options.stop && heightScrollDifference < heightDifference) {
						page = page + 1;
						options.stop = true;
						options.onScroll(page); // TODO: set this.stop = false, set new pageHeight in callback
				}
		}, options.checkRate);
	});
}(AWESOME));
