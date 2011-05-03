(function($) {
	$.dragDrop = {
		keyHTML: '<a href="#" class="keyLink">#</a>',
		keySpeed: 10, // pixels per keypress event
		initialMouseX: undefined,
		initialMouseY: undefined,
		startX: undefined,
		startY: undefined,
		dXKeys: undefined,
		dYKeys: undefined,
		draggedObject: undefined,
		initElement: function (element) {
			element.onmousedown = $.dragDrop.startDragMouse;
			element.innerHTML += $.dragDrop.keyHTML;
			var links = element.getElementsByTagName('a');
			var lastLink = links[links.length - 1];
			lastLink.relatedElement = element;
			lastLink.onclick = $.dragDrop.startDragKeys;
		},
		startDragMouse: function (e) {
			$.dragDrop.startDrag(this);
			var evt = e || window.event;
			$.dragDrop.initialMouseX = evt.clientX;
			$.dragDrop.initialMouseY = evt.clientY;
			$.bind(document, 'mousemove', $.dragDrop.dragMouse);
			$.bind(document, 'mouseup', $.dragDrop.releaseElement);
			return false;
		},
		startDragKeys: function () {
			$.dragDrop.startDrag(this.relatedElement);
			$.dragDrop.dXKeys = $.dragDrop.dYKeys = 0;
			$.bind(document, 'keydown', $.dragDrop.dragKeys);
			$.bind(document, 'keypress', $.dragDrop.switchKeyEvents);
			this.blur();
			return false;
		},
		startDrag: function (obj) {
			if ($.dragDrop.draggedObject)
				$.dragDrop.releaseElement();
			$.dragDrop.startX = obj.offsetLeft;
			$.dragDrop.startY = obj.offsetTop;
			$.dragDrop.draggedObject = obj;
			obj.className += ' dragged';
		},
		dragMouse: function (e) {
			var evt = e || window.event;
			var dX = evt.clientX - $.dragDrop.initialMouseX;
			var dY = evt.clientY - $.dragDrop.initialMouseY;
			$.dragDrop.setPosition(dX,dY);
			return false;
		},
		dragKeys: function(e) {
			var evt = e || window.event;
			var key = evt.keyCode;
			switch (key) {
				case 37: // left
				case 63234:
					$.dragDrop.dXKeys -= $.dragDrop.keySpeed;
					break;
				case 38: // up
				case 63232:
					$.dragDrop.dYKeys -= $.dragDrop.keySpeed;
					break;
				case 39: // right
				case 63235:
					$.dragDrop.dXKeys += $.dragDrop.keySpeed;
					break;
				case 40: // down
				case 63233:
					$.dragDrop.dYKeys += $.dragDrop.keySpeed;
					break;
				case 13: // enter
				case 27: // escape
					$.dragDrop.releaseElement();
					return false;
				default:
					return true;
			}
			$.dragDrop.setPosition($.dragDrop.dXKeys, $.dragDrop.dYKeys);
			$.cancelEvent(evt);
			return false;
		},
		setPosition: function (dx,dy) {
			$.dragDrop.draggedObject.style.left = $.dragDrop.startX + dx + 'px';
			$.dragDrop.draggedObject.style.top = $.dragDrop.startY + dy + 'px';
		},
		switchKeyEvents: function () {
			$.unbind(document, 'keydown', $.dragDrop.dragKeys);
			$.unbind(document, 'keypress', $.dragDrop.switchKeyEvents);
			$.bind(document, 'keypress', $.dragDrop.dragKeys);
		},
		releaseElement: function() {
			$.unbind(document, 'mousemove', $.dragDrop.dragMouse);
			$.unbind(document, 'mouseup', $.dragDrop.releaseElement);
			$.unbind(document, 'keypress', $.dragDrop.dragKeys);
			$.unbind(document, 'keypress', $.dragDrop.switchKeyEvents);
			$.unbind(document, 'keydown', $.dragDrop.dragKeys);
			$.dragDrop.draggedObject.className = $.dragDrop.draggedObject.className.replace(/dragged/,'');
			$.dragDrop.draggedObject = null;
		}
	};
}(AWESOME));
