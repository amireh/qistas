/**
 * @class jQuery
 *
 * Pibi.js jQuery extensions.
 */
define([
  'jquery',
  'rsvp',
  'ext/jquery/CORS',
  'ext/jquery/linked_list',
  'ext/jquery/dropdown',
], function($, RSVP) {
  'use strict';

  var $repainter = $('<div></div>');

  /**
   * @method  refreshClass
   *
   * Re-add a CSS class on an element over a neglibile interval of time to
   * force a "repaint". This is sometimes necessary to work around some visual
   * artifacts that appear in Webkit browsers.
   *
   * @param {String} klass
   * The CSS class to refresh.
   */
  $.fn.refreshClass = function(klass) {
    var $that = $(this);

    $that.removeClass(klass);

    setTimeout(function() {
      $that.addClass(klass);
    }, 1);
  };

  /**
   * @method  repaint
   *
   * Force a repaint of the viewport.
   *
   * This is sometimes necessary to work around some visual artifacts that appear
   * in Webkit browsers.
   */
  $.fn.repaint = function() {
    var $this = $(this);
    var deferred = RSVP.defer();

    $repainter.appendTo($this);
    $this.hide();

    setTimeout(function() {
      $repainter.detach();
      $this.show();
      $(window).scrollTop($(window).scrollTop());
      deferred.resolve($this);
    }, 1);

    return deferred.promise;
  };

  $.fn.disable = function() {
    return $(this).prop('disabled', true).addClass('disabled');
  };

  $.fn.enable = function() {
    return $(this).prop('disabled', false).removeClass('disabled');
  };

  $.fn.toggleEnabled = function(flag) {
    var $this = $(this);

    return ((flag === void 0) ? $this.is(':disabled') : flag) ?
      $this.enable() :
      $this.disable();
  };

  $.fn.animateClass = function(klass, duration) {
    var $this = $(this);
    var deferred = RSVP.defer();

    $this.stop(true, true).addClass(klass);

    setTimeout(function() {
      $this.stop(true, true).removeClass(klass);
      $this.repaint().then(function() {
        deferred.resolve($this);
      });
    }, duration);

    return deferred.promise;
  };

  return $;
});
