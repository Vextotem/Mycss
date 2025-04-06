// Script to display match schedules with separators - using live-match approach only
document.addEventListener('DOMContentLoaded', function() {
    // Get all league sections
    const leagueSections = document.querySelectorAll('.league-title');
    
    leagueSections.forEach(leagueSection => {
        // Get the content div that follows this league title
        const contentId = leagueSection.getAttribute('onclick').match(/toggleContent\('([^']+)'\)/)[1];
        const contentDiv = document.getElementById(contentId);
        
        if (!contentDiv) return;
        
        // Get all live-match elements in this section (direct approach)
        const liveMatches = contentDiv.querySelectorAll('.live-match');
        
        // Create a container for this league's matches
        const container = document.createElement('div');
        container.className = 'league-matches-container';
        
        // Process each live-match
        if (liveMatches.length > 0) {
            liveMatches.forEach(matchElement => {
                // Find the parent anchor or create a wrapper if none exists
                let matchLink = matchElement.closest('a');
                
                if (!matchLink) {
                    // If there's no parent anchor, wrap the match in one
                    matchLink = document.createElement('a');
                    matchLink.href = '#'; // Default href
                    matchLink.id = 'link-' + Math.random().toString(36).substr(2, 9); // Generate random ID
                    matchElement.parentNode.insertBefore(matchLink, matchElement);
                    matchLink.appendChild(matchElement);
                }
                
                // Add the match to our container
                container.appendChild(matchLink.cloneNode(true));
                
                // Add the separator after each match
                const staticHTML = `
                    <div class="separator" style="clear: both; margin-top: 0; text-align: center; width: 100%;">
                        <a href="https://sinni.my/yZeYg" style="display: block;">
                            <img alt="" style="width: 100%; height: auto;" src="https://cdn.jsdelivr.net/gh/Vextotem/Mycss@main/1000126223.gif" />
                        </a>
                    </div>
                `;
                
                // Create temporary container for the static HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = staticHTML;
                container.appendChild(tempDiv);
            });
        }
        
        // Replace the content of the original content div with our new container
        contentDiv.innerHTML = '';
        contentDiv.appendChild(container);
    });
    
    // Initialize countdown timers
    initCountdowns();
});

// Function to toggle content visibility
function toggleContent(id) {
    const content = document.getElementById(id);
    if (content) {
        if (content.style.display === "none") {
            content.style.display = "block";
        } else {
            content.style.display = "none";
        }
    }
}

// Initialize countdown timers - focusing on .live-match elements
function initCountdowns() {
    const liveMatches = document.querySelectorAll('.live-match');
    
    liveMatches.forEach(matchElement => {
        const countdownElement = matchElement.querySelector('.countdown');
        if (!countdownElement) return;
        
        const targetDate = new Date(countdownElement.getAttribute('data-target-date'));
        const matchId = matchElement.id || 
                       matchElement.closest('[id]')?.id || 
                       'match-' + Math.random().toString(36).substr(2, 9);
        
        // Ensure the match element has an ID for later reference
        if (!matchElement.id) matchElement.id = matchId;
        
        // Update the countdown every second
        const countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            // Time calculations
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Display the result
            if (distance > 0) {
                countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            } else {
                // Countdown reached zero, show "LIVE"
                countdownElement.innerHTML = "LIVE";
                
                // Set a timeout to hide the match after 5 hours (300 minutes)
                const hideDelay = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
                
                setTimeout(() => {
                    // Hide the match element directly
                    matchElement.style.display = "none";
                    
                    // Check if all matches in a section are hidden, and if so, hide the section
                    const parentContent = matchElement.closest('[id]');
                    if (parentContent) {
                        const visibleMatches = parentContent.querySelectorAll('.live-match:not([style*="display: none"])');
                        if (visibleMatches.length === 0) {
                            parentContent.style.display = "none";
                            // Also update the parent league title if needed
                            const parentLeagueTitle = document.querySelector(`.league-title[onclick*="${parentContent.id}"]`);
                            if (parentLeagueTitle) {
                                parentLeagueTitle.classList.add('expired-content');
                            }
                        }
                    }
                }, hideDelay);
                
                // Clear the countdown interval
                clearInterval(countdownInterval);
                
                // Store the expiration time in localStorage to maintain state across page refreshes
                const expirationTime = now + hideDelay;
                localStorage.setItem(`expireMatch_${matchId}`, expirationTime);
            }
        }, 1000);
        
        // Check if match should already be hidden (if page was refreshed)
        const storedExpirationTime = localStorage.getItem(`expireMatch_${matchId}`);
        if (storedExpirationTime && parseInt(storedExpirationTime) < new Date().getTime()) {
            // If already expired, hide immediately
            matchElement.style.display = "none";
        }
    });
    
    // Check for empty sections after hiding expired matches
    checkEmptySections();
}

// Function to check and hide empty sections
function checkEmptySections() {
    // Get all match expiration keys from localStorage
    const matchKeys = Object.keys(localStorage).filter(key => key.startsWith('expireMatch_'));
    
    // Process all content sections
    document.querySelectorAll('[id^="content"]').forEach(contentSection => {
        // Count visible matches in this section
        const matches = contentSection.querySelectorAll('.live-match');
        let visibleCount = 0;
        
        matches.forEach(match => {
            const matchId = match.id;
            if (!matchId) return;
            
            const expirationTime = localStorage.getItem(`expireMatch_${matchId}`);
            if (!expirationTime || parseInt(expirationTime) > new Date().getTime()) {
                visibleCount++;
            } else {
                match.style.display = "none";
            }
        });
        
        // If no visible matches, hide the section
        if (visibleCount === 0 && matches.length > 0) {
            contentSection.style.display = "none";
            
            // Also update the parent league title
            const parentLeagueTitle = document.querySelector(`.league-title[onclick*="${contentSection.id}"]`);
            if (parentLeagueTitle) {
                parentLeagueTitle.classList.add('expired-content');
            }
        }
    });
}
