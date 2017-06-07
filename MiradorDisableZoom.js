var MiradorDisableZoom = {

    // TODO: add more locales
    locales: {
        'en': {
            'button-tooltip': 'Disable zoom controls on this window'
        }
    },

    template: Mirador.Handlebars.compile([
        '<a href="javascript:;" class="mirador-btn mirador-icon-disable-zoom contained-tooltip" title="{{t "button-tooltip"}}">',
            '<i class="fa fa-search fa-lg fa-fw"></i>',
            '<i class="fa fa-lock"></i>',
        '</a>'
    ].join('')),

    init: function() {
        var _this = this;

        // add locales for this button
        i18next.on('initialized', function() {
            for (var locale in _this.locales) {
                i18next.addResources(locale, 'translation', _this.locales[locale]);
            };
        });

        /*
         * extends
         *
         * Mirador.Window
         */
        (function() {
            // put inside a closure so we can reuse the following variable declarations in the other classes' method extensions
            var constructor = Mirador.Window,
                prototype = Mirador.Window.prototype,
                listenForActions = Mirador.Window.prototype.listenForActions;

            Mirador.Window.prototype.listenForActions = function() {
                listenForActions.apply(this, arguments);

                // turn off zoom disable when we change the current canvas
                this.eventEmitter.subscribe('SET_CURRENT_CANVAS_ID.' + this.id, function(event) {
                    this.toggleZoomLock(this.element.find('.mirador-icon-disable-zoom'), false);
                }.bind(this));

                // turn off zoom disable when we change between ImageView and BookView
                // FIXME: the following attempt throws an exception
                /*
                this.eventEmitter.subscribe('focusUpdated' + this.id, function(event) {
                    // toggle window zoom off
                    this.toggleZoomLock(this.element.find('.mirador-icon-disable-zoom'), false);
                }.bind(this));
                */
            };


            Mirador.Window = function() {
                var w = new constructor($.extend(true, Array.prototype.slice.call(arguments)[0], {
                    windowZoomDisabled: false
                }));

                // add button (the compiled template) to the DOM
                w.element.find('.window-manifest-navigation').prepend(_this.template());

                // TODO: do the following by extending bindEvents instead, for consistency with how we are extending listenForActions
                w.element.find('.mirador-icon-disable-zoom').on('click', function(event) {
                    w.toggleZoomLock(this, !w.windowZoomDisabled);
                });

                return w;
            };

            // restore the prototype
            // TODO: there is probably a better way to make sure the prototype is not lost -- is this necessary?
            Mirador.Window.prototype = prototype;

            /*
            * Mirador.Window.prototype.toggleZoomLock
            *
            * Disables or enables this window's zoom controls.
            * @param {Object} linkElement
            *   The <a> element with class '.mirador-icon-disable-zoom'.
            * @param {Boolean} disableOsdZoom
            *   Whether to set this window's zoom to enabled (false) or disabled (true).
            */
            Mirador.Window.prototype.toggleZoomLock = function(linkElement, disableOsdZoom) {
                if (disableOsdZoom === true) {
                    this.eventEmitter.publish("disableOsdZoom." + this.id);
                    $(linkElement).addClass('selected');
                } else {
                    this.eventEmitter.publish("enableOsdZoom." + this.id);
                    $(linkElement).removeClass('selected');
                }
                this.windowZoomDisabled = !!disableOsdZoom;
            };
        })();


        /*
         * extends
         *
         * Mirador.ImageView
         * Mirador.BookView
         */
        (function() {
            ['ImageView', 'BookView'].forEach(function(viewType) {
                var constructor = Mirador[viewType],
                    listenForActions = Mirador[viewType].prototype.listenForActions;
            
                Mirador[viewType].prototype.listenForActions = function() {
                    listenForActions.apply(this, arguments);
                    this.eventEmitter.subscribe('disableOsdZoom.' + this.windowId, function(event) {
                        // 1 is the multiplicative identity
                        this.osd.zoomPerClick = 1;
                        this.osd.zoomPerScroll = 1;
                    }.bind(this));
                    this.eventEmitter.subscribe('enableOsdZoom.' + this.windowId, function(event) {
                        // restore the default settings
                        this.osd.zoomPerClick = this.defaultWindowZoomPerClick;
                        this.osd.zoomPerScroll = this.defaultWindowZoomPerScroll;
                    }.bind(this));
                };

                Mirador[viewType] = function() {
                    return new constructor($.extend(true, Array.prototype.slice.call(arguments)[0], {
                        // TODO: read this from the OSD configuration instead of using this magic number
                        defaultWindowZoomPerClick: 1.2,
                        defaultWindowZoomPerScroll: 1.2
                    }));
                };
            });
        })();
    }
};

$(document).ready(function() {
    MiradorDisableZoom.init();
});
