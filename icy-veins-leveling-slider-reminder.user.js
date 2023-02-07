// ==UserScript==
// @name         Icy Veins Leveling Slider Reminder
// @description  Remembers the last selected level on the Icy Veins Leveling Guide sliders
// @namespace    https://github.com/DJScias
// @version      2.0.0
// @author       DJScias
// @match        https://www.icy-veins.com/wow/*-leveling-guide
// @grant        none
// @require http://code.jquery.com/jquery-3.5.1.min.js
// @require https://cdn.jsdelivr.net/npm/js-cookie@rc/dist/js.cookie.min.js
// @license GPLv3
// @homepageURL https://github.com/DJScias/Icy-Veins-Leveling-Slider-Reminder
// @supportURL https://github.com/DJScias/Icy-Veins-Leveling-Slider-Reminder/issues
// @run-at document-end
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements, Cookies */

(function() {
    'use strict';

    // Check all the sliders and apply saved values
    $('.leveling_slider_container input').each(function () {
        let id = $(this).parent().attr('id');
        let name = id.split("_")[0];
        let level = Cookies.get(id);


        if (Cookies.get(id) !== undefined) {
            $(this).val(level).trigger('change');

			// Update the website UI to reflect the level change
            $(this).next().find("span").text(level);
            let processName = name + '_process_levels';
            let processFnc = window[processName];
            processFnc(level);
        }

        $(this).parent().append('<a href="#" id="'+id+'_reset" class="slider_reset">Reset</a>');
    });

    $(document).on('input', '.leveling_slider_container > input', function() {
        let id = $(this).parent().attr('id');
        let level = $(this).val();

        // Save for a week, that should be fine
        Cookies.set(id, level, { expires: 7, path: '' });
    });

    // Reset button function
    $(document).on('click', '.slider_reset', function(e) {
        e.preventDefault();

        let id = $(this).parent().attr('id');
        let name = id.split("_")[0];
		let level = 60;
        let curid = $(this).parent().attr('id');

        $("#" + id + " > input").val(level).trigger('change');

		// Update the website UI to reflect the level change
        $(this).prev().find("span").text(level);
        let processName = name + '_process_levels';
        let processFnc = window[processName];
        processFnc(level);

        // Remove the cookie, we don't need it anymore
        Cookies.remove(id, { path: '' });
    });
})();
