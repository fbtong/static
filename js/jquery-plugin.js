/*
 * 这是前端框架的核心js文件，包含第三方plugin
 * Copyright: 远信科技, All Rights Reserved.
 * @author: Zhigang.li
*/

/*
 * Browser detect
 * */
(function( jQuery, window, undefined ) {
	'use strict';
	 
	var matched, browser;
	 
	jQuery.uaMatch = function( ua ) {
	  ua = ua.toLowerCase();
	 
		var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
			/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
			/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
			/(msie) ([\w.]+)/.exec( ua ) ||
			ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
			[];
	
		var platform_match = /(ipad)/.exec( ua ) ||
			/(iphone)/.exec( ua ) ||
			/(android)/.exec( ua ) ||
			[];
	 
		return {
			browser: match[ 1 ] || "",
			version: match[ 2 ] || "0",
			platform: platform_match[0] || ""
		};
	};
	 
	matched = jQuery.uaMatch( window.navigator.userAgent );
	browser = {};
	 
	if ( matched.browser ) {
		browser[ matched.browser ] = true;
		browser.version = matched.version;
	}
	if ( matched.platform) {
		browser[ matched.platform ] = true;
	}
	 
	// Chrome is Webkit, but Webkit is also Safari.
	if ( browser.chrome ) {
		browser.webkit = true;
	} else if ( browser.webkit ) {
		browser.safari = true;
	}
	jQuery.browser = browser;
})( jQuery, window );

/*
 * Transition
 * */
!function ($) {
  'use strict'; // jshint ;_;

  $(function () {
    $.support.transition = (function () {
      var transitionEnd = (function () {
        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name;

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name];
          }
        }
      }());

      return transitionEnd && {
        end: transitionEnd
      };
    })();
  });

}(window.jQuery);

/*
 * Spin
 */
(function(root, factory) {

  /* CommonJS */
  if (typeof exports == 'object')  module.exports = factory();

  /* AMD module */
  else if (typeof define == 'function' && define.amd) define(factory);

  /* Browser global */
  else root.Spinner = factory();
}
(this, function() {
  "use strict";

  var prefixes = ['webkit', 'Moz', 'ms', 'O'] /* Vendor prefixes */
    , animations = {} /* Animation rules keyed by their name */
    , useCssAnimations; /* Whether to use CSS animations or setTimeout */

  function createEl(tag, prop) {
    var el = document.createElement(tag || 'div')
      , n;

    for(n in prop) el[n] = prop[n];
    return el;
  }

  function ins(parent /* child1, child2, ...*/) {
    for (var i=1, n=arguments.length; i<n; i++)
      parent.appendChild(arguments[i]);

    return parent;
  }

  var sheet = (function() {
    var el = createEl('style', {type : 'text/css'});
    ins(document.getElementsByTagName('head')[0], el);
    return el.sheet || el.styleSheet;
  }());

  function addAnimation(alpha, trail, i, lines) {
    var name = ['opacity', trail, ~~(alpha*100), i, lines].join('-')
      , start = 0.01 + i/lines * 100
      , z = Math.max(1 - (1-alpha) / trail * (100-start), alpha)
      , prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase()
      , pre = prefix && '-' + prefix + '-' || '';

    if (!animations[name]) {
      sheet.insertRule(
        '@' + pre + 'keyframes ' + name + '{' +
        '0%{opacity:' + z + '}' +
        start + '%{opacity:' + alpha + '}' +
        (start+0.01) + '%{opacity:1}' +
        (start+trail) % 100 + '%{opacity:' + alpha + '}' +
        '100%{opacity:' + z + '}' +
        '}', sheet.cssRules.length);

      animations[name] = 1;
    }

    return name;
  }

  function vendor(el, prop) {
    var s = el.style
      , pp
      , i;

    if(s[prop] !== undefined) return prop;
    prop = prop.charAt(0).toUpperCase() + prop.slice(1);
    for(i=0; i<prefixes.length; i++) {
      pp = prefixes[i]+prop;
      if(s[pp] !== undefined) return pp;
    }
  }
  
  function css(el, prop) {
    for (var n in prop)
      el.style[vendor(el, n)||n] = prop[n];

    return el;
  }

  function merge(obj) {
    for (var i=1; i < arguments.length; i++) {
      var def = arguments[i];
      for (var n in def)
        if (obj[n] === undefined) obj[n] = def[n];
    }
    return obj;
  }

  function pos(el) {
    var o = { x:el.offsetLeft, y:el.offsetTop };
    while((el = el.offsetParent))
      o.x+=el.offsetLeft, o.y+=el.offsetTop;

    return o;
  }

  var defaults = {
    lines: 10,            // The number of lines to draw
    length: 8,            // The length of each line
    width: 3,             // The line thickness
    radius: 8,           // The radius of the inner circle
    rotate: 0,            // Rotation offset
    corners: 1,           // Roundness (0..1)
    color: '#000',        // #rgb or #rrggbb
    direction: 1,         // 1: clockwise, -1: counterclockwise
    speed: 1,             // Rounds per second
    trail: 100,           // Afterglow percentage
    opacity: 1/4,         // Opacity of the lines
    fps: 20,              // Frames per second when using setTimeout()
    zIndex: 2e9,          // Use a high z-index by default
    className: 'spinner', // CSS class to assign to the element
    top: 'auto',          // center vertically
    left: 'auto',         // center horizontally
    position: 'relative'  // element position
  };

  /** The constructor */
  function Spinner(o) {
    if (typeof this == 'undefined') return new Spinner(o);
    this.opts = merge(o || {}, Spinner.defaults, defaults);
  }

  // Global defaults that override the built-ins:
  Spinner.defaults = {};

  merge(Spinner.prototype, {
    spin: function(target) {
      this.stop();

      var self = this
        , o = self.opts
        , el = self.el = css(createEl(0, {className: o.className}), {position: o.position, width: 0, zIndex: o.zIndex})
        , mid = o.radius+o.length+o.width
        , ep // element position
        , tp; // target position

      if (target) {
        target.insertBefore(el, target.firstChild||null);
        tp = pos(target);
        ep = pos(el);
        css(el, {
          left: (o.left == 'auto' ? tp.x-ep.x + (target.offsetWidth >> 1) : parseInt(o.left, 10) + mid) + 'px',
          top: (o.top == 'auto' ? tp.y-ep.y + (target.offsetHeight >> 1) : parseInt(o.top, 10) + mid)  + 'px'
        });
      }

      el.setAttribute('role', 'progressbar');
      self.lines(el, self.opts);

      if (!useCssAnimations) {
        // No CSS animation support, use setTimeout() instead
        var i = 0
          , start = (o.lines - 1) * (1 - o.direction) / 2
          , alpha
          , fps = o.fps
          , f = fps/o.speed
          , ostep = (1-o.opacity) / (f*o.trail / 100)
          , astep = f/o.lines

        ;(function anim() {
          i++;
          for (var j = 0; j < o.lines; j++) {
            alpha = Math.max(1 - (i + (o.lines - j) * astep) % f * ostep, o.opacity);

            self.opacity(el, j * o.direction + start, alpha, o);
          }
          self.timeout = self.el && setTimeout(anim, ~~(1000/fps));
        })();
      }
      return self;
    },

    stop: function() {
      var el = this.el;
      if (el) {
        clearTimeout(this.timeout);
        if (el.parentNode) el.parentNode.removeChild(el);
        this.el = undefined;
      }
      return this;
    },

    lines: function(el, o) {
      var i = 0
        , start = (o.lines - 1) * (1 - o.direction) / 2
        , seg;

      function fill(color, shadow) {
        return css(createEl(), {
          position: 'absolute',
          width: (o.length+o.width) + 'px',
          height: o.width + 'px',
          background: color,
          boxShadow: shadow,
          transformOrigin: 'left',
          transform: 'rotate(' + ~~(360/o.lines*i+o.rotate) + 'deg) translate(' + o.radius+'px' +',0)',
          borderRadius: (o.corners * o.width>>1) + 'px'
        });
      }

      for (; i < o.lines; i++) {
        seg = css(createEl(), {
          position: 'absolute',
          top: 1+~(o.width/2) + 'px',
          transform: o.hwaccel ? 'translate3d(0,0,0)' : '',
          opacity: o.opacity,
          animation: useCssAnimations && addAnimation(o.opacity, o.trail, start + i * o.direction, o.lines) + ' ' + 1/o.speed + 's linear infinite'
        });

        if (o.shadow) ins(seg, css(fill('#000', '0 0 4px ' + '#000'), {top: 2+'px'}));

        ins(el, ins(seg, fill(o.color, '0 0 1px rgba(0,0,0,.1)')));
      }
      return el;
    },

    opacity: function(el, i, val) {
      if (i < el.childNodes.length) el.childNodes[i].style.opacity = val;
    }

  });

  function initVML() {
    /* Utility function to create a VML tag */
    function vml(tag, attr) {
      return createEl('<' + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr);
    }

    // No CSS transforms but VML support, add a CSS rule for VML elements:
    sheet.addRule('.spin-vml', 'behavior:url(#default#VML)');

    Spinner.prototype.lines = function(el, o) {
      var r = o.length+o.width
        , s = 2*r;

      function grp() {
        return css(
          vml('group', {
            coordsize: s + ' ' + s,
            coordorigin: -r + ' ' + -r
          }),
          { width: s, height: s }
        );
      }

      var margin = -(o.width+o.length)*2 + 'px'
        , g = css(grp(), {position: 'absolute', top: margin, left: margin})
        , i;

      function seg(i, dx, filter) {
        ins(g,
          ins(css(grp(), {rotation: 360 / o.lines * i + 'deg', left: ~~dx}),
            ins(css(vml('roundrect', {arcsize: o.corners}), {
                width: r,
                height: o.width,
                left: o.radius,
                top: -o.width>>1,
                filter: filter
              }),
              vml('fill', {color: o.color, opacity: o.opacity}),
              vml('stroke', {opacity: 0}) // transparent stroke to fix color bleeding upon opacity change
            )
          )
        );
      }

      if (o.shadow)
        for (i = 1; i <= o.lines; i++)
          seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)');

      for (i = 1; i <= o.lines; i++) seg(i);
      return ins(el, g);
    };

    Spinner.prototype.opacity = function(el, i, val, o) {
      var c = el.firstChild;
      o = o.shadow && o.lines || 0;
      if (c && i+o < c.childNodes.length) {
        c = c.childNodes[i+o]; c = c && c.firstChild; c = c && c.firstChild;
        if (c) c.opacity = val;
      }
    };
  }

  var probe = css(createEl('group'), {behavior: 'url(#default#VML)'});

  if (!vendor(probe, 'transform') && probe.adj) initVML();
  else useCssAnimations = vendor(probe, 'animation');

  return Spinner;

}));
(function(factory) {

  if (typeof exports == 'object') {
    // CommonJS
    factory(require('jquery'), require('spin'));
  }
  else if (typeof define == 'function' && define.amd) {
    // AMD, register as anonymous module
    define(['jquery', 'spin'], factory);
  }
  else {
    // Browser globals
    if (!window.Spinner) throw new Error('Spin.js not present');
    factory(window.jQuery, window.Spinner);
  }

}(function($, Spinner) {

  $.fn.spin = function(opts, color) {

    return this.each(function() {
      var $this = $(this),
        data = $this.data();

      if (data.spinner) {
        data.spinner.stop();
        delete data.spinner;
      }
      if (opts !== false) {
        opts = $.extend(
          { color: color || $this.css('color') },
          $.fn.spin.presets[opts] || opts
        );
        data.spinner = new Spinner(opts).spin(this);
      }
    });
  };

  $.fn.spin.presets = {
    tiny: { lines: 8, length: 2, width: 2, radius: 3 },
    small: { lines: 8, length: 4, width: 3, radius: 5 },
    large: { lines: 10, length: 8, width: 4, radius: 8 }
  };
}));

/*
 * SelectBox
 * */
;!function ($) {
	'use strict';

	var Selectbox = function (element, options) {
		this.init('selectbox', element, options);
	};

	Selectbox.prototype = {
		constructor: Selectbox,
		
		init: function (type, element, options) {
			var that = this;
			that.type = type;
			that.$element = $(element);
			that.options = this.getOptions(options);
			
			that.$ul = that.$element.find('ul');
			that.$btn = that.$element.find('.btn');
			that.$inputfield = that.$element.find('input.inputfield[data-role="label"]');
			that.$valuefield = that.$element.find('input[data-role="value"]');
			
			that.$ul.hide();
			that.$element.css('width', that.options.width);
			that.$inputfield.css('width', that.$element.width() - 23).attr('readonly', 'true');
			that.$ul.find('li[data-value="'+that.$valuefield.val()+'"]').addClass('active');
			
			if (that.options.disabled) {
				that.disable();
			}
			else {
				that.enable();
			}
		},
		_bindEvents: function() {
			var that = this;
			
			that.$btn.off('click').on('click', function(e) {
				e.stopPropagation();
				that.toggle();
			});
			that.$ul.find('li').off('click').on('click', function(e) {
				e.stopPropagation();
				that.select($(this));
			});
		},
		_unBindEvents: function() {
			var that = this;
			
			that.$btn.off('click');
			that.$ul.find('li').off('click');
		},
		getOptions: function (options) {
			options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options);

			return options;
		},
		toggle: function() {
			var that = this;

			if (that.$ul.is(':hidden')) {
				that.show();
			}
			else {
				that.close();
			}
		},
		select: function(elem) {
			var that = this;
			
			that.$ul.find('li').removeClass('active');
			elem.addClass('active');
			that.$inputfield.val(elem.text());
			that.$valuefield.val(elem.data('value'));
			that.close();
			
			if (that.options.changed && typeof that.options.changed === 'function') {
				that.options.changed.call(that, {name: elem.text(), value: elem.data('value')});
			}
		},
		show: function() {
			var that = this;
			
			that.$ul.show(200, function() {
				$(this).css('overflow', 'auto');
			});
			that.$btn.addClass('selected');
			that.$btn.find('i').addClass('icon-white');
		},
		close: function() {
			var that = this;
			
			that.$ul.hide(100);
			that.$btn.removeClass('selected');
			that.$btn.find('i').removeClass('icon-white');
		},
		disable: function() {
			var that = this;
			
			that.$element.addClass('disabled');
			that._unBindEvents();
		},
		enable: function() {
			var that = this;
			
			that.$element.removeClass('disabled');
			that._bindEvents();
		},
		selected: function(index) {
			var that = this;
			
			that.select(that.$ul.find('li:nth-child('+index+')'));
		},
		add: function(args) {
			var that = this;
			
			that.$ul.append('<li data-value="'+args.value+'">'+args.label+'</li>');
			that.$ul.find('li:last-child').on('click', function(e) {
				e.stopPropagation();
				that.select($(this));
			});
		},
		adds: function(args) {
			var that = this;
			
			$.each(args, function(i, v) {
				that.$ul.append('<li data-value="'+v.value+'">'+v.label+'</li>');
				that.$ul.find('li:last-child').on('click', function(e) {
					e.stopPropagation();
					that.select($(this));
				});
			});
		},
		remove: function(args) {
			var that = this;
			
			that.$ul.find('li[data-value="'+args.value+'"]').remove();
			if (that.$valuefield.val() === args.value) {
				that.$valuefield.val('');
				that.$inputfield.val('');
			}
		},
		removes: function(args) {
			var that = this;
			
			$.each(args, function(i, v) {
				that.$ul.find('li[data-value="'+v.value+'"]').remove();
				if (that.$valuefield.val() === v.value) {
					that.$valuefield.val('');
					that.$inputfield.val('');
				}
			});
		},
		empty: function() {
			var that = this;
			
			that.$ul.empty();
			that.$valuefield.val('');
			that.$inputfield.val('');
		}
	};

	$.fn.selectbox = function (option, args) {
		return this.each(function () {
			var $this = $(this);
			var data = $this.data('selectbox');
			var options = typeof option === 'object' && option;
			if (!data) {
				$this.data('selectbox', (data = new Selectbox(this, options)));
			}
			if (typeof option === 'string') {
				data[option](args);
			}
		});
	};

	$.fn.selectbox.Constructor = Selectbox;
	$.fn.selectbox.defaults = {
			width: 148,
			disabled: false
	};
}(window.jQuery);

