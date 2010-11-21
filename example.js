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

            $.screenOverlay(header, data);
        });
        
        
        // Tooltip on top!
        $.tooltip($.getTag('a', $e));


        // Make tabbed regions out of container and class="tab" child divs
        $.tabs($tabbed, 1);


        // Create/Place/Remove
        var $h = $.create('section');
            $h.innerHTML = 'I am ';
            $.attr($h, 'id', 'h'); // setter
            $.log($.attr($h, 'id')); // getter
        // Before
            // container.insertBefore($h, innerContainer);
        // Prepend
            // $.prepend($a, $h);
        // Append 
            // $a.appendChild($h);
        // After
            // $.insertAfter($sec, mySpan, $dispc);
        // Swap A with B (destructive)
            // $.swap($dispc, mySpan);
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
        $.truncate($trunc, 100); // Truncate to 100 chars
        
    });
})(AWESOME);
