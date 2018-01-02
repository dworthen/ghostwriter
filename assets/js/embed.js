(function($) {
    function add_stylesheet_once( url ){
        $head = $('head');
        if( $head.find('link[rel="stylesheet"][href="'+url+'"]').length < 1 )
            $head.append('<link rel="stylesheet" href="'+ url +'" type="text/css" />');
    }

    function add_script_once( url, cb ){
        cb = cb || function() {};
        if( $('head').find('script[src="'+url+'"]').length < 1 ) 
        {
            var d = document, s = d.createElement('script');
            s.setAttribute('src', url);
            s.setAttribute('data-timestamp', +new Date());
            s.onload = cb;
            d.head.appendChild(s);
        } else {
            cb();
        }
    }

    function loadDisqus(id, url) {
        if(window.disqusUrl && window) {
            add_script_once(window.disqusUrl, function() {
                DISQUS.reset({
                    reload: true,
                    config: function() {
                        this.page.identifier = id;
                        this.page.url = url
                    }
                });
            });
        }
    }

    function loadGists($contents) {
        var $gists = $contents.find('script[src*="gist.github.com/"]');

        if( $gists.length ){
            
            // update each gist
            $gists.each(function(){
        
                // we need to store $this for the callback
                var $this = $(this);
        
                // load gist as json instead with a jsonp request
                $.getJSON( $this.attr('src') + 'on?callback=?', function( data ) {
        
                    // replace script with gist html
                    $this.replaceWith( $( data.div ) );
        
                    // load the stylesheet, but only once…
                    add_stylesheet_once( data.stylesheet );
        
                });
        
            });
        
        }
        return $contents;
    }

    window.embed = {
        add_stylesheet_once: add_stylesheet_once,
        add_script_once: add_script_once,
        loadDisqus: loadDisqus,
        loadGists: loadGists
    };

})(jQuery);