/*
 * iCheckbox
 * */
;!function ($) {
	'use strict';

	var ICheckbox = function (element, options) {
		this.init('icheckbox', element, options);
	};

	ICheckbox.prototype = {
		constructor: ICheckbox,
		
		init: function (type, element, options) {
			var that = this;
			that.type = type;
			that.$element = $(element);
			that.domId = that.$element.attr('id');
			that.options = this.getOptions(options);
			
			var boxHtml = '<div class="icheckbox"></div>';
			var helper = '<i class="icheck-helper"></i>';
			var $label = that.$element.next('label[for="'+that.domId+'"]');
			that.$element.wrap(boxHtml);
			that.$box = that.$element.parent();
			that.$box.append(helper);
			that.$box.append($label);
			that.$label = that.$box.find('label');
			that.$input = that.$box.find('input');
			that.$helper = that.$box.find('.icheck-helper');
			
			if (that.$element.is(':checked') || that.options.checked) {
				that.checked();
			}
			if (that.$element.is(':disabled') || that.options.disabled) {
				that.disable();
				that._unBindEvents();
			}
			else {
				that._bindEvents();
			}
		},
		_bindEvents: function() {
			var that = this;
			
			that.$box.on('click', function(e) {
				e.stopPropagation();
				that.toggle.call(that);
			});
		},
		_unBindEvents: function() {
			var that = this;
			
			that.$box.off('click');
		},
		getOptions: function (options) {
			options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options);

			return options;
		},
		toggle: function() {
			var that = this;
			
			if (that.$element.prop('checked')) {
				that.unchecked();
				if (that.options.uncheck && typeof that.options.uncheck === 'function') {
					that.options.uncheck.call(that, that.$element);
				}
			}
			else {
				that.checked();
				if (that.options.check && typeof that.options.check === 'function') {
					that.options.check.call(that, that.$element);
				}
			}
		},
		checked: function() {
			var that = this;
			
			that.fullcheck();
			that.$element.prop('checked', true);
		},
		unchecked: function() {
			var that = this;
			
			that.$box.removeClass('checked halfcheck');
			that.$element.prop('checked', false);
		},
		disable: function() {
			var that = this;
			
			that.$box.addClass('disabled');
			that._unBindEvents();
		},
		enable: function() {
			var that = this;
			
			that.$box.removeClass('disabled');
			that._bindEvents();
		},
		halfcheck: function() {
			var that = this;
			
			that.$box.addClass('halfcheck').removeClass('checked');
		},
		fullcheck: function() {
			var that = this;
			
			that.$box.addClass('checked').removeClass('halfcheck');
		},
		destroy: function() {
			var that = this;
			
			that._unBindEvents();
			that.$box.remove();
		}
	};

	$.fn.icheckbox = function (option, args) {
		return this.each(function () {
			var $this = $(this);
			var data = $this.data('icheckbox');
			var options = typeof option === 'object' && option;
			if (!data) {
				$this.data('icheckbox', (data = new ICheckbox(this, options)));
			}
			if (typeof option === 'string') {
				data[option](args);
			}
		});
	};

	$.fn.icheckbox.Constructor = ICheckbox;
	$.fn.icheckbox.defaults = {
			checked: false,
			disabled: false
	};
}(window.jQuery);

/*
 * RadioButton
 * */
;!function ($) {
	'use strict';

	var RadioButton = function (element, options) {
		this.init('radiobutton', element, options);
	};

	RadioButton.prototype = {
		constructor: RadioButton,
		
		init: function (type, element, options) {
			var that = this;
			that.type = type;
			that.$element = $(element);
			that.domId = that.$element.attr('id');
			that.domName = that.$element.attr('name');
			that.options = this.getOptions(options);
			
			var boxHtml = '<div class="iradio '+that.domName+'"></div>';
			var helper = '<i class="iradio-helper"></i>';
			that.$element.wrap(boxHtml);
			that.$box = that.$element.parent();
			that.$box.append(helper);
			that.$box.append($('label[for="'+that.domId+'"]'));
			that.$label = that.$box.find('label');
			that.$input = that.$box.find('input');
			that.$helper = that.$box.find('.iradio-helper');
			
			if (that.$element.attr('checked') || that.options.checked) {
				that.checked();
			}
			if (that.$element.attr('disabled') || that.options.disabled) {
				that.disable();
				that._unBindEvents();
			}
			else {
				that._bindEvents();
			}
		},
		_bindEvents: function() {
			var that = this;
			
			that.$box.on('click', function(e) {
				e.stopPropagation();
				that.toggle();
			});
		},
		_unBindEvents: function() {
			var that = this;
			
			that.$box.off('click');
		},
		getOptions: function (options) {
			options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options);

			return options;
		},
		toggle: function() {
			var that = this;
			
			$('.iradio.'+that.domName).removeClass('checked');
			$('.iradio.'+that.domName).find('input[type="radio"]').attr('checked', false);
			
			that.$box.addClass('checked');
			that.$element.attr('checked', true);
		},
		checked: function() {
			var that = this;
			
			that.toggle();
		},
		unchecked: function() {
			var that = this;
			
			that.$box.removeClass('checked');
			that.$element.attr('checked', false);
			
		},
		disable: function() {
			var that = this;
			
			that.$box.addClass('disabled');
			that._unBindEvents();
		},
		enable: function() {
			var that = this;
			
			that.$box.removeClass('disabled');
			that._bindEvents();
		}
	};

	$.fn.radiobutton = function (option, args) {
		return this.each(function () {
			var $this = $(this);
			var data = $this.data('radiobutton');
			var options = typeof option === 'object' && option;
			if (!data) {
				$this.data('radiobutton', (data = new RadioButton(this, options)));
			}
			if (typeof option === 'string') {
				data[option](args);
			}
		});
	};

	$.fn.radiobutton.Constructor = RadioButton;
	$.fn.radiobutton.defaults = {
			checked: false,
			disabled: false
	};
}(window.jQuery);

/*
 * Modal
 * */
