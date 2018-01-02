jQuery(function ($) {

    /* ============================================================ */
    /* Responsive Videos */
    /* ============================================================ */

    $(".post-content").fitVids();

    /* ============================================================ */
    /* Scroll To Top */
    /* ============================================================ */

    $(document).on('click', '.js-jump-top', function (e) {
        e.preventDefault();

        $('html, body').animate({ 'scrollTop': 0 });
    });

    /* ============================================================ */
    /* Ajax Loading */
    /* ============================================================ */

    var $ajaxContainer = $('#ajax-container');
    var currentLocation = window.location.pathname;

    function load() {
        NProgress.start();
        var url = location.href;

        // Get the requested url and replace the current content
        // with the loaded content
        $.get(url, function (result) {
            var $html = $(result);
            var $newContent = embed.loadGists($('#ajax-container', $html).contents());
            

            // Set the title to the requested urls document title
            document.title = $html.filter('title').text();

            $('html, body').animate({ 'scrollTop': 0 });

            $ajaxContainer.fadeOut(500, function () {
                // Re run fitvid.js
                $newContent.fitVids();

                $ajaxContainer.html($newContent);
                PR.prettyPrint();

                if(window.onPostLoad && typeof window.onPostLoad === 'function') {
                    window.onPostLoad();
                }                

                $ajaxContainer.fadeIn(500);

                NProgress.done();
                
            });
        }).fail(function () {
            // Request fail
            NProgress.done();
            location.reload();
        });
    }

    window.onpopstate = function(e) {
        console.log(e);
        if (e.state === null || window.disableAJAX) {
            return;
        }
        currentLocation = window.location.pathname;
        load();
    };

    $(document).on('click', 'a', function (e) {
        // If not using ajax loading then skip
        if(window.disableAJAX) return true;

        // Or skip if it is a hash tag update
        if(/^#/.test($(this).attr('href'))) {
            return true;
        }
        
        e.preventDefault();
        e.stopPropagation();

        var regex = new RegExp('/' + window.location.host + '/');
        var href = this.href;
        if (!regex.test(href)) {
            // load external resources in a new tab.
            window.open(href, '_blank');
        } else {
            // load internal resources with AJAX.
            history.pushState({}, null, href);
            load();
        }
    });

});
