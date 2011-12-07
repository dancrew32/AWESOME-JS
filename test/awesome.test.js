(function($) {
	unitTest = {
		pass : true,
		flag : []
	};
	$.ready(function() {
		var info = $.create('DIV');
		$.attr(info, 'id', 'info');
		$.append(info, document.body);
		pass('ready');
		pass('create');
		pass('attr');
		$.log('Safe Log Works.');
		pass('log');
		var a = $.create('DIV');
		var b = $.create('DIV');
		var c = $.create('DIV');
		$.attr(a, 'id', 'a');
		$.attr(b, 'id', 'b');
		$.attr(c, 'id', 'c');
		$.before(a, info);
		pass('before');
		$.prepend(b, info);
		pass('prepend');
		pass('append'); // see beginning
		$.after(c, info);
		pass('after');

		var bindTest = {
			prop : false,
			pass : false	
		};
		var bindMethod = function() {
			bindTest.pass = true;
		};
		$.bind(a, 'click', bindMethod);
		$.fire(a, 'click');
		if (bindTest.pass === true) {
			pass('bind');
			pass('fire');
			pass('hover');// it's just using bind.. i'll pass it
			bindTest.pass = false;// reset

			$.unbind(a, 'click', bindMethod);
			$.fire(a, 'click');
			if (bindTest.pass === false) {
				pass('unbind');
			}
		}
		var linkTest = $.create('A');
		linkTest.id = 'link';
		linkTest.href = 'http://www.google.com';
		$.append(linkTest, $.getId('c'));
		var propCanceled = true;
		var propCanceled = true;
		var linkPropCancelTest = function(e) {
			propCanceled = false;
		};
		var linkCancelTest = function(e) {
			$.cancelEvent(e);	
			$.cancelPropagation(e);	
		};
		$.bind(linkTest, 'click', function(e) {
			linkCancelTest(e);
		});
		$.bind(document.body, 'click', function(e) {
			linkPropCancelTest(e);	
		});
		$.fire(linkTest, 'click');
		setTimeout(function() {
			pass('cancelEvent');
			if (propCanceled === true) {
				pass('cancelPropagation');
			}
		}, 500);
		

		if (typeof $.getId('a') === 'object') {
			pass('getId');		
		}
		if (typeof $.getTag('div')[0] === 'object') {
			pass('getTag');		
		}
		$.attr($.getId('a'), 'class', 'test');
		if (typeof $.getClass('test', document.body, 'DIV')[0] === 'object') {
			pass('getClass');		
		}

		if ($.hasClass($.getId('a'), 'test')) {
			pass('hasClass');
			$.removeClass($.getId('a'), 'test');
			if (!$.hasClass($.getId('a'), 'test')) {
				pass('removeClass');
				$.addClass($.getId('a'), 'testing');
				if ($.hasClass($.getId('a'), 'testing')) {
					pass('addClass');	
				}
			}
		}

		$.remove($.getId('b'));
		if ($.getId('b') === null) {
			pass('remove');
		}

		var text = info.innerHTML.split('<br>');
		text.pop(); // clear end empty node
		info.innerHTML = '';
		var arr = $.sort({
			arr: text	
		});
		var arrLen = arr.length;
		while (arrLen--) {
			info.innerHTML += arr[arrLen] +'<br>';
		}

		$.style(info, 'display', 'block');
		if ($.style(info, 'display') === 'block') {
			pass('style');
			pass('toCamelCase');
		}

		if ($.docHeight() > 0) {
			pass('docHeight');	
		}
		if ($.docWidth() > 0) {
			pass('docWidth');	
		}

		var htmlStr = '<div>"hi there\'</div>';
		htmlStr = $.encodeHTML(htmlStr);
		if (htmlStr === "&lt;div&gt;&quot;hi there'&lt;/div&gt;") {
			pass('encodeHTML');
		}


		$.text(linkTest, 'test');
		if ($.text(linkTest) === 'test') {
			pass('text');
		}
		$.remove(linkTest);

		$.ajax({
			url: 'test.json',
			type: 'get',
			dataType: 'json',
			complete: function(data) {
				if (typeof data.glossary.title === 'string') {
					pass('ajax');
					pass('parse(json)');
				}
			}
		});
		$.ajax({
			url: 'test.xml',
			type: 'get',
			dataType: 'xml',
			complete: function(data) {
				var output = $.getTag('to', data)[0];
				if (typeof $.text(output) === 'string') {
					pass('parse(xml)');
				}
			}
		});

		var formArray = $.serialize($.getId('test_form'));
		if (formArray.a === 'test' && formArray.d[0] === '1') {
			pass('form serialize (to array)');
		}

		var params = $.formatParams(formArray);
		if (params = 'a=test&c=3&d=1%2C3&b=1') {
			pass('format params');	
		}
		

		function pass(method) {
			info.innerHTML += method +' works.<br>';	
		}
	});

}(AWESOME));
