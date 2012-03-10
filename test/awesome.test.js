(function($) {
	$.log('ready', 'time');
	unitTest = {
		pass : true,
		flag : []
	};
	$.ready(function() {
		$.log('ready', 'timeEnd');
		$.log('a', 'time');
		var info = $.create('DIV');
		info.id = 'info';
		$.attr(info, 'rel', 'yee');
		$.append(info, document.body);
		var pass = function(method, test) {
			test = $.isUndefined(test) ? true : test;
			if (test) {
				info.innerHTML += method +' works.<BR>';	
			} else {
				info.innerHTML += '<b>'+ method +' FAILED</b>.<BR>';	
			}
		};
		pass('ready');
		pass('create');
		pass('attr', $.attr($.getId('info'), 'rel') === 'yee');
		$.log('Safe Log Works.');
		pass('log');
		var a = $.create('DIV');
		var b = $.create('DIV');
		var c = $.create('DIV');
		a.id = 'a';
		b.id = 'b';
		c.id = 'c';
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
		function bindMethod() {
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
			pass('unbind', (bindTest.pass === false));
		}
		var linkTest = $.create('A');
		linkTest.id = 'link';
		linkTest.href = 'http://www.google.com';
		$.append(linkTest, $.getId('b'));
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
		$.addClass($.getId('a'), 'test');
		if (typeof $.getClass('test', document.body, 'DIV')[0] === 'object') {
			pass('getClass');		
		}

		if ($.hasClass($.getId('a'), 'fuuuuu')) {
			pass('hasClass', false);
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

		var text = info.innerHTML.split('<BR>');
		if (text.length === 1) {
			text = info.innerHTML.split('<br>');	
		}
		text.pop(); // clear end empty node
		info.innerHTML = '';
		var arr = $.sort({
			arr: text	
		});
		var arrLen = arr.length;
		while (arrLen--) {
			info.innerHTML += arr[arrLen] +'<BR>';
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
		if (htmlStr === "&lt;div&gt;&quot;hi there&apos;&lt;/div&gt;") {
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
				if (data.glossary.title === 'example glossary') {
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
		
		var template = "hey, #{name}. Your name is #{name} #{last}.";
		var greeting = $.template(template, {name: 'dan', last: 'masq'});
		if (greeting === 'hey, dan. Your name is dan masq.') {
			pass('templating');	
		}

		var IS_TEST = [$.create('P'), $.create('optgroup'), $.create('div'),  $.create('link')];
		var IS_TEST_LEN = IS_TEST.length;
		while (IS_TEST_LEN--) {
			if ($.is(IS_TEST[IS_TEST_LEN], 'p')) {
				pass('is');
			}
		}

		var inarraytest = ['1', 2, '34', 'dan'];
		if ($.inArray(2, inarraytest) && $.inArray('34', inarraytest)) {
			pass('inArray');
		}


		var passcount = info.innerHTML.split('<BR>');
		if (passcount.length === 1) {
			passcount = info.innerHTML.split('<br>');	
		}


		var finalResults = $.create('b')
		finalResults.innerHTML = passcount.length +' passed.<br>';
		$.prepend(finalResults, info);
		$.log('a', 'timeEnd');
	});

}(AWESOME));
