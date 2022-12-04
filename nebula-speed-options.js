// ==UserScript==
// @name         Nebula Expanded Speed Options
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a slider to increase range of speed options
// @author       _glook
// @match        https://nebula.tv/videos/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @noframes
// @run-at      document-start
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';

    function getChannelName() {
        return $("meta[name='author']").attr('content');
    }
    function getChannelSpeedKey(channelName) {
        return "Nebula Expanded Speed Options " + channelName;
    }
    function getChannelSpeed(channelName) {
        return parseFloat(window.localStorage.getItem(getChannelSpeedKey(channelName))) || 1;
    }
    function saveChannelSpeed() {
        var channelName = getChannelName();
        if (!channelName) return;
        var speed = $('#videoSpeedInput').val();
        window.localStorage.setItem(getChannelSpeedKey(channelName), speed);
        alert("Saved speed " + speed + " to channel '" + channelName + "'");
    }

    function addSlider() {
        var currentPlaybackRate = parseFloat(document.getElementsByTagName('video')[0].playbackRate);
        var $container = $('<div id="nebulaExpandedSpeedOptions"></div>');
        var $button = $('<button style="margin-right:5px;">💾</button>');
        $button.click(saveChannelSpeed);
        $container.append($button);
        var $span = $('<span id="videoSpeedDisplay" style="color:white;">' + currentPlaybackRate.toFixed(2) + '</span>');
        $container.append($span);
        var $slider = $('<input id="videoSpeedInput" type="range" min="1.00" max="5.00" step="0.25">');
        $slider.css('width', '200px');
        var sliderTicksCss = `linear-gradient(to right, #000,
#000 3.5%, #888 3.5%, #888 4.5%, #000 4.5%,
#000 10.5%, #888 10.5%, #888 11.5%, #000 11.5%,
#000 16.5%, #888 16.5%, #888 17.5%, #000 17.5%,
#000 23%, #FFF 23%, #FFF 25%, #000 25%,
#000 29.5%, #888 29.5%, #888 30.5%, #000 30.5%,
#000 36.5%, #888 36.5%, #888 37.5%, #000 37.5%,
#000 43%, #888 43%, #888 44%, #000 44%,
#000 49%, #FFF 49%, #FFF 51%, #000 51%,
#000 56%, #888 56%, #888 57%, #000 57%,
#000 62%, #888 62%, #888 63%, #000 63%,
#000 69%, #888 69%, #888 70%, #000 70%,
#000 75%, #FFF 75%, #FFF 77%, #000 77%,
#000 82%, #888 82%, #888 83%, #000 83%,
#000 88%, #888 88%, #888 89%, #000 89%,
#000 95%, #888 95%, #888 96%, #000 96%,
#000 100%)`;
        $slider.css('background', sliderTicksCss);
        $slider.val(currentPlaybackRate);
        $slider.on('input', function() {
            document.getElementsByTagName('video')[0].playbackRate = $slider.val();
            $span.text(parseFloat($slider.val()).toFixed(2));
        });
        $container.append($slider);
        console.log($container);
        $('main > section > div > h1').append($container);
    }

    var currentChannel = null;

    var checkIfSpeedSliderExists = setInterval(function() {
        if ($("video").length && $('main').length) {
            addSlider();
            clearInterval(checkIfSpeedSliderExists);
            currentChannel = "fake channel name";
        }
    }, 1000);

    var checkChannelName = setInterval(function() {
        if (!currentChannel) return;

        var channelName = getChannelName();
        if (!channelName) return;

        var playbackRate = document.getElementsByTagName('video')[0].playbackRate;
        var sliderRate = $('#videoSpeedInput').val();
        if (channelName == currentChannel && sliderRate == playbackRate) return;

        currentChannel = channelName;

        var desiredSpeed = getChannelSpeed(channelName);
        if (!desiredSpeed) return;

        document.getElementsByTagName('video')[0].playbackRate = desiredSpeed;
        $('#videoSpeedDisplay').text(desiredSpeed.toFixed(2));
        $('#videoSpeedInput').val(desiredSpeed);
    }, 1000);
})();
