(function($) {
$.screenOverlay = (function (options) {
	options = $.setDefaults({
		header:     null,
		headerType: 'h2',
		data:       null,
		lightboxId: 'lightbox',
		id:         'screen-overlayer',
		closeText:  'Close'
	}, options);
	var $this = this;
	var didResize = false;
	
	// init	
	makeOverlay($this.docWidth(), $this.docHeight(), options.id);

	// Make Viewport-sized grey area
	function makeOverlay(windowWidth, windowHeight, id) {
		var $body = document.body,
			overlayer = $this.getId(id),
			lightbox = $this.getId(options.lightboxId),
			lightboxClose = $this.getId(options.lightboxId + '-close');
			
		if (!overlayer && !lightbox) {
			var overlayDIV = $this.create('div'),
				lightboxDIV = $this.create('div');

			$this.prepend(overlayDIV, $body);
			$this.attr(overlayDIV, 'id', id);

			$this.prepend(lightboxDIV, $body);
			$this.attr(lightboxDIV, 'id', options.lightboxId);

			$this.addClass(document.documentElement, 'has-overlay');
			
			var overlayer = $this.getId(id),
			lightbox = $this.getId(options.lightboxId);

			// Output for lightbox
			var lightboxOutput = '<a href="#' + options.lightboxId + '-close" id="' + options.lightboxId + '-close">'+
				options.closeText +'</a><div id="' + options.lightboxId + '-inner">';
			if (options.header) {
				lightboxOutput += '<div class="header"><' + options.headerType + '>' + 
					options.header + '</' + options.headerType + '></div>';
			}
			lightboxOutput += '<div class="content">' + options.data + '</div></div>';
			lightbox.innerHTML = lightboxOutput;

			var lightboxClose = $this.getId(options.lightboxId + '-close');
		}

		$this.style(overlayer, 'width', windowWidth + 'px');
		$this.style(overlayer, 'height', windowHeight + 'px');
		
		function closeOverlay() {
			$this.removeClass(document.documentElement, 'has-overlay');
			$this.remove(lightbox);
			$this.remove(overlayer);
		}

		// Bind close on overlayer
		$this.bind(overlayer, 'click', function () {
			closeOverlay();
		});
		
		// bind close button click
		$this.bind(lightboxClose, 'click', function (e) {
			$this.cancelEvent(e);
			closeOverlay();
		});
		
		// bind resizing
		window.onresize = function() {
			didResize = true;
		};
		
		setInterval(function() {
			if (didResize) {
				didResize = false;
				$this.style($this.getId(options.id), 'width', $this.docWidth() + 'px');
				$this.style($this.getId(options.id), 'height', $this.docHeight() + 'px');
			}
		}, 200);
	}
});
}(AWESOME));
