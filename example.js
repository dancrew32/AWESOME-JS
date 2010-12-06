// Example Awesome Implementation
(function ($) {
    $.ready(function () {
        // Doc Js Test
        $.removeClass(document.documentElement, 'no-js');
        $.addClass(document.documentElement, 'js');

        // Selectors
        var $body    = document.body,
            $a       = $.getId('a'),
            $b       = $.getId('b'),
            $c       = $.getId('c'),
            $d       = $.getId('d'),
            $trunc   = $.getId('trunc'),
            $e       = $.getId('e'),
            $f       = $.getId('f'),
            $g       = $.getId('g'),
            $divs    = $.getTag('div'),
            $special = $.getClass('special'),
            $tabbed  = $.getId('stuff');

        // Add Lightbox style popup (bind pattern)
        $.bind($b, 'click', function (e) {
            $.cancelEvent(e);

            var header = "Here's My Lightbox!",
                data = "Here is my text content for this lightbox";

            $.screenOverlay({
            	header: header, 
            	data: data
            });
        });
        
        
        // Tooltips
        $.tooltip($.getTag('a', $e)); // top (default)
        //$.tooltip($.getTag('a', $e), {
        //	pos: 'left'
        //});
        //$.tooltip($.getTag('a', $e), {
        //	pos: 'right'
        //});
        //$.tooltip($.getTag('a', $e), {
        //	pos: 'bottom'
        //});


        // Make tabbed regions out of container and class="tab" child divs
        $.tabs($tabbed, {
        	open: 1,
        	hist: true
        }); // First tab open


		// Animation 
		$.animate($f, {
			'color': { to : 'f00f00' }
		}, 1000, function() {
			$.log('foo');
		});
		

        // Create/Place/Remove
        var newNode = $.create('section');
            newNode.innerHTML = 'I am ';
            $.attr(newNode, 'id', 'h'); // setter
            $.log($.attr(newNode, 'id')); // getter
        // Before (insert newNode before node)
            // $.before(newNode, node);
        // Prepend (prepend newNode to $a)
            // $.prepend(newNode, $a);
        // Append (append newNode to $a)
            // $.append(newNode, $a);
        // After (insert newNode after $a)
            //$.after(newNode, $a);
        // Swap A with B (destructive)
            // $.swap($a, $b);
        // Remove element
            // $.remove($h);
            

        // add/remove/hasclass
        if ($.hasClass(document.documentElement, 'js')) {
          $c.innerHTML = 'Javascript is Enabled.';    
        }
        $.addClass($special, 'foo');
        $.removeClass($special, 'special'); // safely removes a class
        $.addClass($special, 'bar'); // Safely add mulitple classes
        

        $.hover($b, function() {
          $.style($b, 'background-color', '#000000'); // Setter
          $.log($.style($b, 'background-color')); // getter
        }, function() {
          $.style($b, 'background-color', '#888888');    
        });
        
        // Cookies
        $.createCookie('foobar', 'Cookie Testing');
        var cook = $.readCookie('foobar');
        $.log(cook);

        // Truncation example
        $.truncate($trunc, {
        	len: 100,
        	elipsis: null,
        	moreText: '...'
        }); // Truncate to 100 chars
        
        // $.history();
        //invoke back
        // window.history.back();
        // window.history.forward();
        
        
        $.textLimit($.getTag('input'), {
        	maximum: 15
       	});
        
    });
})(AWESOME);
