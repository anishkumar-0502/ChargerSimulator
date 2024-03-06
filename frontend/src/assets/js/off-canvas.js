/* eslint-disable strict */
/* eslint-disable no-unused-vars */
/* eslint-disable no-lone-blocks */
import jQuery from 'jquery';

(function($) {
  'use strict';
  $(function() {
    $('[data-toggle="offcanvas"]').on("click", function() {
      $('.sidebar-offcanvas').toggleClass('active')
    });
  });
})(jQuery);