!function ($) {
  'use strict'; // jshint ;_;

  var Modal = function (element, options) {
    this.options = options;
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this));
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote);
  };

  Modal.prototype = {
      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']();
      }

    , show: function () {
        var that = this
          , e = $.Event('show');

        this.$element.trigger(e);
        if (this.isShown || e.isDefaultPrevented()) return
        this.isShown = true;
        this.escape();
        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade');
          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body); //don't move modals dom position
          }

          that.$element.show();
          if (transition) {
            that.$element[0].offsetWidth; // force reflow
          }

          that.$element
            .addClass('in')
            .attr('aria-hidden', false);

          that.enforceFocus();
          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown'); }) :
            that.$element.focus().trigger('shown');

        });
      }

    , hide: function (e) {
        e && e.preventDefault();
        var that = this;
        e = $.Event('hide');
        this.$element.trigger(e);
        if (!this.isShown || e.isDefaultPrevented()) return
        this.isShown = false;
        this.escape();
        $(document).off('focusin.modal');

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true);

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal();
      }

    , enforceFocus: function () {
        var that = this;
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus();
          }
        });
      }

    , escape: function () {
        var that = this;
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide();
          });
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal');
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end);
              that.hideModal();
            }, 500);

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout);
          that.hideModal();
        });
      }

    , hideModal: function () {
        var that = this;
        this.$element.hide();
        this.backdrop(function () {
          that.removeBackdrop();
          that.$element.trigger('hidden');
        });
      }

    , removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove();
        this.$backdrop = null;
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : '';

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate;

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body);

          this.$backdrop.click(
            this.options.backdrop == 'static' ?
              $.proxy(this.$element[0].focus, this.$element[0])
            : $.proxy(this.hide, this)
          );

          if (doAnimate) this.$backdrop[0].offsetWidth; // force reflow

          this.$backdrop.addClass('in');

          if (!callback) return

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback();

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in');

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, callback) :
            callback();

        } else if (callback) {
          callback();
        }
      }
  };

  var old = $.fn.modal;

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option);
      if (!data) $this.data('modal', (data = new Modal(this, options)));
      if (typeof option == 'string') data[option]();
      else if (options.show) data.show();
    });
  };

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  };

  $.fn.modal.Constructor = Modal;

  $.fn.modal.noConflict = function () {
    $.fn.modal = old;
    return this;
  };

  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
      , href = $this.attr('href')
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data());

    e.preventDefault();

    $target
      .modal(option)
      .one('hide', function () {
        $this.focus();
      });
  });
}(window.jQuery);
!function ($) {
	'use strict'; // jshint ;_;

	var ModalManager = function (element, options) {
		this.init(element, options);
	};

	ModalManager.prototype = {
		constructor: ModalManager,
		init: function (element, options) {
			this.$element = $(element);
			this.options = $.extend({}, $.fn.modalmanager.defaults, this.$element.data(), typeof options == 'object' && options);
			this.stack = [];
			this.backdropCount = 0;

			if (this.options.resize) {
				var resizeTimeout,
					that = this;

				$(window).on('resize.modal', function(){
					resizeTimeout && clearTimeout(resizeTimeout);
					resizeTimeout = setTimeout(function(){
						for (var i = 0; i < that.stack.length; i++){
							that.stack[i].isShown && that.stack[i].layout();
						}
					}, 10);
				});
			}
		},

		createModal: function (element, options) {
			$(element).modal($.extend({ manager: this }, options));
		},

		appendModal: function (modal) {
			this.stack.push(modal);
			var that = this;
			modal.$element.on('show.modalmanager', targetIsSelf(function (e) {
				var showModal = function(){
					modal.isShown = true;
					var transition = $.support.transition && modal.$element.hasClass('fade');

					that.$element
						.toggleClass('modal-open', that.hasOpenModal())
						.toggleClass('page-overflow', $(window).height() < that.$element.height());

					modal.$parent = modal.$element.parent();
					modal.$container = that.createContainer(modal);
					modal.$element.appendTo(modal.$container);
					that.backdrop(modal, function () {
						modal.$element.show();

						if (transition) {       
							//modal.$element[0].style.display = 'run-in';       
							modal.$element[0].offsetWidth;
							//modal.$element.one($.support.transition.end, function () { modal.$element[0].style.display = 'block' });  
						}
						
						modal.layout();
						modal.$element
							.addClass('in')
							.attr('aria-hidden', false);

						var complete = function () {
							that.setFocus();
							modal.$element.trigger('shown');
						};

						transition ?
							modal.$element.one($.support.transition.end, complete) :
							complete();
					});
				};
				modal.options.replace ?
					that.replace(showModal) :
					showModal();
			}));

			modal.$element.on('hidden.modalmanager', targetIsSelf(function (e) {
				that.backdrop(modal);
				if (modal.$backdrop){
					$.support.transition && modal.$element.hasClass('fade') ?
						modal.$backdrop.one($.support.transition.end, function () { that.destroyModal(modal); }) :
						that.destroyModal(modal);
				} else {
					that.destroyModal(modal);
				}

			}));

			modal.$element.on('destroy.modalmanager', targetIsSelf(function (e) {
				that.removeModal(modal);
			}));

		},
		destroyModal: function (modal) {
			modal.destroy();
			var hasOpenModal = this.hasOpenModal();
			this.$element.toggleClass('modal-open', hasOpenModal);
			if (!hasOpenModal){
				this.$element.removeClass('page-overflow');
			}

			this.removeContainer(modal);
			this.setFocus();
		},

		hasOpenModal: function () {
			for (var i = 0; i < this.stack.length; i++){
				if (this.stack[i].isShown) return true;
			}

			return false;
		},

		setFocus: function () {
			var topModal;
			for (var i = 0; i < this.stack.length; i++){
				if (this.stack[i].isShown) topModal = this.stack[i];
			}
			if (!topModal) return;
			topModal.focus();
		},
		
		removeModal: function (modal) {
			modal.$element.off('.modalmanager');
			if (modal.$backdrop) this.removeBackdrop.call(modal);
			this.stack.splice(this.getIndexOfModal(modal), 1);
		},
		
		getModalAt: function (index) {
			return this.stack[index];
		},
		
		getIndexOfModal: function (modal) {
			for (var i = 0; i < this.stack.length; i++){
				if (modal === this.stack[i]) return i;
			}
		},

		replace: function (callback) {
			var topModal;
			for (var i = 0; i < this.stack.length; i++){
				if (this.stack[i].isShown) topModal = this.stack[i];
			}

			if (topModal) {
				this.$backdropHandle = topModal.$backdrop;
				topModal.$backdrop = null;

				callback && topModal.$element.one('hidden',
					targetIsSelf( $.proxy(callback, this) ));

				topModal.hide();
			} else if (callback) {
				callback();
			}
		},

		removeBackdrop: function (modal) {
			modal.$backdrop.remove();
			modal.$backdrop = null;
		},

		createBackdrop: function (animate) {
			var $backdrop;

			if (!this.$backdropHandle) {
				$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
					.appendTo(this.$element);
			} else {
				$backdrop = this.$backdropHandle;
				$backdrop.off('.modalmanager');
				this.$backdropHandle = null;
				this.isLoading && this.removeSpinner();
			}

			return $backdrop;
		},

		removeContainer: function (modal) {
			modal.$container.remove();
			modal.$container = null;
		},

		createContainer: function (modal) {
			var $container;

			$container = $('<div class="modal-scrollable">')
				.css('z-index', getzIndex( 'modal',
					modal ? this.getIndexOfModal(modal) : this.stack.length ))
				.appendTo(this.$element);

			if (modal && modal.options.backdrop != 'static') {
				$container.on('click.modal', targetIsSelf(function (e) {
					if (modal.options.autoClose) {
						modal.hide();
					}
				}));
			} else if (modal) {
				$container.on('click.modal', targetIsSelf(function (e) {
					modal.attention();
				}));
			}

			return $container;

		},

		backdrop: function (modal, callback) {
			var animate = modal.$element.hasClass('fade') ? 'fade' : '',
				showBackdrop = modal.options.backdrop &&
					this.backdropCount < this.options.backdropLimit;

			if (modal.isShown && showBackdrop) {
				var doAnimate = $.support.transition && animate && !this.$backdropHandle;
				modal.$backdrop = this.createBackdrop(animate);
				modal.$backdrop.css('z-index', getzIndex( 'backdrop', this.getIndexOfModal(modal) ));
				if (doAnimate) modal.$backdrop[0].offsetWidth; // force reflow
				modal.$backdrop.addClass('in');
				this.backdropCount += 1;
				doAnimate ?
					modal.$backdrop.one($.support.transition.end, callback) :
					callback();

			} else if (!modal.isShown && modal.$backdrop) {
				modal.$backdrop.removeClass('in');
				this.backdropCount -= 1;
				var that = this;
				$.support.transition && modal.$element.hasClass('fade')?
					modal.$backdrop.one($.support.transition.end, function () { that.removeBackdrop(modal); }) :
					that.removeBackdrop(modal);

			} else if (callback) {
				callback();
			}
		},

		removeSpinner: function(){
			this.$spinner && this.$spinner.remove();
			this.$spinner = null;
			this.isLoading = false;
		},

		removeLoading: function () {
			this.$backdropHandle && this.$backdropHandle.remove();
			this.$backdropHandle = null;
			this.removeSpinner();
		},

		loading: function (callback) {
			callback = callback || function () { };

			this.$element
				.toggleClass('modal-open', !this.isLoading || this.hasOpenModal())
				.toggleClass('page-overflow', $(window).height() < this.$element.height());

			if (!this.isLoading) {
				this.$backdropHandle = this.createBackdrop('fade');
				this.$backdropHandle[0].offsetWidth; // force reflow
				this.$backdropHandle
					.css('z-index', getzIndex('backdrop', this.stack.length))
					.addClass('in');

				var $spinner = $(this.options.spinner)
					.css('z-index', getzIndex('modal', this.stack.length))
					.appendTo(this.$element)
					.addClass('in');

				this.$spinner = $(this.createContainer())
					.append($spinner)
					.on('click.modalmanager', $.proxy(this.loading, this));

				this.isLoading = true;
				$.support.transition ?
					this.$backdropHandle.one($.support.transition.end, callback) :
					callback();

			} else if (this.isLoading && this.$backdropHandle) {
				this.$backdropHandle.removeClass('in');

				var that = this;
				$.support.transition ?
					this.$backdropHandle.one($.support.transition.end, function () { that.removeLoading(); }) :
					that.removeLoading();

			} else if (callback) {
				callback(this.isLoading);
			}
		}
	};

	var getzIndex = (function () {
		var zIndexFactor,
			baseIndex = {};

		return function (type, pos) {

			if (typeof zIndexFactor === 'undefined'){
				var $baseModal = $('<div class="modal hide" />').appendTo('body'),
					$baseBackdrop = $('<div class="modal-backdrop hide" />').appendTo('body');

				baseIndex['modal'] = +$baseModal.css('z-index');
				baseIndex['backdrop'] = +$baseBackdrop.css('z-index');
				zIndexFactor = baseIndex['modal'] - baseIndex['backdrop'];

				$baseModal.remove();
				$baseBackdrop.remove();
				$baseBackdrop = $baseModal = null;
			}

			return baseIndex[type] + (zIndexFactor * pos);

		};
	}());

	function targetIsSelf(callback){
		return function (e) {
			if (this === e.target){
				return callback.apply(this, arguments);
			}
		};
	}

	$.fn.modalmanager = function (option, args) {
		return this.each(function () {
			var $this = $(this),
				data = $this.data('modalmanager');

			if (!data) $this.data('modalmanager', (data = new ModalManager(this, option)));
			if (typeof option === 'string') data[option].apply(data, [].concat(args));
		});
	};

	$.fn.modalmanager.defaults = {
		backdropLimit: 999,
		resize: true,
		spinner: '<div class="loading-spinner fade" style="width: 200px; margin-left: -100px;"><div class="progress progress-striped active"><div class="bar" style="width: 100%;"></div></div></div>'
	};

	$.fn.modalmanager.Constructor = ModalManager;

}(jQuery);
!function ($) {
	'use strict'; // jshint ;_;

	var Modal = function (element, options) {
		this.init(element, options);
	};

	Modal.prototype = {
		constructor: Modal,
		init: function (element, options) {
			this.options = options;

			this.$element = $(element)
				.delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this));
			this.options.remote && this.$element.find('.modal-body').load(this.options.remote);
			var manager = typeof this.options.manager === 'function' ?
				this.options.manager.call(this) : this.options.manager;
			manager = manager.appendModal ?
				manager : $(manager).modalmanager().data('modalmanager');
			manager.appendModal(this);
		},

		toggle: function () {
			return this[!this.isShown ? 'show' : 'hide']();
		},

		show: function () {
			var e = $.Event('show');
			if (this.isShown) return;
			this.$element.trigger(e);
			if (e.isDefaultPrevented()) return;
			this.escape();
			this.tab();
			this.options.loading && this.loading();
		},

		hide: function (e) {
			e && e.preventDefault();
			e = $.Event('hide');
			this.$element.trigger(e);
			if (!this.isShown || e.isDefaultPrevented()) return (this.isShown = false);
			this.isShown = false;
			this.escape();
			this.tab();
			this.isLoading && this.loading();
			$(document).off('focusin.modal');

			this.$element
				.removeClass('in')
				.removeClass('animated')
				.removeClass(this.options.attentionAnimation)
				.removeClass('modal-overflow')
				.attr('aria-hidden', true);

			$.support.transition && this.$element.hasClass('fade') ?
				this.hideWithTransition() :
				this.hideModal();
				
			if (this.options.close) {
				this.options.close.call();
			}
		},

		layout: function () {
			var prop = this.options.height ? 'height' : 'max-height',
				value = this.options.height || this.options.maxHeight;
			if (this.options.width){
				this.$element.css('width', this.options.width);

				var that = this;
				this.$element.css('margin-left', function () {
					if (/%/ig.test(that.options.width)){
						return -(parseInt(that.options.width) / 2) + '%';
					} else {
						return -($(this).width() / 2) + 'px';
					}
				});
			} else {
				this.$element.css('width', '');
				this.$element.css('margin-left', '');
			}

			this.$element.find('.modal-body')
				.css('overflow', '')
				.css(prop, '');

			var modalOverflow = $(window).height() - 10 < this.$element.height();

			if (value){
				this.$element.find('.modal-body')
					.css('overflow', 'auto')
					.css(prop, value);
			}

			if (modalOverflow || this.options.modalOverflow) {
				this.$element
					.css('margin-top', 0)
					.addClass('modal-overflow');
			} else {
				this.$element
					.css('margin-top', 0 - this.$element.height() / 2)
					.css('margin-left', 0 - this.$element.width() / 2)
					.removeClass('modal-overflow');
			}
		},

		tab: function () {
			var that = this;

			if (this.isShown && this.options.consumeTab) {
				this.$element.on('keydown.tabindex.modal', '[data-tabindex]', function (e) {
			    	if (e.keyCode && e.keyCode == 9){
						var $next = $(this),
							$rollover = $(this);

						that.$element.find('[data-tabindex]:enabled:not([readonly])').each(function (e) {
							if (!e.shiftKey){
						 		$next = $next.data('tabindex') < $(this).data('tabindex') ?
									$next = $(this) :
									$rollover = $(this);
							} else {
								$next = $next.data('tabindex') > $(this).data('tabindex') ?
									$next = $(this) :
									$rollover = $(this);
							}
						});

						$next[0] !== $(this)[0] ?
							$next.focus() : $rollover.focus();

						e.preventDefault();
					}
				});
			} else if (!this.isShown) {
				this.$element.off('keydown.tabindex.modal');
			}
		},

		escape: function () {
			var that = this;
			if (this.isShown && this.options.keyboard) {
				if (!this.$element.attr('tabindex')) this.$element.attr('tabindex', -1);

				this.$element.on('keyup.dismiss.modal', function (e) {
					e.which == 27 && that.hide();
				});
			} else if (!this.isShown) {
				this.$element.off('keyup.dismiss.modal');
			}
		},

		hideWithTransition: function () {
			var that = this
				, timeout = setTimeout(function () {
					that.$element.off($.support.transition.end);
					that.hideModal();
				}, 500);

			this.$element.one($.support.transition.end, function () {
				clearTimeout(timeout);
				that.hideModal();
			});
		},

		hideModal: function () {
			this.$element
				.hide()
				.trigger('hidden');

			var prop = this.options.height ? 'height' : 'max-height';
			var value = this.options.height || this.options.maxHeight;

			if (value){
				this.$element.find('.modal-body')
					.css('overflow', '')
					.css(prop, '');
			}
		},

		removeLoading: function () {
			this.$loading.remove();
			this.$loading = null;
			this.isLoading = false;
		},

		loading: function (callback) {
			callback = callback || function () {};
			var animate = this.$element.hasClass('fade') ? 'fade' : '';
			if (!this.isLoading) {
				var doAnimate = $.support.transition && animate;

				this.$loading = $('<div class="loading-mask ' + animate + '">')
					.append(this.options.spinner)
					.appendTo(this.$element);

				if (doAnimate) this.$loading[0].offsetWidth; // force reflow
				this.$loading.addClass('in');
				this.isLoading = true;
				doAnimate ?
					this.$loading.one($.support.transition.end, callback) :
					callback();

			} else if (this.isLoading && this.$loading) {
				this.$loading.removeClass('in');

				var that = this;
				$.support.transition && this.$element.hasClass('fade')?
					this.$loading.one($.support.transition.end, function () { that.removeLoading(); }) :
					that.removeLoading();

			} else if (callback) {
				callback(this.isLoading);
			}
		},

		focus: function () {
			var $focusElem = this.$element.find(this.options.focusOn);
			$focusElem = $focusElem.length ? $focusElem : this.$element;
			$focusElem.focus();
		},

		attention: function (){
			if (this.options.attentionAnimation){
				this.$element
					.removeClass('animated')
					.removeClass(this.options.attentionAnimation);

				var that = this;

				setTimeout(function () {
					that.$element
						.addClass('animated')
						.addClass(that.options.attentionAnimation);
				}, 0);
			}
			this.focus();
		},

		destroy: function () {
			var e = $.Event('destroy');
			this.$element.trigger(e);
			if (e.isDefaultPrevented()) return;

			this.teardown();
		},

		teardown: function () {
			if (!this.$parent.length){
				this.$element.remove();
				this.$element = null;
				return;
			}

			if (this.$parent !== this.$element.parent()){
				this.$element.appendTo(this.$parent);
			}

			this.$element.off('.modal');
			this.$element.removeData('modal');
			this.$element
				.removeClass('in')
				.attr('aria-hidden', true);
		}
	};

	$.fn.modal = function (option, args) {
		return this.each(function () {
			var $this = $(this),
				data = $this.data('modal'),
				options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option);

			if (!data) $this.data('modal', (data = new Modal(this, options)));
			if (typeof option == 'string') data[option].apply(data, [].concat(args));
			else if (options.show) data.show();
		});
	};

	$.fn.modal.defaults = {
		close: null,
		autoClose: true,
		keyboard: true,
		backdrop: true,
		loading: false,
		show: true,
		width: null,
		height: null,
		maxHeight: null,
		modalOverflow: false,
		consumeTab: true,
		focusOn: null,
		replace: false,
		resize: false,
		attentionAnimation: 'shake',
		manager: 'body',
		spinner: '<div class="loading-spinner" style="width: 200px; margin-left: -100px;"><div class="progress progress-striped active"><div class="bar" style="width: 100%;"></div></div></div>'
	};

	$.fn.modal.Constructor = Modal;

	$(function () {
		$(document).off('click.modal').on('click.modal.data-api', '[data-toggle="modal"]', function ( e ) {
			var $this = $(this),
				href = $this.attr('href'),
				$target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))), //strip for ie7
				option = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data());

			e.preventDefault();
			$target
				.modal(option)
				.one('hide', function () {
					$this.focus();
				});
		});
	});

}(window.jQuery);

var createModal = function(title, data, height, level, confirm, closeBtn, btns, noFooter) {
	var html = '<div class="modal hide fade" id="dynamic-modal-'+level+'" style="height: '+height+'px; z-index: '+(1050+level)+';">'
				+ '<div class="modal-header">'
				+   '<div class="opacity-bg"></div>'
				+	'<div class="content"><a class="close" data-dismiss="modal" aria-hidden="true">X</a>'
				+	'<h3 class="title">'+title+'</h3></div>'
				+ '</div>'
				+ '<div class="modal-content">'+data+'</div>';
	
	if (!noFooter) {
		html += '<div class="modal-footer">';
		
		if (closeBtn) {
			html += '<button class="btn" data-dismiss="modal">关闭</button>';
		}
		
		if (typeof btns !== 'undefined' && btns.length > 0) {
			$.each(btns, function(i, v) {
				html += '<button class="btn" onclick="'+v.action+'()">'+v.name+'</button>';
			});
		}
		
		if (typeof confirm === 'string' && typeof window[confirm] === 'function') {
			html += '<button class="btn save" onclick="'+confirm+'()">确定</button>';
		}
		else if (typeof confirm === 'function') {
			html += '<button class="btn save modal-confirm">确定</button>';
		}
		
		html += '</div>';
	}
	
	html += '</div>';
	
	if ($('body .modals').length === 0) {
		$('body').append('<div class="modals"></div>');
	}
	$('.modals').append(html);
};
;(function($, undefined) {
	'use strict';
	var pluginName = 'openModal';
	
	$[pluginName] = function(opts) {
		/*
		 * opts是一个参数对象:
		 * opts.height: 弹出框高度，默认高度178px
		 * opts.width: 弹出框宽度，默认宽度520px
		 * opts.url: ajax获取弹出框内容的请求地址
		 * opts.content: 弹出框同步内容
		 * opts.method: 请求的方式，默认GET
		 * opts.data: 请求所需要的数据，类型为对象，可以为空
		 * opts.level: 弹出框的层级
		 * opts.title：弹出框的标题
		 * opts.confirm: 点击确定的回调方法
		 * opts.close: 点击关闭的回调方法
		 * opts.closeBtn: 是否显示关闭按钮
		 * opts.callback: 弹出框后的回调方法
		 * opts.btns: 其它额外的按钮
		 * opts.autoClose: 点击背景是否自动关闭弹出框
		 * opts.noFooter：是否需要底部按钮条
		 * */
		
		var _default = {
			height: 178,
			width: 520,
			closeBtn: true,
			level: 1,
			title: '弹出框',
			autoClose: true,
			noFooter: false
		};
		opts = $.extend({}, _default, opts);
		
		if (opts.url) {
			$.ajax({
				url: opts.url,
				type: opts.method ? 'GET' : opts.method,
				data: opts.data,
				error: function() {
					alert('获取弹出框内容出错!');
				},
				success: function(data) {
					modalFactory(opts, data);
				}
			});
		}
		else if (opts.content) {
			if (typeof opts.content === 'function') {
				opts.content = opts.content.call();
			}
			modalFactory(opts, opts.content);
		}
	};
})(jQuery);
var modalFactory = function(opts, data) {
	var level = opts.level;
	var title = opts.title;
	var height = opts.height;
	var width = opts.width;
	var options = {width: width, close: opts.close, autoClose: opts.autoClose};
	
	if ($('#dynamic-modal-' + level).length > 0) {
		$('#dynamic-modal-' + level).remove();
	}
	createModal(title, data, height, level, opts.confirm, opts.closeBtn, opts.btns, opts.noFooter);
	if (level !== 1) {
		options.backdrop = false;
	}
	$('#dynamic-modal-' + level).modal(options);
	$('#dynamic-modal-' + level).modal('show');
	
	if (opts.callback && typeof opts.callback === 'function'){
		opts.callback.call($('#dynamic-modal-' + level).modal());
	}
	if (typeof opts.confirm === 'function') {
		$('#dynamic-modal-'+level+' .modal-confirm').on('click', function() {
			if (opts.confirm.call($('#dynamic-modal-' + level).modal())) {
				$.closeModal(level);
			}
		});
	}
};
;(function($, undefined) {
	'use strict';
	var pluginName = 'closeModal';
	
	$[pluginName] = function(level) {
		$('#dynamic-modal-' + level).modal('hide');
		$('#dynamic-modal-'+level+' .modal-confirm').off('click');
	};
})(jQuery);

/*
 * Tips
 */
