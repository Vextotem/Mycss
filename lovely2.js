// Script to display match schedules with separators
document.addEventListener('DOMContentLoaded', function() {
    // Get all league sections
    const leagueSections = document.querySelectorAll('.league-title');
    
    leagueSections.forEach(leagueSection => {
        // Get the content div that follows this league title
        const contentId = leagueSection.getAttribute('onclick').match(/toggleContent\('([^']+)'\)/)[1];
        const contentDiv = document.getElementById(contentId);
        
        if (!contentDiv) return;
        
        // Get all match links in this section
        const matchLinks = contentDiv.querySelectorAll('a[id^="link"]');
        
        // Create a container for this league's matches
        const container = document.createElement('div');
        container.className = 'league-matches-container';
        
        // Process each match link
        matchLinks.forEach(matchLink => {
            // Get the match container (the div with class "live-match")
            const matchContainer = matchLink.querySelector('.live-match');
            
            if (!matchContainer) return;
            
            // Clone the match container to avoid removing it from original structure
            const clonedMatchContainer = matchContainer.cloneNode(true);
            
            // Clear the matchLink content
            matchLink.innerHTML = '';
            
            // Append matchContainer to the matchLink
            matchLink.appendChild(clonedMatchContainer);
            container.appendChild(matchLink);
            
            // Add the static HTML block after each schedule
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

// Initialize countdown timers
function initCountdowns() {
    const countdownElements = document.querySelectorAll('.countdown');
    
    countdownElements.forEach(element => {
        const targetDate = new Date(element.getAttribute('data-target-date'));
        const contentId = element.getAttribute('data-content-id') || 
                          element.closest('.live-match')?.closest('[id]')?.id;
        
        if (!contentId) return;
        
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
                element.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            } else {
                // Countdown reached zero, show "LIVE"
                element.innerHTML = "LIVE";
                
                // Set a timeout to hide content after 5 hours (300 minutes)
                const hideDelay = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
                
                setTimeout(() => {
                    // Find and hide the content
                    const contentElement = document.getElementById(contentId);
                    if (contentElement) {
                        contentElement.style.display = "none";
                        // Also update the parent element if needed
                        const parentLeagueTitle = document.querySelector(`.league-title[onclick*="${contentId}"]`);
                        if (parentLeagueTitle) {
                            parentLeagueTitle.classList.add('expired-content');
                        }
                    }
                }, hideDelay);
                
                // Clear the countdown interval
                clearInterval(countdownInterval);
                
                // Store the expiration time in localStorage to maintain state across page refreshes
                const expirationTime = now + hideDelay;
                localStorage.setItem(`expireContent_${contentId}`, expirationTime);
            }
        }, 1000);
        
        // Check if content should already be hidden (if page was refreshed)
        const storedExpirationTime = localStorage.getItem(`expireContent_${contentId}`);
        if (storedExpirationTime && parseInt(storedExpirationTime) < new Date().getTime()) {
            // If already expired, hide immediately
            const contentElement = document.getElementById(contentId);
            if (contentElement) {
                contentElement.style.display = "none";
                const parentLeagueTitle = document.querySelector(`.league-title[onclick*="${contentId}"]`);
                if (parentLeagueTitle) {
                    parentLeagueTitle.classList.add('expired-content');
                }
            }
        }
    });
    
    // Add a function to check all contents on page load
    checkExpiredContent();
}

// Function to check and hide expired content on page load
function checkExpiredContent() {
    // Get all keys from localStorage that start with 'expireContent_'
    const keys = Object.keys(localStorage).filter(key => key.startsWith('expireContent_'));
    
    keys.forEach(key => {
        const contentId = key.replace('expireContent_', '');
        const expirationTime = parseInt(localStorage.getItem(key));
        
        // If expiration time has passed, hide the content
        if (expirationTime < new Date().getTime()) {
            const contentElement = document.getElementById(contentId);
            if (contentElement) {
                contentElement.style.display = "none";
                
                // Also update any league titles that control this content
                const parentLeagueTitle = document.querySelector(`.league-title[onclick*="${contentId}"]`);
                if (parentLeagueTitle) {
                    parentLeagueTitle.classList.add('expired-content');
                }
            }
        }
    });
}
