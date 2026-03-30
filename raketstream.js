// ============================================================
// DECODED JavaScript from raketstream.blogspot.com
// Source: Uploaded HTML page
// Obfuscation layers removed:
//   1. String array + base64 lookup (_0x2799 / _0x4b68 pattern)
//   2. Hex escape sequences (\x..)
//   3. URL percent-encoding (%XX)
//   4. ROT+1 character shift on hex digits
//   5. ROT+1 character shift on plaintext
// ============================================================

// ---- Encoding legend (applied in reverse) ------------------
//  '  →  (     (  →  )     z  →  {     |  →  }
//  <  →  =     =<  →  >=    <<<  →  ===   <<  →  !==
//  +  →  ,     &  →  '     :  →  ;     !  →  "
//  _  →  `     9  →  :     ;script=  →  <script>

// ============================================================
// SCRIPT 1 — Section switcher + channel button tabs
// ============================================================

<script>
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    document.querySelectorAll('.channel-button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`.channel-button[onclick="showSection('${sectionId}')"]`).classList.add('active');
}
</script>

// ============================================================
// SCRIPT 2 — Video player + countdown timer + event sorter
// ============================================================

<script>
function changeVideo(url) {
    document.querySelector('iframe').src = url;
}

function updateCountdown(targetDate, timeElement, container) {
    var countdown = setInterval(function () {
        var now = new Date().getTime();
        if (now >= targetDate.getTime() + 9000000) {   // past end
            clearInterval(countdown);
            timeElement.innerHTML = "LIVE END";
            moveContainerToLast(container);
            sortEvents();
        } else if (now >= targetDate.getTime()) {       // currently live
            clearInterval(countdown);
            timeElement.innerHTML = "LIVE NOW";
            setTimeout(function () {
                timeElement.innerHTML = "LIVE END";
                moveContainerToLast(container);
                sortEvents();
            }, 9000000 - (now - targetDate.getTime())); // 2 hours 30 minutes
        } else {                                        // upcoming
            var distance = targetDate - now;
            var days    = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            timeElement.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s";
        }
    }, 1000);
}

function moveContainerToLast(container) {
    const eventsContainer = document.getElementById('eventsContainer');
    eventsContainer.removeChild(container);
    eventsContainer.appendChild(container);
}

function sortEvents() {
    const eventsContainer  = document.getElementById('eventsContainer');
    const eventContainers  = Array.from(eventsContainer.querySelectorAll('.event'));

    const liveEndEvents = eventContainers.filter(container =>
        container.querySelector('.jam1').innerHTML === 'LIVE END'
    );
    const liveEvents = eventContainers.filter(container =>
        container.querySelector('.jam1').innerHTML !== 'LIVE END'
    );

    liveEvents.sort((a, b) => {
        const dateA = new Date(
            a.querySelector('.date1').getAttribute('data-target-date') + 'T' +
            a.querySelector('.jam1').getAttribute('data-target-time') + ':00+07:00'
        );
        const dateB = new Date(
            b.querySelector('.date1').getAttribute('data-target-date') + 'T' +
            b.querySelector('.jam1').getAttribute('data-target-time') + ':00+07:00'
        );
        return dateA - dateB;
    });

    eventsContainer.innerHTML = '';
    liveEvents.forEach(container    => eventsContainer.appendChild(container));
    liveEndEvents.forEach(container => eventsContainer.appendChild(container));
}

function initCountdownAndSortEvents() {
    const containers = document.querySelectorAll('.event');
    containers.forEach(container => {
        const targetTime = container.querySelector('.jam1').getAttribute('data-target-time');
        if (targetTime === 'LIVE') {
            container.querySelector('.jam1').innerHTML = "LIVE NOW";
        } else {
            const targetDate = new Date(
                container.querySelector('.date1').getAttribute('data-target-date') + 'T' +
                targetTime + ':00+07:00'
            );
            const currentTime = new Date().getTime();
            if (currentTime >= targetDate.getTime() + 9000000) {
                container.querySelector('.jam1').innerHTML = "LIVE END";
            } else if (currentTime >= targetDate.getTime()) {
                container.querySelector('.jam1').innerHTML = "LIVE NOW";
                setTimeout(function () {
                    container.querySelector('.jam1').innerHTML = "LIVE END";
                    moveContainerToLast(container);
                    sortEvents();
                }, 9000000 - (currentTime - targetDate.getTime()));
            } else {
                updateCountdown(targetDate, container.querySelector('.jam1'), container);
            }
        }
    });
    sortEvents();
}

document.addEventListener('DOMContentLoaded', initCountdownAndSortEvents);
</script>

// ============================================================
// SCRIPT 3 — Dynamic video loader based on URL path
// ============================================================

<script>
function loadVideo() {
    // Get the current URL and remove any additional parameters (?m=1)
    var currentUrl = window.location.href.split('?')[0];

    // Get the last part of the URL path
    var channelPart = currentUrl.split('/').pop();

    // Debugging: log the current URL and channelPart
    console.log('Current URL:', currentUrl);
    console.log('Channel Part:', channelPart);

    // Check if channelPart is not empty
    if (channelPart) {
        // Construct the video URL based on the channel part
        var videoUrl = 'https://player.justavid.my.id/p/' + channelPart + '.html';

        // Debugging: log the constructed video URL
        console.log('Video URL:', videoUrl);

        // Load the video into the iframe
        var videoPlayer = document.getElementById('video-player');
        videoPlayer.src = videoUrl;
    } else {
        console.log('Channel part is empty.');
    }
}

// Call loadVideo when the window loads
window.onload = loadVideo;
</script>

// ============================================================
// SCRIPT 4 — Copy stream URL to clipboard
// ============================================================

<script>
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Url copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy url: ', err);
    });
}
</script>

// ============================================================
// KEY CONSTANTS extracted from the _0x2799 string array
// (the base64/lookup-obfuscated block)
// ============================================================
//
//  Live match data API endpoint:
//    https://idlive.falou.net/live/list
//
//  Stream player wrappers:
//    https://anym3u8player.com/tv/p.php?url=<encoded_stream>
//    https://kebutuhanpublik.github.io/play.html?url+<encoded_stream>
//
//  Stream URL construction (function _0x486b4f):
//    base = "https://anym3u8player.com/tv/p.php?url=" + encodeURIComponent(streamUrl)
//           + "&cover=" + encodeURIComponent(coverUrl || "cover")
//    encoded = btoa(base)
//    final   = "https://kebutuhanpublik.github.io/play.html?url+" + encoded
//
//  Status badges:
//    status_id 8 or 9  → <span class="badge live">LIVE</span>
//    "finished" match  → <span class="badge finished">Selesai</span>
//    no streamers      → <a class="disabled">Belum tersedia</a>   ("Not yet available")
//    empty streamer    → "Tidak ada streamer"                      ("No streamer")
//
//  Favicon / logo:
//    https://808.beritanasional.eu.org/favicon.ico