!function ($) {
  'use strict'; // jshint ;_;

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options);
  };

  Tooltip.prototype = {
    constructor: Tooltip
  , init: function (type, element, options) {
      var eventIn
        , eventOut
        , triggers
        , trigger
        , i;

      this.type = type;
      this.$element = $(element);
      this.options = this.getOptions(options);
      this.enabled = true;

      triggers = this.options.trigger.split(' ');

      for (i = triggers.length; i--;) {
        trigger = triggers[i];
        if (trigger == 'click') {
          this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this));
        } else if (trigger != 'manual') {
          eventIn = trigger == 'hover' ? 'mouseenter' : 'focus';
          eventOut = trigger == 'hover' ? 'mouseleave' : 'blur';
          this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this));
          this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this));
        }
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle();
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options);

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        };
      }

      return options;
    }

  , enter: function (e) {
      var defaults = $.fn[this.type].defaults
        , options = {}
        , self;

      this._options && $.each(this._options, function (key, value) {
        if (defaults[key] != value) options[key] = value;
      }, this);

      self = $(e.currentTarget)[this.type](options).data(this.type);

      if (!self.options.delay || !self.options.delay.show) return self.show();

      clearTimeout(this.timeout);
      self.hoverState = 'in';
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show();
      }, self.options.delay.show);
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type);

      if (this.timeout) clearTimeout(this.timeout);
      if (!self.options.delay || !self.options.delay.hide) return self.hide();

      self.hoverState = 'out';
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide();
      }, self.options.delay.hide);
    }

  , show: function () {
      var $tip
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp
        , e = $.Event('show');

      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e);
        if (e.isDefaultPrevented()) return
        $tip = this.tip();
        this.setContent();

        if (this.options.animation) {
          $tip.addClass('fade');
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement;

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' });

        this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element);

        pos = this.getPosition();

        actualWidth = $tip[0].offsetWidth;
        actualHeight = $tip[0].offsetHeight;

        switch (placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2};
            break;
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2};
            break;
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth};
            break;
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width};
            break;
        }

        this.applyPlacement(tp, placement);
        this.$element.trigger('shown');
      }
    }

  , applyPlacement: function(offset, placement){
      var $tip = this.tip()
        , width = $tip[0].offsetWidth
        , height = $tip[0].offsetHeight
        , actualWidth
        , actualHeight
        , delta
        , replace;

      $tip
        .offset(offset)
        .addClass(placement)
        .addClass('in');

      actualWidth = $tip[0].offsetWidth;
      actualHeight = $tip[0].offsetHeight;

      if (placement == 'top' && actualHeight != height) {
        offset.top = offset.top + height - actualHeight;
        replace = true;
      }

      if (placement == 'bottom' || placement == 'top') {
        delta = 0;

        if (offset.left < 0){
          delta = offset.left * -2;
          offset.left = 0;
          $tip.offset(offset);
          actualWidth = $tip[0].offsetWidth;
          actualHeight = $tip[0].offsetHeight;
        }

        this.replaceArrow(delta - width + actualWidth, actualWidth, 'left');
      } else {
        this.replaceArrow(actualHeight - height, actualHeight, 'top');
      }

      if (replace) $tip.offset(offset);
    }

  , replaceArrow: function(delta, dimension, position){
      this
        .arrow()
        .css(position, delta ? (50 * (1 - delta / dimension) + "%") : '');
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle();

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title);
      $tip.removeClass('fade in top bottom left right');
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()
        , e = $.Event('hide');

      this.$element.trigger(e);
      if (e.isDefaultPrevented()) return

      $tip.removeClass('in');

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach();
        }, 500);

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout);
          $tip.detach();
        });
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.detach();

      this.$element.trigger('hidden');

      return this;
    }

  , fixTitle: function () {
      var $e = this.$element;
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').attr('title', '');
      }
    }

  , hasContent: function () {
      return this.getTitle();
    }

  , getPosition: function () {
      var el = this.$element[0];
      return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
        width: el.offsetWidth
      , height: el.offsetHeight
      }, this.$element.offset());
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options;

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title);

      return title;
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template);
    }

  , arrow: function(){
      return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow");
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide();
        this.$element = null;
        this.options = null;
      }
    }

  , enable: function () {
      this.enabled = true;
    }

  , disable: function () {
      this.enabled = false;
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled;
    }

  , toggle: function (e) {
	  e.preventDefault();
      e.stopPropagation();
      
      var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this;
      self.tip().hasClass('in') ? self.hide() : self.show();
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type);
    }
  };

  var old = $.fn.tooltip;

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option;
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)));
      if (typeof option == 'string') data[option]();
    });
  };

  $.fn.tooltip.Constructor = Tooltip;

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: true
  , container: false
  };

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old;
    return this;
  };

}(window.jQuery);

/*
 * Popover
 */
!function ($) {
  'use strict'; // jshint ;_;

  var Popover = function (element, options) {
    this.init('popover', element, options);
  };

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {
    constructor: Popover
  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent();

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title);
      $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content);

      $tip.removeClass('fade top bottom left right in');
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent();
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options;

      content = (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)
        || $e.attr('data-content');

      return content;
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template);
      }
      return this.$tip;
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type);
    }
  });

  var old = $.fn.popover;

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option;
      if (!data) $this.data('popover', (data = new Popover(this, options)));
      if (typeof option == 'string') data[option]();
    });
  };

  $.fn.popover.Constructor = Popover;

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'top'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  });

  $.fn.popover.noConflict = function () {
    $.fn.popover = old;
    return this;
  };

}(window.jQuery);

/*
 * Datetime Picker
 * */
