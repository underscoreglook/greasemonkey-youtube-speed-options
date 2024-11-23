// This goes into the custom code section in enhancer for youtube to automatically save the speed per channel when it's changed and reapply when a video from that channel loads.
// I didn't bother with any of the other functionality because enhancer for youtube already includes decent support for speed changes (I prefer the slider but it's good enough).

function getChannelName() {
    var $channelName = document.querySelector("ytd-channel-name#channel-name #text-container #text a");
    if (!$channelName) return;
    return $channelName.innerText;
}

function getChannelSpeedKey(channelName) {
    return "Youtube Improved Speed Options " + channelName;
}
function getChannelSpeed(channelName) {
    return parseFloat(window.localStorage.getItem(getChannelSpeedKey(channelName))) || 1;
}
function saveChannelSpeed() {
    var speed = document.getElementsByTagName('video')[0].playbackRate;
    if (channelSpeed != speed) {
        window.localStorage.setItem(getChannelSpeedKey(currentChannel), speed);
        channelSpeed = speed;
     }
}
var currentChannel = null;
var channelSpeed = null;

var checkChannelName = setInterval(function() {
    if (currentChannel) {
        saveChannelSpeed();
        return;
    }

    var channelName = getChannelName();
    if (!channelName) return;

    var desiredSpeed = getChannelSpeed(channelName);
    if (!desiredSpeed) return;

    currentChannel = channelName;
    document.getElementsByTagName('video')[0].playbackRate = desiredSpeed;
    channelSpeed = desiredSpeed;
}, 1000);
