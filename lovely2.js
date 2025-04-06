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
        if (matchLinks.length > 0) {
            matchLinks.forEach((matchLink, index) => {
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
        } else {
            // If no match links found in standard structure, handle direct content
            // This catches edge cases like the UFC event
            const directMatches = contentDiv.querySelectorAll('.live-match');
            
            directMatches.forEach(matchElement => {
                // Add the original match element
                container.appendChild(matchElement.closest('a') || matchElement);
                
                // Add the static HTML block after each match
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
                        
                        // Set a timeout to make content reappear after 3 more hours
                        const reappearDelay = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
                        setTimeout(() => {
                            // Show the content again
                            if (contentElement) {
                                contentElement.style.display = "block";
                                // Remove expired class
                                if (parentLeagueTitle) {
                                    parentLeagueTitle.classList.remove('expired-content');
                                }
                                // Remove from localStorage to reset the cycle
                                localStorage.removeItem(`expireContent_${contentId}`);
                            }
                        }, reappearDelay);
                    }
                }, hideDelay);
                
                // Clear the countdown interval
                clearInterval(countdownInterval);
                
                // Store the expiration and reappearance times in localStorage
                const expirationTime = now + hideDelay;
                const reappearTime = expirationTime + (3 * 60 * 60 * 1000); // Add 3 hours to expiration
                localStorage.setItem(`expireContent_${contentId}`, JSON.stringify({
                    expireAt: expirationTime,
                    reappearAt: reappearTime
                }));
            }
        }, 1000);
        
        // Check content state on page load (if page was refreshed)
        const storedData = localStorage.getItem(`expireContent_${contentId}`);
        if (storedData) {
            try {
                const { expireAt, reappearAt } = JSON.parse(storedData);
                const now = new Date().getTime();
                const contentElement = document.getElementById(contentId);
                const parentLeagueTitle = document.querySelector(`.league-title[onclick*="${contentId}"]`);
                
                if (contentElement) {
                    // If we're in between expiration and reappearance time
                    if (now >= expireAt && now < reappearAt) {
                        contentElement.style.display = "none";
                        if (parentLeagueTitle) {
                            parentLeagueTitle.classList.add('expired-content');
                        }
                        
                        // Set timeout for when to reappear
                        const timeUntilReappear = reappearAt - now;
                        if (timeUntilReappear > 0) {
                            setTimeout(() => {
                                contentElement.style.display = "block";
                                if (parentLeagueTitle) {
                                    parentLeagueTitle.classList.remove('expired-content');
                                }
                                localStorage.removeItem(`expireContent_${contentId}`);
                            }, timeUntilReappear);
                        }
                    } 
                    // If past reappearance time, make sure it's visible and clear the data
                    else if (now >= reappearAt) {
                        contentElement.style.display = "block";
                        if (parentLeagueTitle) {
                            parentLeagueTitle.classList.remove('expired-content');
                        }
                        localStorage.removeItem(`expireContent_${contentId}`);
                    }
                }
            } catch (e) {
                console.error("Error parsing stored content data:", e);
                localStorage.removeItem(`expireContent_${contentId}`);
            }
        }
    });
    
    // Add a function to check all contents on page load
    checkExpiredContent();
}

// Function to check and handle expired content on page load
function checkExpiredContent() {
    // Get all keys from localStorage that start with 'expireContent_'
    const keys = Object.keys(localStorage).filter(key => key.startsWith('expireContent_'));
    const now = new Date().getTime();
    
    keys.forEach(key => {
        const contentId = key.replace('expireContent_', '');
        const contentElement = document.getElementById(contentId);
        const parentLeagueTitle = document.querySelector(`.league-title[onclick*="${contentId}"]`);
        
        try {
            const storedData = localStorage.getItem(key);
            // Handle both old format (just expiration time) and new format (object with expireAt and reappearAt)
            if (storedData.startsWith('{')) {
                // New format
                const { expireAt, reappearAt } = JSON.parse(storedData);
                
                if (contentElement) {
                    // If between expiration and reappearance
                    if (now >= expireAt && now < reappearAt) {
                        contentElement.style.display = "none";
                        if (parentLeagueTitle) {
                            parentLeagueTitle.classList.add('expired-content');
                        }
                        
                        // Set timeout for reappearance
                        const timeUntilReappear = reappearAt - now;
                        if (timeUntilReappear > 0) {
                            setTimeout(() => {
                                contentElement.style.display = "block";
                                if (parentLeagueTitle) {
                                    parentLeagueTitle.classList.remove('expired-content');
                                }
                                localStorage.removeItem(key);
                            }, timeUntilReappear);
                        }
                    } 
                    // If past reappearance time
                    else if (now >= reappearAt) {
                        contentElement.style.display = "block";
                        if (parentLeagueTitle) {
                            parentLeagueTitle.classList.remove('expired-content');
                        }
                        localStorage.removeItem(key);
                    }
                }
            } else {
                // Old format - just expiration time with no reappearance
                const expirationTime = parseInt(storedData);
                
                // Convert old format to new format with reappear time (3 hours after expiration)
                const reappearTime = expirationTime + (3 * 60 * 60 * 1000);
                
                if (contentElement) {
                    if (now >= expirationTime && now < reappearTime) {
                        contentElement.style.display = "none";
                        if (parentLeagueTitle) {
                            parentLeagueTitle.classList.add('expired-content');
                        }
                        
                        // Update to new format
                        localStorage.setItem(key, JSON.stringify({
                            expireAt: expirationTime,
                            reappearAt: reappearTime
                        }));
                        
                        // Set timeout for reappearance
                        const timeUntilReappear = reappearTime - now;
                        if (timeUntilReappear > 0) {
                            setTimeout(() => {
                                contentElement.style.display = "block";
                                if (parentLeagueTitle) {
                                    parentLeagueTitle.classList.remove('expired-content');
                                }
                                localStorage.removeItem(key);
                            }, timeUntilReappear);
                        }
                    } else if (now >= reappearTime) {
                        contentElement.style.display = "block";
                        if (parentLeagueTitle) {
                            parentLeagueTitle.classList.remove('expired-content');
                        }
                        localStorage.removeItem(key);
                    }
                }
            }
        } catch (e) {
            console.error("Error processing stored data for content:", contentId, e);
            localStorage.removeItem(key);
        }
    });
}