!function( $ ) {
	function UTCDate(){
		return new Date(Date.UTC.apply(Date, arguments));
	}
	function UTCToday(){
		var today = new Date();
		return UTCDate(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), today.getUTCHours(), today.getUTCMinutes(), today.getUTCSeconds(), 0);
	}

	var Datetimepicker = function(element, options) {
		var that = this;
		var width = options.width ? options.width : 132;
		
		this.element = $(element);
		if (options.time) {
			this.minView = 0;
			options.format = 'yyyy/mm/dd hh:ii';
		}
		else {
			this.minView = 2;
			options.format = 'yyyy/mm/dd';
		}

    if (options.buttonBar) {
      this.buttonBar = true;
      this.buttonAction = options.buttonAction;
    }
    else {
      this.buttonBar = false;
      this.buttonAction = false;
    }

		this.element.css('width', width + 'px');
		this.language = options.language || this.element.data('date-language') || "cn";
		this.language = this.language in dates ? this.language : "cn";
		this.isRTL = dates[this.language].rtl || false;
		this.formatType = options.formatType || this.element.data('format-type') || 'standard';
		this.format = DPGlobal.parseFormat(options.format || this.element.data('date-format') || DPGlobal.getDefaultFormat(this.formatType, 'input'), this.formatType);
		this.isInline = false;
		this.isVisible = false;
		this.isInput = this.element.is('input');
		this.component = this.element.is('.date') ? this.element.find('.add-on .icon-th, .add-on .icon-time, .add-on .icon-calendar').parent() : false;
		this.componentReset = this.element.is('.date') ? this.element.find('.add-on .icon-remove').parent() : false;
		this.hasInput = this.component && this.element.find('input').length;
		if (this.component && this.component.length === 0) {
			this.component = false;
		}
		this.linkField = options.linkField || this.element.data('link-field') || false;
		this.linkFormat = DPGlobal.parseFormat(options.linkFormat || this.element.data('link-format') || DPGlobal.getDefaultFormat(this.formatType, 'link'), this.formatType);
		this.minuteStep = options.minuteStep || this.element.data('minute-step') || 5;
		
		var elementOffset = this.element.offset();
		if ((elementOffset.top + 288) > $(document).height()) {
			options.pickerPosition = 'top-left';
		}
		else {
			options.pickerPosition = 'bottom-left';
		}
		this.pickerPosition = options.pickerPosition || this.element.data('picker-position') || 'bottom-left';
        this.showMeridian = options.showMeridian || this.element.data('show-meridian') || false;
        this.initialDate = options.initialDate || new Date();

		this._attachEvents();
		
	    this.formatViewType = "datetime";
	    if ('formatViewType' in options) {
	        this.formatViewType = options.formatViewType;
	    } else if ('formatViewType' in this.element.data()) {
	        this.formatViewType = this.element.data('formatViewType');
	    }

		if ('minView' in options) {
			this.minView = options.minView;
		} else if ('minView' in this.element.data()) {
			this.minView = this.element.data('min-view');
		}
		this.minView = DPGlobal.convertViewMode(this.minView);

		this.maxView = DPGlobal.modes.length-1;
		if ('maxView' in options) {
			this.maxView = options.maxView;
		} else if ('maxView' in this.element.data()) {
			this.maxView = this.element.data('max-view');
		}
		this.maxView = DPGlobal.convertViewMode(this.maxView);

		this.startViewMode = 2;
		if ('startView' in options) {
			this.startViewMode = options.startView;
		} else if ('startView' in this.element.data()) {
			this.startViewMode = this.element.data('start-view');
		}
		this.startViewMode = DPGlobal.convertViewMode(this.startViewMode);
		this.viewMode = this.startViewMode;

        this.viewSelect = this.minView;
        if ('viewSelect' in options) {
            this.viewSelect = options.viewSelect;
        } else if ('viewSelect' in this.element.data()) {
            this.viewSelect = this.element.data('view-select');
        }
        this.viewSelect = DPGlobal.convertViewMode(this.viewSelect);

		this.forceParse = true;
		if ('forceParse' in options) {
			this.forceParse = options.forceParse;
		} else if ('dateForceParse' in this.element.data()) {
			this.forceParse = this.element.data('date-force-parse');
		}

		this.picker = $(DPGlobal.template)
							.appendTo(this.isInline ? this.element : 'body')
							.on({
								click: $.proxy(this.click, this),
								mousedown: $.proxy(this.mousedown, this)
							});

		if (this.isInline) {
			this.picker.addClass('datetimepicker-inline');
			this.element.css('width', '198px');
		} else {
			this.picker.addClass('datetimepicker-dropdown-' + this.pickerPosition + ' dropdown-menu');
		}
		if (this.isRTL){
			this.picker.addClass('datetimepicker-rtl');
			this.picker.find('.prev i, .next i')
						.toggleClass('icon-arrow-left icon-arrow-right');
		}
		$(document).on('mousedown', function (e) {
			if ($(e.target).closest('.datetimepicker').length === 0) {
				if (!$(e.target).hasClass('inputfield')) {
					that.hide();
				}
			}
		});

		this.autoclose = true;
		if ('autoclose' in options) {
			this.autoclose = options.autoclose;
		} else if ('dateAutoclose' in this.element.data()) {
			this.autoclose = this.element.data('date-autoclose');
		}

		this.keyboardNavigation = true;
		if ('keyboardNavigation' in options) {
			this.keyboardNavigation = options.keyboardNavigation;
		} else if ('dateKeyboardNavigation' in this.element.data()) {
			this.keyboardNavigation = this.element.data('date-keyboard-navigation');
		}

    if (this.buttonBar && !this.isInline && moment) {
        this.picker.on('click', '.c-b', function(e) {
          e.stopPropagation();
          e.preventDefault();

          var me = $(this),
              type = me.data('type'),
              today = moment(),
              date;

          switch (type) {
            case 'today':
              date = today.clone();
              break;
            case 'tomorrow':
              date = today.clone().add('d', 1);
              break;
            case 'friday':
              date = today.clone().day('Friday');
              break;
            case 'nextMonday':
              date = today.clone().day('Satday').add('d', 2);
              break;
            case 'lastDayInMonth':
              date = today.clone().endOf('month');
              break;
            default:
              break;
          }
          that.hide();
          that.buttonAction.call(that, date.format('YYYY-MM-DD'));
        });
      }
		
		this.todayBtn = (options.todayBtn || this.element.data('date-today-btn') || false);
		this.todayHighlight = (options.todayHighlight || this.element.data('date-today-highlight') || true);

		this.weekStart = ((options.weekStart || this.element.data('date-weekstart') || dates[this.language].weekStart || 0) % 7);
		this.weekEnd = ((this.weekStart + 6) % 7);
		this.startDate = -Infinity;
		this.endDate = Infinity;
		this.daysOfWeekDisabled = [];
		this.setStartDate(options.startDate || this.element.data('date-startdate'));
		this.setEndDate(options.endDate || this.element.data('date-enddate'));
		this.setDaysOfWeekDisabled(options.daysOfWeekDisabled || this.element.data('date-days-of-week-disabled'));
		this.fillDow();
		this.fillMonths();
		this.update();
		this.showMode();

		if(this.isInline) {
			this.show();
		}
	};

	Datetimepicker.prototype = {
		constructor: Datetimepicker,

		_events: [],
		_attachEvents: function(){
			this._detachEvents();
			if (this.isInput) { // single input
				this._events = [
					[this.element, {
						focus: $.proxy(this.show, this),
//						click: $.proxy(this.show, this),
						keyup: $.proxy(this.update, this),
						keydown: $.proxy(this.keydown, this)
					}]
				];
			}
			else if (this.component && this.hasInput){ // component: input + button
				this._events = [
					// For components that are not readonly, allow keyboard nav
					[this.element.find('input'), {
						focus: $.proxy(this.show, this),
						keyup: $.proxy(this.update, this),
						keydown: $.proxy(this.keydown, this)
					}],
					[this.component, {
						click: $.proxy(this.show, this)
					}]
				];
				if (this.componentReset) {
					this._events.push([
						this.componentReset,
						{click: $.proxy(this.reset, this)}
					]);
				}
			}
			else if (this.element.is('div')) {  // inline datetimepicker
				this.isInline = true;
			}
			else {
				this._events = [
					[this.element, {
						click: $.proxy(this.show, this)
					}]
				];
			}
			for (var i=0, el, ev; i<this._events.length; i++){
				el = this._events[i][0];
				ev = this._events[i][1];
				el.on(ev);
			}
		},
		
		_detachEvents: function(){
			for (var i=0, el, ev; i<this._events.length; i++){
				el = this._events[i][0];
				ev = this._events[i][1];
				el.off(ev);
			}
			this._events = [];
		},
		
		show: function(e) {
			this._hideOther(e);
			this.picker.show();
			this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
			if (this.forceParse) {
				this.update();
			}
			this.place();
			$(window).on('resize', $.proxy(this.place, this));
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			this.isVisible = true;
			this.element.trigger({
				type: 'show',
				date: this.date
			});
		},
		
		_hideOther: function(e) {
			var that = this;
			
			var group = that.element.data('group'),
				others = $('.inputfield[data-group="'+group+'"]').not(this.element);

			others.datetimepicker('hide');
		},
		
		hide: function(e){
			if(!this.isVisible) return;
			if(this.isInline) return;
			this.picker.hide();
			$(window).off('resize', this.place);
			this.viewMode = this.startViewMode;
			this.showMode();
			if (!this.isInput) {
				$(document).off('mousedown', this.hide);
			}

			if (
				this.forceParse &&
				(
					this.isInput && this.element.val()  || 
					this.hasInput && this.element.find('input').val()
				)
			)
				this.setValue();
			this.isVisible = false;
			this.element.trigger({
				type: 'hide',
				date: this.date
			});
		},

		remove: function() {
			this._detachEvents();
			this.picker.remove();
			delete this.element.data().datetimepicker;
		},

		getDate: function() {
			var d = this.getUTCDate();
			return new Date(d.getTime() + (d.getTimezoneOffset()*60000));
		},

		getUTCDate: function() {
			return this.date;
		},

		setDate: function(d) {
			this.setUTCDate(new Date(d.getTime() - (d.getTimezoneOffset()*60000)));
		},

		setUTCDate: function(d) {
			if (d >= this.startDate && d <= this.endDate) {
				this.date = d;
				this.setValue();
				this.viewDate = this.date;
				this.fill();
			} else {
				this.element.trigger({
					type: 'outOfRange',
					date: d,
					startDate: this.startDate,
					endDate: this.endDate
				});
			}
		},

		setValue: function() {
			var formatted = this.getFormattedDate();
			if (!this.isInput) {
				if (this.component){
					this.element.find('input').prop('value', formatted);
				}
				this.element.data('date', formatted);
			} else {
				this.element.prop('value', formatted);
			}
			if (this.linkField) {
				$('#' + this.linkField).val(this.getFormattedDate(this.linkFormat));
			}
		},

		getFormattedDate: function(format) {
			if(format == undefined) format = this.format;
			return DPGlobal.formatDate(this.date, format, this.language, this.formatType);
		},

		setStartDate: function(startDate){
			this.startDate = startDate || -Infinity;
			if (this.startDate !== -Infinity) {
				this.startDate = DPGlobal.parseDate(this.startDate, this.format, this.language, this.formatType);
			}
			this.update();
			this.updateNavArrows();
		},

		setEndDate: function(endDate){
			this.endDate = endDate || Infinity;
			if (this.endDate !== Infinity) {
				this.endDate = DPGlobal.parseDate(this.endDate, this.format, this.language, this.formatType);
			}
			this.update();
			this.updateNavArrows();
		},

		setDaysOfWeekDisabled: function(daysOfWeekDisabled){
			this.daysOfWeekDisabled = daysOfWeekDisabled || [];
			if (!$.isArray(this.daysOfWeekDisabled)) {
				this.daysOfWeekDisabled = this.daysOfWeekDisabled.split(/,\s*/);
			}
			this.daysOfWeekDisabled = $.map(this.daysOfWeekDisabled, function (d) {
				return parseInt(d, 10);
			});
			this.update();
			this.updateNavArrows();
		},

		place: function(){
			if(this.isInline) return;
			var zIndex = parseInt(this.element.parents().filter(function() {
				return $(this).css('z-index') != 'auto';
			}).first().css('z-index'))+10;
			var offset, top, left;
			if (this.component) {
				offset = this.component.offset();
				left = offset.left;
				if (this.pickerPosition == 'bottom-left' || this.pickerPosition == 'top-left') {
					left += this.component.outerWidth() - this.picker.outerWidth();
				}
			} else {
				offset = this.element.offset();
				left = offset.left;
			}
			if (this.pickerPosition == 'top-left' || this.pickerPosition == 'top-right') {
				top = offset.top - this.picker.outerHeight();
			} else {
				top = offset.top + this.height;
			}
			this.picker.css({
				top: (top + 2),
				left: (left - 36),
				zIndex: zIndex
			});
		},

		update: function(){
			var date, fromArgs = false;
			if(arguments && arguments.length && (typeof arguments[0] === 'string' || arguments[0] instanceof Date)) {
				date = arguments[0];
				fromArgs = true;
			} else {
				date = (this.isInput ? this.element.prop('value') : this.element.data('date') || this.element.find('input').prop('value')) || this.initialDate;
			}

			if (!date) {
				date = new Date();
				fromArgs = false;
			}

			this.date = DPGlobal.parseDate(date, this.format, this.language, this.formatType);

			if (fromArgs) this.setValue();

			if (this.date < this.startDate) {
				this.viewDate = new Date(this.startDate);
			} else if (this.date > this.endDate) {
				this.viewDate = new Date(this.endDate);
			} else {
				this.viewDate = new Date(this.date);
			}
			this.fill();
		},

		fillDow: function(){
			var dowCnt = this.weekStart,
			html = '<tr>';
			while (dowCnt < this.weekStart + 7) {
				html += '<th class="dow">'+dates[this.language].daysMin[(dowCnt++)%7]+'</th>';
			}
			html += '</tr>';
			this.picker.find('.datetimepicker-days thead').append(html);
		},

		fillMonths: function(){
			var html = '',
			i = 0;
			while (i < 12) {
				html += '<span class="month">'+dates[this.language].monthsShort[i++]+'</span>';
			}
			this.picker.find('.datetimepicker-months td').html(html);
		},

		fill: function() {
			if (this.date == null || this.viewDate == null) {
				return;
			}
			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth(),
				dayMonth = d.getUTCDate(),
				hours = d.getUTCHours(),
				minutes = d.getUTCMinutes(),
				startYear = this.startDate !== -Infinity ? this.startDate.getUTCFullYear() : -Infinity,
				startMonth = this.startDate !== -Infinity ? this.startDate.getUTCMonth() : -Infinity,
				endYear = this.endDate !== Infinity ? this.endDate.getUTCFullYear() : Infinity,
				endMonth = this.endDate !== Infinity ? this.endDate.getUTCMonth() : Infinity,
				currentDate = (new UTCDate(this.date.getUTCFullYear(), this.date.getUTCMonth(), this.date.getUTCDate())).valueOf(),
				today = new Date();
			this.picker.find('.datetimepicker-days thead th:eq(1)')
						.text(dates[this.language].months[month]+' '+year);
		    if (this.formatViewType == "time") {
		        var hourConverted = hours % 12 ? hours % 12 : 12;
		        var hoursDisplay = (hourConverted < 10 ? '0' : '') + hourConverted;
		        var minutesDisplay = (minutes < 10 ? '0' : '') + minutes;
		        var meridianDisplay = dates[this.language].meridiem[hours < 12 ? 0 : 1];
		        this.picker.find('.datetimepicker-hours thead th:eq(1)')
		            .text(hoursDisplay + ':' + minutesDisplay + ' ' + meridianDisplay.toUpperCase());
		        this.picker.find('.datetimepicker-minutes thead th:eq(1)')
		            .text(hoursDisplay + ':' + minutesDisplay + ' ' + meridianDisplay.toUpperCase());
		    } else {
		        this.picker.find('.datetimepicker-hours thead th:eq(1)')
		            .text(dayMonth + ' ' + dates[this.language].months[month] + ' ' + year);
		        this.picker.find('.datetimepicker-minutes thead th:eq(1)')
		            .text(dayMonth + ' ' + dates[this.language].months[month] + ' ' + year);		        
		    }
		    this.picker.find('tfoot th.today')
						.text(dates[this.language].today)
						.toggle(this.todayBtn !== false);
			this.updateNavArrows();
			this.fillMonths();
			/*var prevMonth = UTCDate(year, month, 0,0,0,0,0);
			prevMonth.setUTCDate(prevMonth.getDate() - (prevMonth.getUTCDay() - this.weekStart + 7)%7);*/
			var prevMonth = UTCDate(year, month-1, 28,0,0,0,0),
                day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
		    prevMonth.setUTCDate(day);
      		prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.weekStart + 7)%7);
			var nextMonth = new Date(prevMonth);
			nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
			nextMonth = nextMonth.valueOf();
			var html = [];
			var clsName;
			while(prevMonth.valueOf() < nextMonth) {
				if (prevMonth.getUTCDay() == this.weekStart) {
					html.push('<tr>');
				}
				clsName = '';
				if (prevMonth.getUTCFullYear() < year || (prevMonth.getUTCFullYear() == year && prevMonth.getUTCMonth() < month)) {
					clsName += ' old';
				} else if (prevMonth.getUTCFullYear() > year || (prevMonth.getUTCFullYear() == year && prevMonth.getUTCMonth() > month)) {
					clsName += ' new';
				}
				// Compare internal UTC date with local today, not UTC today
				if (this.todayHighlight &&
					prevMonth.getUTCFullYear() == today.getFullYear() &&
					prevMonth.getUTCMonth() == today.getMonth() &&
					prevMonth.getUTCDate() == today.getDate()) {
					clsName += ' today';
				}
				if (prevMonth.valueOf() == currentDate) {
					clsName += ' active';
				}
				if ((prevMonth.valueOf() + 86400000) <= this.startDate || prevMonth.valueOf() > this.endDate ||
					$.inArray(prevMonth.getUTCDay(), this.daysOfWeekDisabled) !== -1) {
					clsName += ' disabled';
				}
				html.push('<td class="day'+clsName+'">'+prevMonth.getUTCDate() + '</td>');
				if (prevMonth.getUTCDay() == this.weekEnd) {
					html.push('</tr>');
				}
				prevMonth.setUTCDate(prevMonth.getUTCDate()+1);
			}
			this.picker.find('.datetimepicker-days tbody').empty().append(html.join(''));

			html = [];
            var txt = '', meridian = '', meridianOld = '';
			for (var i=0;i<24;i++) {
				var actual = UTCDate(year, month, dayMonth, i);
				clsName = '';
				// We want the previous hour for the startDate
				if ((actual.valueOf() + 3600000) <= this.startDate || actual.valueOf() > this.endDate) {
					clsName += ' disabled';
				} else if (hours == i) {
					clsName += ' active';
				}
                if (this.showMeridian && dates[this.language].meridiem.length == 2) {
                    meridian = (i<12?dates[this.language].meridiem[0]:dates[this.language].meridiem[1]);
                    if (meridian != meridianOld) {
                        if (meridianOld != '') {
                            html.push('</fieldset>');
                        }
                        html.push('<fieldset class="hour"><legend>'+meridian.toUpperCase()+'</legend>');
                    }
                    meridianOld = meridian;
                    txt = (i%12?i%12:12);
                    html.push('<span class="hour'+clsName+' hour_'+(i<12?'am':'pm')+'">'+txt+'</span>');
                    if (i == 23) {
                        html.push('</fieldset>');
                    }
                } else {
                    txt = i+':00';
                    html.push('<span class="hour'+clsName+'">'+txt+'</span>');
                }
			}
			this.picker.find('.datetimepicker-hours td').html(html.join(''));

			html = [];
            txt = '', meridian = '', meridianOld = '';
			for(var i=0;i<60;i+=this.minuteStep) {
				var actual = UTCDate(year, month, dayMonth, hours, i, 0);
				clsName = '';
				if (actual.valueOf() < this.startDate || actual.valueOf() > this.endDate) {
					clsName += ' disabled';
				} else if (Math.floor(minutes/this.minuteStep) == Math.floor(i/this.minuteStep)) {
					clsName += ' active';
				}
                if (this.showMeridian && dates[this.language].meridiem.length == 2) {
                    meridian = (hours<12?dates[this.language].meridiem[0]:dates[this.language].meridiem[1]);
                    if (meridian != meridianOld) {
                        if (meridianOld != '') {
                            html.push('</fieldset>');
                        }
                        html.push('<fieldset class="minute"><legend>'+meridian.toUpperCase()+'</legend>');
                    }
                    meridianOld = meridian;
                    txt = (hours%12?hours%12:12);
                    //html.push('<span class="minute'+clsName+' minute_'+(hours<12?'am':'pm')+'">'+txt+'</span>');
                    html.push('<span class="minute'+clsName+'">'+txt+':'+(i<10?'0'+i:i)+'</span>');
                    if (i == 59) {
                        html.push('</fieldset>');
                    }
                } else {
                    txt = i+':00';
                    //html.push('<span class="hour'+clsName+'">'+txt+'</span>');
                    html.push('<span class="minute'+clsName+'">'+hours+':'+(i<10?'0'+i:i)+'</span>');
                }
			}
			this.picker.find('.datetimepicker-minutes td').html(html.join(''));

			var currentYear = this.date.getUTCFullYear();
			var months = this.picker.find('.datetimepicker-months')
						.find('th:eq(1)')
						.text(year)
						.end()
						.find('span').removeClass('active');
			if (currentYear == year) {
				months.eq(this.date.getUTCMonth()).addClass('active');
			}
			if (year < startYear || year > endYear) {
				months.addClass('disabled');
			}
			if (year == startYear) {
				months.slice(0, startMonth).addClass('disabled');
			}
			if (year == endYear) {
				months.slice(endMonth+1).addClass('disabled');
			}

			html = '';
			year = parseInt(year/10, 10) * 10;
			var yearCont = this.picker.find('.datetimepicker-years')
								.find('th:eq(1)')
								.text(year + '-' + (year + 9))
								.end()
								.find('td');
			year -= 1;
			for (var i = -1; i < 11; i++) {
				html += '<span class="year'+(i == -1 || i == 10 ? ' old' : '')+(currentYear == year ? ' active' : '')+(year < startYear || year > endYear ? ' disabled' : '')+'">'+year+'</span>';
				year += 1;
			}
			yearCont.html(html);
			this.place();
		},

		updateNavArrows: function() {
			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth(),
				day = d.getUTCDate(),
				hour = d.getUTCHours();
			switch (this.viewMode) {
				case 0:
					if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear() 
													 && month <= this.startDate.getUTCMonth()
													 && day <= this.startDate.getUTCDate()
													 && hour <= this.startDate.getUTCHours()) {
						this.picker.find('.prev').css({visibility: 'hidden'});
					} else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear() 
												  && month >= this.endDate.getUTCMonth()
												  && day >= this.endDate.getUTCDate()
												  && hour >= this.endDate.getUTCHours()) {
						this.picker.find('.next').css({visibility: 'hidden'});
					} else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
				case 1:
					if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear() 
													 && month <= this.startDate.getUTCMonth()
													 && day <= this.startDate.getUTCDate()) {
						this.picker.find('.prev').css({visibility: 'hidden'});
					} else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear() 
												  && month >= this.endDate.getUTCMonth()
												  && day >= this.endDate.getUTCDate()) {
						this.picker.find('.next').css({visibility: 'hidden'});
					} else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
				case 2:
					if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear() 
													 && month <= this.startDate.getUTCMonth()) {
						this.picker.find('.prev').css({visibility: 'hidden'});
					} else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear() 
												  && month >= this.endDate.getUTCMonth()) {
						this.picker.find('.next').css({visibility: 'hidden'});
					} else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
				case 3:
				case 4:
					if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear()) {
						this.picker.find('.prev').css({visibility: 'hidden'});
					} else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear()) {
						this.picker.find('.next').css({visibility: 'hidden'});
					} else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
			}
		},

		click: function(e) {
			e.stopPropagation();
			e.preventDefault();
			var target = $(e.target).closest('span, td, th, legend');
			if (target.length == 1) {
				if (target.is('.disabled')) {
					this.element.trigger({
						type: 'outOfRange',
						date: this.viewDate,
						startDate: this.startDate,
						endDate: this.endDate
					});
					return;
				}
				switch(target[0].nodeName.toLowerCase()) {
					case 'th':
						switch(target[0].className) {
							case 'switch':
								this.showMode(1);
								break;
							case 'prev':
							case 'next':
								var dir = DPGlobal.modes[this.viewMode].navStep * (target[0].className == 'prev' ? -1 : 1);
								switch(this.viewMode){
									case 0:
										this.viewDate = this.moveHour(this.viewDate, dir);
										break;
									case 1:
										this.viewDate = this.moveDate(this.viewDate, dir);
										break;
									case 2:
										this.viewDate = this.moveMonth(this.viewDate, dir);
										break;
									case 3:
									case 4:
										this.viewDate = this.moveYear(this.viewDate, dir);
										break;
								}
								this.fill();
								break;
							case 'today':
								var date = new Date();
								date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0);

								this.viewMode = this.startViewMode;
								this.showMode(0);
								this._setDate(date);
								this.fill();
								if (this.autoclose) {
									this.hide();
								}
								break;
						}
						break;
					case 'span':
						if (!target.is('.disabled')) {
                            var year    = this.viewDate.getUTCFullYear(),
                                month   = this.viewDate.getUTCMonth(),
                                day     = this.viewDate.getUTCDate(),
                                hours   = this.viewDate.getUTCHours(),
                                minutes = this.viewDate.getUTCMinutes(),
                                seconds = this.viewDate.getUTCSeconds();

							if (target.is('.month')) {
								this.viewDate.setUTCDate(1);
								month = target.parent().find('span').index(target);
                                day   = this.viewDate.getUTCDate();
								this.viewDate.setUTCMonth(month);
								this.element.trigger({
									type: 'changeMonth',
									date: this.viewDate
								});
                                if (this.viewSelect >= 3) {
								    this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
                                }
							} else if (target.is('.year')) {
								this.viewDate.setUTCDate(1);
								year = parseInt(target.text(), 10) || 0;
								this.viewDate.setUTCFullYear(year);
								this.element.trigger({
									type: 'changeYear',
									date: this.viewDate
								});
                                if (this.viewSelect >= 4) {
                                    this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
                                }
							} else if (target.is('.hour')){
								hours = parseInt(target.text(), 10) || 0;
                                if (target.hasClass('hour_am') || target.hasClass('hour_pm')) {
                                    if (hours == 12 && target.hasClass('hour_am')) {
                                        hours = 0;
                                    } else if (hours != 12 && target.hasClass('hour_pm')) {
                                        hours += 12;
                                    }
                                }
                                this.viewDate.setUTCHours(hours);
								this.element.trigger({
									type: 'changeHour',
									date: this.viewDate
								});
                                if (this.viewSelect >= 1) {
								    this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
                                }
							} else if (target.is('.minute')){
								minutes = parseInt(target.text().substr(target.text().indexOf(':')+1), 10) || 0;
                                this.viewDate.setUTCMinutes(minutes);
								this.element.trigger({
									type: 'changeMinute',
									date: this.viewDate
								});
                                if (this.viewSelect >= 0) {
								    this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
                                }
							}
							if (this.viewMode != 0) {
								var oldViewMode = this.viewMode;
								this.showMode(-1);
								this.fill();
								if (oldViewMode == this.viewMode && this.autoclose) {
									this.hide();
								}
							} else {
								this.fill();
								if (this.autoclose) {
									this.hide();
								}
							}
						}
						break;
					case 'td':
						if (target.is('.day') && !target.is('.disabled')){
							var day = parseInt(target.text(), 10) || 1;
							var year = this.viewDate.getUTCFullYear(),
								month = this.viewDate.getUTCMonth(),
								hours = this.viewDate.getUTCHours(),
								minutes = this.viewDate.getUTCMinutes(),
								seconds = this.viewDate.getUTCSeconds();
							if (target.is('.old')) {
								if (month === 0) {
									month = 11;
									year -= 1;
								} else {
									month -= 1;
								}
							} else if (target.is('.new')) {
								if (month == 11) {
									month = 0;
									year += 1;
								} else {
									month += 1;
								}
							}
                            this.viewDate.setUTCDate(day);
                            this.viewDate.setUTCMonth(month);
                            this.viewDate.setUTCFullYear(year);
                            this.element.trigger({
                                type: 'changeDay',
                                date: this.viewDate
                            });
                            if (this.viewSelect >= 2) {
							    this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
                            }
						}
						var oldViewMode = this.viewMode;
						this.showMode(-1);
						this.fill();
						if (oldViewMode == this.viewMode && this.autoclose) {
							this.hide();
						}
            if (this.buttonBar && !this.isInline && moment) {
              this.buttonAction.call(this, this.element.val().replace(/\//g, '-'));
            }
            
						break;
				}
			}
		},

		_setDate: function(date, which){
			if (!which || which == 'date')
				this.date = date;
			if (!which || which  == 'view')
				this.viewDate = date;
			this.fill();
			this.element.trigger({
				type: 'changeDate',
				date: this.date
			});
			this.setValue();
			var element;
			if (this.isInput) {
				element = this.element;
			} else if (this.component){
				element = this.element.find('input');
			}
			if (element) {
				element.change();
				if (this.autoclose && (!which || which == 'date')) {
					//this.hide();
				}
			}
		},

		moveMinute: function(date, dir){
			if (!dir) return date;
			var new_date = new Date(date.valueOf());
			//dir = dir > 0 ? 1 : -1;
			new_date.setUTCMinutes(new_date.getUTCMinutes() + (dir * this.minuteStep));
			return new_date;
		},

		moveHour: function(date, dir){
			if (!dir) return date;
			var new_date = new Date(date.valueOf());
			//dir = dir > 0 ? 1 : -1;
			new_date.setUTCHours(new_date.getUTCHours() + dir);
			return new_date;
		},

		moveDate: function(date, dir){
			if (!dir) return date;
			var new_date = new Date(date.valueOf());
			//dir = dir > 0 ? 1 : -1;
			new_date.setUTCDate(new_date.getUTCDate() + dir);
			return new_date;
		},

		moveMonth: function(date, dir){
			if (!dir) return date;
			var new_date = new Date(date.valueOf()),
				day = new_date.getUTCDate(),
				month = new_date.getUTCMonth(),
				mag = Math.abs(dir),
				new_month, test;
			dir = dir > 0 ? 1 : -1;
			if (mag == 1){
				test = dir == -1
					// If going back one month, make sure month is not current month
					// (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
					? function(){ return new_date.getUTCMonth() == month; }
					// If going forward one month, make sure month is as expected
					// (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
					: function(){ return new_date.getUTCMonth() != new_month; };
				new_month = month + dir;
				new_date.setUTCMonth(new_month);
				// Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
				if (new_month < 0 || new_month > 11)
					new_month = (new_month + 12) % 12;
			} else {
				// For magnitudes >1, move one month at a time...
				for (var i=0; i<mag; i++)
					// ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
					new_date = this.moveMonth(new_date, dir);
				// ...then reset the day, keeping it in the new month
				new_month = new_date.getUTCMonth();
				new_date.setUTCDate(day);
				test = function(){ return new_month != new_date.getUTCMonth(); };
			}
			// Common date-resetting loop -- if date is beyond end of month, make it
			// end of month
			while (test()){
				new_date.setUTCDate(--day);
				new_date.setUTCMonth(new_month);
			}
			return new_date;
		},

		moveYear: function(date, dir){
			return this.moveMonth(date, dir*12);
		},

		dateWithinRange: function(date){
			return date >= this.startDate && date <= this.endDate;
		},

		keydown: function(e){
			if (this.picker.is(':not(:visible)')){
				if (e.keyCode == 27) // allow escape to hide and re-show picker
					this.show();
				return;
			}
			var dateChanged = false,
				dir, day, month,
				newDate, newViewDate;
			switch(e.keyCode){
				case 27: // escape
					this.hide();
					e.preventDefault();
					break;
				case 37: // left
				case 39: // right
					if (!this.keyboardNavigation) break;
					dir = e.keyCode == 37 ? -1 : 1;
                    viewMode = this.viewMode;
                    if (e.ctrlKey) {
                        viewMode += 2;
                    } else if (e.shiftKey) {
                        viewMode += 1;
                    }
                    if (viewMode == 4) {
						newDate = this.moveYear(this.date, dir);
						newViewDate = this.moveYear(this.viewDate, dir);
                    } else if (viewMode == 3) {
						newDate = this.moveMonth(this.date, dir);
						newViewDate = this.moveMonth(this.viewDate, dir);
                    } else if (viewMode == 2) {
						newDate = this.moveDate(this.date, dir);
						newViewDate = this.moveDate(this.viewDate, dir);
                    } else if (viewMode == 1) {
						newDate = this.moveHour(this.date, dir);
						newViewDate = this.moveHour(this.viewDate, dir);
                    } else if (viewMode == 0) {
						newDate = this.moveMinute(this.date, dir);
						newViewDate = this.moveMinute(this.viewDate, dir);
                    }
					if (this.dateWithinRange(newDate)){
						this.date = newDate;
						this.viewDate = newViewDate;
						this.setValue();
						this.update();
						e.preventDefault();
						dateChanged = true;
					}
					break;
				case 38: // up
				case 40: // down
					if (!this.keyboardNavigation) break;
					dir = e.keyCode == 38 ? -1 : 1;
                    viewMode = this.viewMode;
                    if (e.ctrlKey) {
                        viewMode += 2;
                    } else if (e.shiftKey) {
                        viewMode += 1;
                    }
                    if (viewMode == 4) {
						newDate = this.moveYear(this.date, dir);
						newViewDate = this.moveYear(this.viewDate, dir);
                    } else if (viewMode == 3) {
						newDate = this.moveMonth(this.date, dir);
						newViewDate = this.moveMonth(this.viewDate, dir);
                    } else if (viewMode == 2) {
						newDate = this.moveDate(this.date, dir * 7);
						newViewDate = this.moveDate(this.viewDate, dir * 7);
                    } else if (viewMode == 1) {
                        if (this.showMeridian) {
                            newDate = this.moveHour(this.date, dir * 6);
                            newViewDate = this.moveHour(this.viewDate, dir * 6);
                        } else {
                            newDate = this.moveHour(this.date, dir * 4);
                            newViewDate = this.moveHour(this.viewDate, dir * 4);
                        }
                    } else if (viewMode == 0) {
						newDate = this.moveMinute(this.date, dir * 4);
						newViewDate = this.moveMinute(this.viewDate, dir * 4);
                    }
					if (this.dateWithinRange(newDate)){
						this.date = newDate;
						this.viewDate = newViewDate;
						this.setValue();
						this.update();
						e.preventDefault();
						dateChanged = true;
					}
					break;
				case 13: // enter
                    if (this.viewMode != 0) {
                        var oldViewMode = this.viewMode;
                        this.showMode(-1);
                        this.fill();
                        if (oldViewMode == this.viewMode && this.autoclose) {
                            this.hide();
                        }
                    } else {
                        this.fill();
                        if (this.autoclose) {
					        this.hide();
                        }
                    }
					e.preventDefault();
					break;
				case 9: // tab
					this.hide();
					break;
			}
			if (dateChanged){
				this.element.trigger({
					type: 'changeDate',
					date: this.date
				});
				var element;
				if (this.isInput) {
					element = this.element;
				} else if (this.component){
					element = this.element.find('input');
				}
				if (element) {
					element.change();
				}
			}
		},

		showMode: function(dir) {
      var that = this;

			if (dir) {
				var newViewMode = Math.max(0, Math.min(DPGlobal.modes.length - 1, this.viewMode + dir));
				if (newViewMode >= this.minView && newViewMode <= this.maxView) {
					this.viewMode = newViewMode;
				}
			}
			//this.picker.find('>div').hide().filter('.datetimepicker-'+DPGlobal.modes[this.viewMode].clsName).show();
			this.picker.find('>div').hide().filter('.datetimepicker-'+DPGlobal.modes[this.viewMode].clsName).css('display', 'block');
      if (this.buttonBar && !this.isInline && moment) {
        this.picker.find('>div.button-bar').css('display', 'block');
      }
      
			this.updateNavArrows();
		},
		
		reset: function(e) {
			this._setDate(null, 'date');
		}
	};

	$.fn.datetimepicker = function ( option ) {
		var args = Array.apply(null, arguments);
		args.shift();
		return this.each(function () {
			var $this = $(this),
				data = $this.data('datetimepicker'),
				options = typeof option == 'object' && option;
			if (!data) {
				$this.data('datetimepicker', (data = new Datetimepicker(this, $.extend({}, $.fn.datetimepicker.defaults,options))));
			}
			if (typeof option == 'string' && typeof data[option] == 'function') {
				data[option].apply(data, args);
			}
		});
	};

	$.fn.datetimepicker.defaults = {
	};
	$.fn.datetimepicker.Constructor = Datetimepicker;
	var dates = $.fn.datetimepicker.dates = {
		en: {
			days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
			daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
			daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			meridiem: ["am", "pm"],
			suffix: ["st", "nd", "rd", "th"],
			today: "Today"
		}
	};

	var DPGlobal = {
		modes: [
			{
				clsName: 'minutes',
				navFnc: 'Hours',
				navStep: 1
			},
			{
				clsName: 'hours',
				navFnc: 'Date',
				navStep: 1
			},
			{
				clsName: 'days',
				navFnc: 'Month',
				navStep: 1
			},
			{
				clsName: 'months',
				navFnc: 'FullYear',
				navStep: 1
			},
			{
				clsName: 'years',
				navFnc: 'FullYear',
				navStep: 10
		}],
		isLeapYear: function (year) {
			return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
		},
		getDaysInMonth: function (year, month) {
			return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
		},
		getDefaultFormat: function (type, field) {
			if (type == "standard") {
				if (field == 'input')
					return 'yyyy-mm-dd hh:ii';
				else
					return 'yyyy-mm-dd hh:ii:ss';
			} else if (type == "php") {
				if (field == 'input')
					return 'Y-m-d H:i';
				else
					return 'Y-m-d H:i:s';
			} else {
				throw new Error("Invalid format type.");
			}
		},
		validParts: function (type) {
			if (type == "standard") {
				return /hh?|HH?|p|P|ii?|ss?|dd?|DD?|mm?|MM?|yy(?:yy)?/g;
			} else if (type == "php") {
				return /[dDjlNwzFmMnStyYaABgGhHis]/g;
			} else {
				throw new Error("Invalid format type.");
			}
		},
		nonpunctuation: /[^ -\/:-@\[-`{-~\t\n\rTZ]+/g,
		parseFormat: function(format, type){
			var separators = format.replace(this.validParts(type), '\0').split('\0'),
				parts = format.match(this.validParts(type));
			if (!separators || !separators.length || !parts || parts.length == 0){
				throw new Error("Invalid date format.");
			}
			return {separators: separators, parts: parts};
		},
		parseDate: function(date, format, language, type) {
			if (date instanceof Date) {
				var dateUTC = new Date(date.valueOf() - date.getTimezoneOffset() * 60000);
                dateUTC.setMilliseconds(0);
				return dateUTC;
			}
			if (/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(date)) {
				format = this.parseFormat('yyyy-mm-dd', type);
			}
			if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}$/.test(date)) {
				format = this.parseFormat('yyyy-mm-dd hh:ii', type);
			}
			if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}\:\d{1,2}[Z]{0,1}$/.test(date)) {
				format = this.parseFormat('yyyy-mm-dd hh:ii:ss', type);
			}
			if (/^[-+]\d+[dmwy]([\s,]+[-+]\d+[dmwy])*$/.test(date)) {
				var part_re = /([-+]\d+)([dmwy])/,
					parts = date.match(/([-+]\d+)([dmwy])/g),
					part, dir;
				date = new Date();
				for (var i=0; i<parts.length; i++) {
					part = part_re.exec(parts[i]);
					dir = parseInt(part[1]);
					switch(part[2]){
						case 'd':
							date.setUTCDate(date.getUTCDate() + dir);
							break;
						case 'm':
							date = Datetimepicker.prototype.moveMonth.call(Datetimepicker.prototype, date, dir);
							break;
						case 'w':
							date.setUTCDate(date.getUTCDate() + dir * 7);
							break;
						case 'y':
							date = Datetimepicker.prototype.moveYear.call(Datetimepicker.prototype, date, dir);
							break;
					}
				}
				return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), 0);
			}
			var parts = date && date.match(this.nonpunctuation) || [],
				date = new Date(0, 0, 0, 0, 0, 0, 0),
				parsed = {},
				setters_order = ['hh', 'h', 'ii', 'i', 'ss', 's', 'yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'D', 'DD', 'd', 'dd', 'H', 'HH', 'p', 'P'],
				setters_map = {
					hh: function(d,v){ return d.setUTCHours(v); },
					h:  function(d,v){ return d.setUTCHours(v); },
					HH: function(d,v){ return d.setUTCHours(v==12?0:v); },
					H:  function(d,v){ return d.setUTCHours(v==12?0:v); },
					ii: function(d,v){ return d.setUTCMinutes(v); },
					i:  function(d,v){ return d.setUTCMinutes(v); },
					ss: function(d,v){ return d.setUTCSeconds(v); },
					s:  function(d,v){ return d.setUTCSeconds(v); },
					yyyy: function(d,v){ return d.setUTCFullYear(v); },
					yy: function(d,v){ return d.setUTCFullYear(2000+v); },
					m: function(d,v){
						v -= 1;
						while (v<0) v += 12;
						v %= 12;
						d.setUTCMonth(v);
						while (d.getUTCMonth() != v)
							d.setUTCDate(d.getUTCDate()-1);
						return d;
					},
					d: function(d,v){ return d.setUTCDate(v); },
					p: function(d,v){ return d.setUTCHours(v==1?d.getUTCHours()+12:d.getUTCHours()); }
				},
				val, filtered, part;
			setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
			setters_map['dd'] = setters_map['d'];
		    	setters_map['P'] = setters_map['p'];
			date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
			if (parts.length == format.parts.length) {
				for (var i=0, cnt = format.parts.length; i < cnt; i++) {
					val = parseInt(parts[i], 10);
					part = format.parts[i];
					if (isNaN(val)) {
						switch(part) {
							case 'MM':
								filtered = $(dates[language].months).filter(function(){
									var m = this.slice(0, parts[i].length),
										p = parts[i].slice(0, m.length);
									return m == p;
								});
								val = $.inArray(filtered[0], dates[language].months) + 1;
								break;
							case 'M':
								filtered = $(dates[language].monthsShort).filter(function(){
									var m = this.slice(0, parts[i].length),
										p = parts[i].slice(0, m.length);
									return m == p;
								});
								val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
								break;
						    case 'p':
						    case 'P':
						        val = $.inArray(parts[i].toLowerCase(), dates[language].meridiem);
						        break;
						}
					}
					parsed[part] = val;
				}
				for (var i=0, s; i<setters_order.length; i++){
					s = setters_order[i];
					if (s in parsed && !isNaN(parsed[s]))
						setters_map[s](date, parsed[s]);
				}
			}
			return date;
		},
		formatDate: function(date, format, language, type){
			if (date == null) {
				return '';
			}
			var val;
			if (type == 'standard') {
				val = {
					// year
					yy: date.getUTCFullYear().toString().substring(2),
					yyyy: date.getUTCFullYear(),
					// month
					m: date.getUTCMonth() + 1,
					M: dates[language].monthsShort[date.getUTCMonth()],
					MM: dates[language].months[date.getUTCMonth()],
					// day
					d: date.getUTCDate(),
					D: dates[language].daysShort[date.getUTCDay()],
					DD: dates[language].days[date.getUTCDay()],
					p: (dates[language].meridiem.length==2?dates[language].meridiem[date.getUTCHours()<12?0:1]:''),
					// hour
					h: date.getUTCHours(),
					// minute
					i: date.getUTCMinutes(),
					// second
					s: date.getUTCSeconds()
				};
                val.H  = (val.h%12==0? 12 : val.h%12);
                val.HH = (val.H < 10 ? '0' : '') + val.H;
                val.P  = val.p.toUpperCase();
				val.hh = (val.h < 10 ? '0' : '') + val.h;
				val.ii = (val.i < 10 ? '0' : '') + val.i;
				val.ss = (val.s < 10 ? '0' : '') + val.s;
				val.dd = (val.d < 10 ? '0' : '') + val.d;
				val.mm = (val.m < 10 ? '0' : '') + val.m;
			} else if (type == 'php') {
				// php format
				val = {
					// year
					y: date.getUTCFullYear().toString().substring(2),
					Y: date.getUTCFullYear(),
					// month
					F: dates[language].months[date.getUTCMonth()],
					M: dates[language].monthsShort[date.getUTCMonth()],
					n: date.getUTCMonth() + 1,
					t: DPGlobal.getDaysInMonth(date.getUTCFullYear(), date.getUTCMonth()),
					// day
					j: date.getUTCDate(),
					l: dates[language].days[date.getUTCDay()],
					D: dates[language].daysShort[date.getUTCDay()],
					w: date.getUTCDay(), // 0 -> 6
					N: (date.getUTCDay()==0?7:date.getUTCDay()),       // 1 -> 7
					S: (date.getUTCDate()%10<=dates[language].suffix.length?dates[language].suffix[date.getUTCDate()%10-1]:''),
					// hour
					a: (dates[language].meridiem.length==2?dates[language].meridiem[date.getUTCHours()<12?0:1]:''),
					g: (date.getUTCHours()%12==0?12:date.getUTCHours()%12),
					G: date.getUTCHours(),
					// minute
					i: date.getUTCMinutes(),
					// second
					s: date.getUTCSeconds()
				};
				val.m = (val.n < 10 ? '0' : '') + val.n;
				val.d = (val.j < 10 ? '0' : '') + val.j;
				val.A = val.a.toString().toUpperCase();
				val.h = (val.g < 10 ? '0' : '') + val.g;
				val.H = (val.G < 10 ? '0' : '') + val.G;
				val.i = (val.i < 10 ? '0' : '') + val.i;
				val.s = (val.s < 10 ? '0' : '') + val.s;
			} else {
				throw new Error("Invalid format type.");
			}
			var date = [],
				seps = $.extend([], format.separators);
			for (var i=0, cnt = format.parts.length; i < cnt; i++) {
				if (seps.length)
					date.push(seps.shift());
				date.push(val[format.parts[i]]);
			}
			return date.join('');
		},
		convertViewMode: function(viewMode){
			switch (viewMode) {
				case 4:
				case 'decade':
					viewMode = 4;
					break;
				case 3:
				case 'year':
					viewMode = 3;
					break;
				case 2:
				case 'month':
					viewMode = 2;
					break;
				case 1:
				case 'day':
					viewMode = 1;
					break;
				case 0:
				case 'hour':
					viewMode = 0;
					break;
			}

			return viewMode;
		},
		headTemplate: '<thead>'+
							'<tr>'+
								'<th class="prev"><i class="icon-arrow-left"/></th>'+
								'<th colspan="5" class="switch"></th>'+
								'<th class="next"><i class="icon-arrow-right"/></th>'+
							'</tr>'+
						'</thead>',
		contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
		footTemplate: '<tfoot><tr><th colspan="7" class="today"></th></tr></tfoot>'
	};
	DPGlobal.template = '<div class="datetimepicker">'+
              '<div class="button-bar">'+
                '<span class="c-b" data-type="today">今天</span>'+
                '<span class="c-b" data-type="tomorrow">明天</span>'+
                '<span class="c-b" data-type="friday">本周五</span>'+
                '<span class="c-b" data-type="nextMonday">下周一</span>'+
                '<span class="c-b" data-type="lastDayInMonth">本月底</span>'+
              '</div>'+
							'<div class="datetimepicker-minutes">'+
								'<table class=" table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datetimepicker-hours">'+
								'<table class=" table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datetimepicker-days">'+
								'<table class=" table-condensed">'+
									DPGlobal.headTemplate+
									'<tbody></tbody>'+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datetimepicker-months">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datetimepicker-years">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
						'</div>';

	$.fn.datetimepicker.DPGlobal = DPGlobal;

}( window.jQuery );
;(function($){
	$.fn.datetimepicker.dates['cn'] = {
				days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
			daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
			daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
			months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
			monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
			today: "今日",
		suffix: [],
		meridiem: []
	};
}(jQuery));

/*
 * Message
 * */
;(function($, undefined) {
	'use strict';

	var pluginName = 'imessage',
		id = 'message-box';
	
	$[pluginName] = function(message, target, type) {
		clearTimeout($[pluginName].timeout);
		var $selector = $('#' + id);
		var html = '<div id="'+id+'" class="'+type+'" style="display: none;"><div class="message-inner">'+message+'</div></div>';
		
		if ($selector.length > 0) {
			$selector.remove();
		}
		if (typeof target !== 'object' || target.length === 0) {
			return false;
		}
		else {
			if (target.css('position') === 'static') {
				target.css('position', 'relative');
			}
		}
		target.prepend(html);
		$selector = $('#' + id);
		$selector.slideDown('fast', function() {
			$[pluginName].timeout = setTimeout(function() {
				$selector.slideUp('fast', function() {
					$selector.remove();
				});
			}, 2000);
		});
	};
})(jQuery);

/*
 * Tree nav
 */
;!function ($) {
	'use strict';

	var TreeNav = function (element, options) {
		this.init('treenav', element, options);
	};

	TreeNav.prototype = {
		constructor: TreeNav,
		
		init: function (type, element, options) {
			var that = this;
			that.type = type;
			that.$element = $(element);
			that.options = this.getOptions(options);
			
			that.$root = that.$element.find('.root');
			that.$li = that.$element.find('li');
			$.each(that.$root.children('li'), function(i, v) {
				if ($(v).children('.child-node').length > 0) {
					$(v).addClass('up').prepend('<i class="icon-thin-right"></i>');
					$(v).children('.child-node').hide();
				}
			});
			
			that._bindEvents();
		},
		_bindEvents: function() {
			var that = this;
			
			that.$root.on('click', '[class^="icon-"]', function(e) {
				e.stopPropagation();
				var me = $(this),
					parent = me.parent();
				
				if (parent.hasClass('up')) {
					parent.removeClass('up').addClass('down');
					parent.children('.child-node').show();
					me.removeClass('icon-thin-right').addClass('icon-thin-down');
				}
				else {
					parent.removeClass('down').addClass('up');
					parent.children('.child-node').hide();
					me.removeClass('icon-thin-down').addClass('icon-thin-right');
				}
			});
			
			if (that.options.click && typeof that.options.click === 'function') {
				that.$root.on('click', 'a', function(e) {
					e.stopPropagation();
					e.preventDefault();
					var me = $(this);
					
					that.$li.removeClass('selected');
					me.parent().addClass('selected');
					that.options.click.call(that, me);
				});
			}
		},
		_unBindEvents: function() {
			var that = this;
			
			that.$root.off('click', '[class^="icon-"]');
		},
		getOptions: function (options) {
			options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options);

			return options;
		}
	};

	$.fn.treenav = function (option, args) {
		return this.each(function () {
			var $this = $(this);
			var data = $this.data('treenav');
			var options = typeof option === 'object' && option;
			if (!data) {
				$this.data('treenav', (data = new TreeNav(this, options)));
			}
			if (typeof option === 'string') {
				data[option](args);
			}
		});
	};

	$.fn.treenav.Constructor = TreeNav;
	$.fn.treenav.defaults = {
		click: null
	};
}(window.jQuery);

/*
 * Edit input
 * */
;(function($, undefined) {
	'use strict';
	var pluginName = 'editInput';
	
	var template = (function(text) {
		var render = function(text) {
			return '<div class="editinput">'
					+ '<input type="text" class="inputfield" value="'+text+'"/>'
					+ '<a class="btn ok"><i class="icon-ok"></i></a>'
					+ '<a class="btn last-child cancel"><i class="icon-remove"></i></a>'
				+ '</div>';
		};
		
		return {
			render: render
		};
	}(''));
	
	$[pluginName] = function(opts) {
		var _default = {};
		
		opts = $.extend({}, _default, opts);
		
		if (!opts.target || opts.target.length === 0 || !opts.submit) {
			return false;
		}
		if (opts.target.next().hasClass('editinput')) {
			return false;
		}
		
		var text = $.trim(opts.target.text());
		var html = template.render(text);
		var dom;
		
		if (opts.show && typeof opts.show === 'function') {
			dom = opts.show(html);
		}
		else {
			opts.target.hide();
			dom = $(html).insertAfter(opts.target);
		}
		
		dom.find('.ok').on('click', function() {
			var input = dom.find('.inputfield');
			if (opts.submit(input.val())) {
				opts.target.text(input.val());
				if (opts.hide && typeof opts.hide === 'function') {
					opts.hide();
				}
				else {
					opts.target.show().next().remove();
				}
			}
			else {
				alert('修改出错!');
				return false;
			}
		});
		dom.find('.cancel').on('click', function() {
			if (opts.hide && typeof opts.hide === 'function') {
				opts.hide();
			}
			else {
				opts.target.show().next().remove();
			}
		});
	};
})(jQuery);

/*
 * Filter box
 * */
;!function ($) {
	'use strict';

	var Filterbox = function (element, options) {
		this.init('filterbox', element, options);
	};

	Filterbox.prototype = {
		constructor: Filterbox,
		
		init: function (type, element, options) {
			var that = this;
			that.type = type;
			that.$element = $(element);
			that.options = this.getOptions(options);
			
			that.$filterObject = that.$element.find('.filter-object');
			that.$filterLabel = that.$element.find('.filter-label');
			that.$submit = that.$element.find('.submit');
			that.$filterBody = that.$element.find('.filter-body');
			that.$submitPath = that.$element.find('#submitPath');
			
			that._patchWidget();
			that._bindEvents();
		},
		_patchWidget: function() {
			var that = this;
			
			that.$element.find('.datetime').datetimepicker(that.options);
			that.$element.find('[type="checkbox"]').icheckbox();
		},
		_bindEvents: function() {
			var that = this;
			
			that.$filterLabel.on('click', function() {
				var me = $(this);
				
				if (me.hasClass('selected')) {
					me.next().hide();
					me.removeClass('selected');
				}
				else {
					that.$filterLabel.removeClass('selected');
					that.$filterBody.hide();
					me.next().show();
					me.addClass('selected');
				}
			});
			
			that.$submit.on('click', function() {
				that.submit();
			});
		},
		_unBindEvents: function() {
			var that = this;
			
			that.$btn.off('click');
			that.$ul.find('li').off('click');
		},
		getOptions: function (options) {
			options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options);

			return options;
		},
		validate: function() {
			var that = this;
			
			var currentObj = that.$filterLabel.filter('.selected').parent(),
				filterType = currentObj.data('filtertype'),
				result = {succeed: true, msg: ''};
				
			if (filterType === 'between') {
				var start = $.trim(currentObj.find('.inputfield[data-type="start"]').val()),
					end = $.trim(currentObj.find('.inputfield[data-type="end"]').val());
				if (currentObj.find('.inputfield').hasClass('number')) {
					var numericRegex = /^[0-9]+$/;
					
					if (!numericRegex.test(start) || !numericRegex.test(end)) {
						result = {succeed: false, msg: '必须输入数字!'};
					}
				}
				else if (currentObj.find('.inputfield').hasClass('datetime')) {
					if (new Date(start) > new Date(end)) {
						result = {succeed: false, msg: '开始时间不能大于结束时间!'};
					}
				}
			}
			return result;
		},
		submit: function(args) {
			var that = this;
			
			var result = that.validate();
			if (result.succeed) {
				var data = that.getData(),
					externalData = {};
				
				if (that.options.getExternalData && typeof that.options.getExternalData === 'function') {
					externalData = that.options.getExternalData.call();
				}
				externalData = $.extend({}, externalData, args);
				$.ajax({
					url: that.$submitPath.val(),
					type: 'POST',
					data: {'data': data, 'external': JSON.stringify(externalData)},
					beforeSend: function() {
						that.$element.spin();
					},
					error: function(jqXHR) {
						alert(jqXHR.statusText);
					},
					success: function(data) {
						if (that.options.success && typeof that.options.success === 'function') {
							that.options.success.call(that, data);
						}
					},
					complete: function() {
						that.$element.spin(false);
						that.$filterLabel.removeClass('selected');
						that.$filterBody.hide();
					}
				});
			}
			else {
				alert(result.msg);
			}
		},
		getData: function() {
			var that = this;
			var value = [];
			
			$.each(that.$filterObject, function(i, v) {
				var ft = $(v).data('filtertype');
				var fd = that.getFilterType(ft, $(v));
				if (fd) {
					value.push(fd);
				}
			});
			
			return JSON.stringify(value);
		},
		getFilterType: function(type, obj) {
			var that = this;
			var data;
			switch (type) {
				case 'like':
					data = that.getTextData(obj);
					break;
				case 'or':
					data = that.getCheckboxData(obj);
					break;
				case 'between':
					data = that.getDateData(obj);
					break;
				default:
					data = null;
			};
			return data;
		},
		getTextData: function(obj) {
			var value = $.trim(obj.find('.inputfield').val());
			
			if (value != '' && value.length > 0) {
				return {"value": [value], "field": obj.data('field'), "type": "String", "filterType": "like"};
			}
			else {
				return null;
			}
		},
		getCheckboxData: function(obj) {
			var value = [];
			
			obj.find('.icheckbox.checked').each(function(i, v) {
				value.push($(v).children('input').val());
			});
			
			if (value.length > 0) {
				return {"value": value, "field": obj.data('field'), "type": "String", "filterType": "or"};
			}
			else {
				return null;
			}
		},
		getDateData: function(obj) {
			var start = $.trim(obj.find('input[data-type="start"]').val());
			var end = $.trim(obj.find('input[data-type="end"]').val());
			
			if (start.length > 0 || end.length > 0) {
				return {"value": [start, end], "field": obj.data('field'), "type": "Date", "filterType": "between"};
			}
			else {
				return null;
			}
		}
	};

	$.fn.filterbox = function (option, args) {
		return this.each(function () {
			var $this = $(this);
			var data = $this.data('filterbox');
			var options = typeof option === 'object' && option;
			if (!data) {
				$this.data('filterbox', (data = new Filterbox(this, options)));
			}
			if (typeof option === 'string') {
				data[option](args);
			}
		});
	};

	$.fn.filterbox.Constructor = Filterbox;
	$.fn.filterbox.defaults = {
			time: false,
			minuteStep: 5
	};
}(window.jQuery);

/*
 * Fancy Form
 * */
;!function ($) {
	'use strict';

	var Fancyform = function (element, options) {
		this.init('fancyform', element, options);
	};
	
	var integerRegex = /^\-?[0-9]+$/,
		numericRegex = /^[0-9]+$/,
		emailRegex = /^[a-zA-Z0-9.!#$%&amp;'*+\-\/=?\^_`{|}~\-]+@[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*$/,
		urlRegex = /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;

	Fancyform.prototype = {
		constructor: Fancyform,
		
		init: function (type, element, options) {
			var that = this;
			that.type = type;
			that.$element = $(element);
			that.options = this.getOptions(options);
			that.failed = false;
			that._errors = [];
			
			that.$submit = that.$element.find('[data-toggle="submit"]');
			that.url = that.$element.attr('action');
			
			that._bindEvents();
		},
		_bindEvents: function() {
			var that = this;
			
			that.$submit.on('click', function(e) {
				e.preventDefault();
				
				that.submit();
			});
		},
		_unBindEvents: function() {
			var that = this;
			
			that.$submit.off('click');
		},
		getOptions: function (options) {
			options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options);

			return options;
		},
		submit: function() {
			var that = this;
			
			if (that.options.preload && typeof that.options.preload === 'function') {
				if (!that.options.preload.call(that)) {
					return false;
				}
			}
			
			if (that.validate()) {
				if (that.options.async) {
					$.ajax({
						url: url,
						type: 'POST',
						data: $('#'+that.formId).serialize(),
						beforeSend: function() {
							that.$element.spin();
						},
						error: function(data) {
							alert(data);
						},
						success: function(data) {
							if (that.options.callback && typeof that.options.callback === 'function') {
								that.options.callback.call(that, data);
							}
						},
						complete: function() {
							that.$element.spin(false);
						}
					});
				}
				else {
					that.$element.submit();
				}
			}
			else {
				that.parserErrors(that._errors);
			}
		},
		validate: function() {
        	var that = this;
        	
        	that.clearErrors(that._errors);
        	$.each(that.$element.find('[type="text"]'), function(i, v) {
        		var name = $(v).attr('name');
        		if (typeof name === 'undefined' || $.trim(name).length === 0) {
        			return false;
        		}
        		
        		if (typeof $(v).data('required') !== 'undefined') {
        			if (!that.validateRequired($(v))) {
        				that.failed = true;
        				that._errors.push(that.getField($(v), 'required'));
        			}
        		}
        		
        		if (typeof $(v).data('rules') !== 'undefined' && $.trim($(v).data('rules')).length > 0) {
        			var rules = $(v).data('rules').split('|');
        			var value = $(v).val();
        			$.each(rules, function(i, rule) {
        				if (!that.validateRules(rule, value)) {
        					that.failed = true;
            				that._errors.push(that.getField($(v), rule));
        				}
        			});
        		}
        		
        		if (typeof $(v).data('condition') !== 'undefined' && $.trim($(v).data('condition')).length > 0) {
        			var condition = $(v).data('condition');
        			var expect = $(v).data(condition);
        			
        			if (!that.validateCondition($(v), condition, expect)) {
        				that.failed = true;
        				that._errors.push(that.getField($(v), condition, expect));
        			}
        		}
        		
        		if (typeof $(v).data('type') !== 'undefined') {
        			if ($(v).data('type') === 'datetime' && typeof $(v).data('dependent') !== 'undefined') {
        				var dependent = $(v).data('dependent');
        				var endDate = new Date($(v).val());
        				var dependentDate = null;
        				
        				if (that.$element.find('[name="'+dependent+'"]').length > 0) {
        					dependentDate = new Date(that.$element.find('[name="'+dependent+'"]').val());
        					
        					if (endDate < dependentDate) {
        						that.failed = true;
        						var label = $(v).data('label') ? $(v).data('label') : $(v).attr('name');
        						that._errors.push({'helper': '字段 '+label+' 的时间不能小于 '+dependent});
        					}
        				}
        			}
        		}
        	});
        	
        	if (that.failed) {
        		return false;
        	}
        	else {
        		return true;
        	}
        },
        validateRequired: function(obj) {
        	var value = obj.val();
        	
        	if ($.trim(value).length === 0) {
        		return false;
        	}
        	else {
        		return true;
        	}
        },
        validateRules: function(rule, val) {
        	var parts = null;
        	
        	switch (rule) {
	        	case 'numeric':
	        		parts = numericRegex.exec(val);
	        		break;
	        	case 'email':
	        		parts = emailRegex.exec(val);
	        		break;
	        	case 'url':
	        		parts = urlRegex.exec(val);
	        		break;
	        	case 'int':
	        		parts = integerRegex.exec(val);
	        		break;
        	};
        	
        	if (parts) {
        		return true;
        	}
        	else {
        		return false;
        	}
        },
        validateCondition: function(obj, condition, expect) {
        	var actual = obj.val();
        	var result = null;
        	
        	switch (condition) {
	        	case 'min':
	        		result = (actual.length >= parseInt(expect, 10));
	        		break;
	        	case 'max':
	        		result = (actual.length <= parseInt(expect, 10));
	        		break;
	        	case 'greater':
	        		if (!numericRegex.test(actual)) {
	        			result = false;
	        		}
	        		else {
	        			result = (parseFloat(actual) > parseFloat(expect));
	        		}
	        		break;
	        	case 'exact':
	        		result = (actual.length === parseInt(expect, 10));
	        		break;
	        	case 'less':
	        		if (!numericRegex.test(actual)) {
	        			result = false;
	        		}
	        		else {
	        			result = (parseFloat(actual) < parseFloat(expect));
	        		}
	        		break;
	        	case 'greater_and_less':
	        		if (!numericRegex.test(actual)) {
	        			result = false;
	        		}
	        		else {
	        			result = (parseFloat(actual) > parseFloat(expect.split(',')[0]) && parseFloat(actual) < parseFloat(expect.split(',')[1]));
	        		}
	        		break;
	    	};
	    	
	    	return result;
        },
        getField: function(obj, type, expect) {
        	var that = this;
        	var label = obj.data('label') ? obj.data('label') : obj.attr('name');
        	var helper = null;
        	if (obj.data('helper')) {
        		helper = obj.data('helper');
        	}
        	else {
        		if (that.options.messages[type].match(/%s/g).length === 1) {
        			helper = that.options.messages[type].replace('%s', label);
        		}
        		else if (that.options.messages[type].match(/%s/g).length === 2) {
        			helper = that.options.messages[type].replace('%s', label).replace('%s', expect);
        		}
        		else if (that.options.messages[type].match(/%s/g).length === 3) {
        			helper = that.options.messages[type].replace('%s', label).replace('%s', expect.split(',')[0]).replace('%s', expect.split(',')[1]);
        		}
        		
        	}
        	return {'helper': helper, 'field': obj};
        },
        clearErrors: function(errors) {
        	var that = this;
        	
        	$.each(errors, function(i, v) {
        		v.field.removeClass('error');
        		v.field.tooltip('destroy');
        	});
        	
        	that.failed = false;
			that._errors = [];
        },
        parserErrors: function(errors) {
        	$.each(errors, function(i, v) {
        		v.field.addClass('error');
        		v.field.tooltip({
        			title: v.helper
        		});
        	});
        }
	};

	$.fn.fancyform = function (option, args) {
		return this.each(function () {
			var $this = $(this);
			var data = $this.data('fancyform');
			var options = typeof option === 'object' && option;
			if (!data) {
				$this.data('fancyform', (data = new Fancyform(this, options)));
			}
			if (typeof option === 'string') {
				data[option](args);
			}
		});
	};

	$.fn.fancyform.Constructor = Fancyform;
	$.fn.fancyform.defaults = {
		async: false,
		preload: null,
		callback: null,
		messages: {
			required: '字段 %s 是必填项.',
			email: '字段 %s 必须包含一个合法的Email地址.',
			min: '字段 %s 最少包含 %s 个字符.',
			max: '字段 %s 最大只能有 %s 个字符.',
			exact: '字段 %s 必须是 %s 个字符.',
            greater: '字段 %s 的数字必须大于 %s.',
            less: '字段 %s 的数字必须小于 %s.',
            numeric: '字段 %s 必须只能包含数字.',
            url: '字段 %s 必须包含一个合法的URL地址.',
            int: '字段 %s 必须只能包含整型数字.',
            greater_and_less: '字段 %s 必须大于 %s 并且小于 %s.'
        }
	};
}(window.jQuery);

/*
 * Pagination
 * */
;!function ($) {
	'use strict';

	var Pagination = function (element, options) {
		this.init('pagination', element, options);
	};

	Pagination.prototype = {
		constructor: Pagination,
		
		init: function (type, element, options) {
			var that = this;
			that.type = type;
			that.$element = $(element);
			that.options = this.getOptions(options);
			
			that.$currentPage = that.$element.find('.current');
			that.$totalPage = that.$element.find('.total');
			that.$preBtn = that.$element.find('.icon-thin-left').parent();
			that.$nextBtn = that.$element.find('.icon-thin-right').parent();
			that.$gotoBtn = that.$element.find('.goto');
			that.$numField = that.$element.find('.num');
			
			that._setCurrentNum(that._getCurrentNum());
			that._setTotalNum(that._getTotalNum());
			
			that._bindEvents();
		},
		restore: function(data) {
			var that = this;
			
			that._setCurrentNum(data.current);
			that._setTotalNum(data.total);
			that._setFieldNum('');
			that._restoreBtnStatus(data.current, data.total);
		},
		_getCurrentNum: function() {
			var that = this;
			
			return parseInt(that.$currentPage.text());
		},
		_setCurrentNum: function(num) {
			var that = this;
			
			that.$currentPage.text(num);
			that.$element.data('current', num);
		},
		_getTotalNum: function() {
			var that = this;
			
			return parseInt(that.$totalPage.text());
		},
		_setTotalNum: function(num) {
			var that = this;
			
			that.$totalPage.text(num);
			that.$element.data('total', num);
		},
		_getFieldNum: function() {
			var that = this;
			
			var num = parseInt($.trim(that.$numField.val())),
				numericRegex = /^[0-9]+$/,
				totalNum = that._getTotalNum();
		
			if (numericRegex.test(num)) {
				if (num > totalNum) {
					that._setFieldNum(totalNum);
					return totalNum;
				}
				else if (num <= 0) {
					that._setFieldNum(1);
					return 1;
				}
				return num;
			}
			else {
				that._setFieldNum(1);
				return 1;
			}
		},
		_setFieldNum: function(num) {
			var that = this;
			
			that.$numField.val(num);
		},
		_restoreBtnStatus: function(current, total) {
			var that = this;

			if (current <= 1) {
				that.$preBtn.addClass('disabled');
			}
			else {
				that.$preBtn.removeClass('disabled');
			}
			
			if (current >= total) {
				that.$nextBtn.addClass('disabled');
			}
			else {
				that.$nextBtn.removeClass('disabled');
			}
		},
		_bindEvents: function() {
			var that = this;
			
			that.$preBtn.on('click', function(e) {
				e.preventDefault();
				var me = $(this);
				
				var current = that._getCurrentNum(),
					total = that._getTotalNum();
				
				that._restoreBtnStatus(current, total);
				
				if (me.hasClass('disabled')) {
					return false;
				}
				
				current -= 1;
				that._setCurrentNum(current);
				that.submit(current);
			});
			that.$nextBtn.on('click', function(e) {
				e.preventDefault();
				var me = $(this);
				
				var current = that._getCurrentNum(),
					total = that._getTotalNum();
				
				that._restoreBtnStatus(current, total);
				
				if (me.hasClass('disabled')) {
					return false;
				}
				
				current += 1;
				that._setCurrentNum(current);
				that.submit(current);
			});
			that.$gotoBtn.on('click', function(e) {
				e.preventDefault();
				
				var num = that._getFieldNum();
				that._setCurrentNum(num);
				that.submit(num);
			});
		},
		_unBindEvents: function() {
			var that = this;
			
			that.$preBtn.off('click');
			that.$nextBtn.off('click');
			that.$gotoBtn.off('click');
		},
		getOptions: function (options) {
			options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options);

			return options;
		},
		submit: function(num) {
			var that = this;
			var data = {};
			
			if (that.options.url) {
				if (that.options.getData && typeof that.options.getData === 'function') {
					data = that.options.getData.call(that);
				}
				$.ajax({
					url: that.options.url,
					type: 'POST',
					data: {'data': JSON.stringify(data), 'pageNum': num},
					beforeSend: function() {
						that.$element.spin();
					},
					error: function(jqXHR) {
						alert(jqXHR.statusText);
					},
					success: function(data) {
						if (that.options.success && typeof that.options.success === 'function') {
							that.options.success.call(that, data);
						}
						that._restoreBtnStatus(that._getCurrentNum(), that._getTotalNum());
					},
					complete: function() {
						that.$element.spin(false);
					}
				});
			}
			else if (that.options.submit && typeof that.options.submit === 'function') {
				that._restoreBtnStatus(that._getCurrentNum(), that._getTotalNum());
				that.options.submit.call(that, that._getCurrentNum());
			}
		}
	};

	$.fn.pagination = function (option, args) {
		return this.each(function () {
			var $this = $(this);
			var data = $this.data('pagination');
			var options = typeof option === 'object' && option;
			if (!data) {
				$this.data('pagination', (data = new Pagination(this, options)));
			}
			if (typeof option === 'string') {
				data[option](args);
			}
		});
	};

	$.fn.pagination.Constructor = Pagination;
	$.fn.pagination.defaults = {
		url: null	
	};
}(window.jQuery);

