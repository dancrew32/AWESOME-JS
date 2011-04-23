(function($) {
$.tabs = (function (options) {
	options = $.setDefaults({
		obj: null,
		open: 1,
		tabClass: 'tab',
		containerClass: 'tabs'
	}, options);

	if (!('length' in options.obj)) {
		options.obj = [options.obj];
	}
	var i = options.obj.length;
	while(i--) {
		var obj = options.obj[i];

			// Generate Tabs
		var tabHtml = "";
		var panes = $.getClass(options.tabClass, obj, 'div').reverse();
		var panesLen = tabsLen = panes.length;
		while(panesLen--) {
			var pane = panes[panesLen];
			tabHtml += '<li id="tab-'+ pane.id +'"><a href="#">'+ $.attr(pane, "title") +'</a></li>';
		}
		var tabContainer = $.create('UL');
		tabContainer.innerHTML = tabHtml;
		$.addClass(tabContainer, options.containerClass);
		$.prepend(tabContainer, obj);

		// Add Tab Bindings
		var tabs = $.getTag('li', tabContainer);
		var toOpen = -options.open + tabsLen;
		while(tabsLen--) {
			if (tabsLen != toOpen) {
				panes[tabsLen].style.display = 'none'; // init hide
			}
			$.bind(tabs[tabsLen], 'click', function(e) {
				$.cancelEvent(e);
				panesLen = panes.length; // reset
				while(panesLen--) {
					panes[panesLen].style.display = 'none';
				}
				var related = $.getId(this.id.split('tab-')[1]);
				related.style.display = "";
			});
		}
	}
});
}(AWESOME));