/*
 * Simple Tab
 * */
;!function ($) {
	'use strict';

	var  SimpleTab= function (element, options) {
		this.init('simpletab', element, options);
	};

	SimpleTab.prototype = {
		constructor: SimpleTab,
		
		init: function (type, element, options) {
			var that = this;
			that.type = type;
			that.$element = $(element);
			that.options = this.getOptions(options);
			
			that.$tabs = that.$element.find('a[data-toggle="tab"]');
			that.$tabContent = that.$element.next('.tab-content');
			
			that._bindEvents();
		},
		_bindEvents: function() {
			var that = this;
			
			if (!that.options.refresh) {
				that.$tabs.on('click', function(e) {
					e.stopPropagation();
					e.preventDefault();
					
					var me = $(this);
					that.active(me);
				});
			}
		},
		_unBindEvents: function() {
			var that = this;
			
			that.$tabs.off('click');
		},
		active: function(tab) {
			var that = this;
			
			var selector = tab.attr('href'),
	        	selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''),
	        	$target = $(selector);
			
			that._activate(tab.parent('li'), that.$element);
			that._activate($target, that.$tabContent);
		},
		_activate: function(element, container) {
			var that = this;
			
			var $active = container.find('> .active');
			
			$active.removeClass('active');
			element.addClass('active');
			
			if (that.options.callback && typeof that.options.callback) {
				that.options.callback.call(element);
			}
		},
		show: function(index) {
			var that = this;
			
			that.active($(that.$tabs.get(index)));
		},
		getOptions: function (options) {
			options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options);

			return options;
		}
	};

	$.fn.simpletab = function (option, args) {
		return this.each(function () {
			var $this = $(this);
			var data = $this.data('simpletab');
			var options = typeof option === 'object' && option;
			if (!data) {
				$this.data('simpletab', (data = new SimpleTab(this, options)));
			}
			if (typeof option === 'string') {
				data[option](args);
			}
		});
	};

	$.fn.simpletab.Constructor = SimpleTab;
	$.fn.simpletab.defaults = {
		refresh: false,
		callback: null
	};
}(window.jQuery);
