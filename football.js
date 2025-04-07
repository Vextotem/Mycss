// Data pertandingan disimpan dalam array
const schedules = [
  
  
  
  
     
   <!-- events -->
    {
        event: 'F1: Japanese GP',
        eventLogo: 'https://cdn.jsdelivr.net/gh/starballtv/img/f1.png',
        matchup: '	F1: Japanese GP',
        date: '2025-04-06',
        time: '01:00',
        team1Image: 'https://cdn.jsdelivr.net/gh/starballtv/img/f1.png',
        team2Image: 'https://cdn.jsdelivr.net/gh/starballtv/img/f1.png',
        buttons: [
            { text: 'Link', link: 'https://rakettim.blogspot.com/p/v22.html' },
        ]
    },
    <!-- events -->
    
    
    
    
    
    
     <!-- events -->
    {
        event: 'F1: Japanese GP',
        eventLogo: 'https://cdn.jsdelivr.net/gh/starballtv/img/f1.png',
        matchup: '	F1: Japanese GP',
        date: '2025-04-06',
        time: '01:00',
        team1Image: 'https://cdn.jsdelivr.net/gh/starballtv/img/f1.png',
        team2Image: 'https://cdn.jsdelivr.net/gh/starballtv/img/f1.png',
        buttons: [
            { text: 'Link', link: 'https://rakettim.blogspot.com/p/v22.html' },
        ]
    },
    <!-- events -->
    
    
     
  
     
     
      
   
    
    // Add more events here
];

// Fungsi untuk mengonversi waktu dan tanggal ke zona waktu lokal
function convertToLocalTime(wibTime, wibDate) {
    var dateWIB = new Date(wibDate + 'T' + wibTime + ':00+07:00');
    var localTime = new Date(dateWIB.toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }));
    
    var hours = localTime.getHours().toString().padStart(2, '0');
    var minutes = localTime.getMinutes().toString().padStart(2, '0');
    var formattedTime = hours + ':' + minutes;
    
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    var formattedDate = localTime.toLocaleDateString('id-ID', options);

    return {
        time: formattedTime,
        date: formattedDate
    };
}

// Fungsi untuk menampilkan jadwal pertandingan
function displaySchedules() {
    const container = document.getElementById('match-schedule');

    schedules.forEach(schedule => {
        const localDateTime = convertToLocalTime(schedule.time, schedule.date);

        // Create the anchor element to wrap the entire matchContainer
        const matchLink = document.createElement('a');
        matchLink.href = schedule.buttons[0].link;
        matchLink.className = 'match-link';

        // Create matchContainer element
        const matchContainer = document.createElement('div');
        matchContainer.className = 'match-container';

        // Add click event to toggle active class
        matchContainer.addEventListener('click', function() {
            document.querySelectorAll('.match-container').forEach(container => container.classList.remove('active'));
            this.classList.add('active');
        });

        // Create event header with logo
        const eventHeader = document.createElement('div');
        eventHeader.className = 'event-header';
        
        // Add event logo
        const eventLogo = document.createElement('img');
        eventLogo.className = 'event-logo';
        eventLogo.src = schedule.eventLogo;
        eventLogo.alt = 'Event logo';
        eventLogo.width = 30;
        eventHeader.appendChild(eventLogo);
        
        // Add event name
        const eventName = document.createElement('span');
        eventName.innerText = schedule.event;
        eventHeader.appendChild(eventName);
        
        matchContainer.appendChild(eventHeader);

        // Create team images
        const teamImages = document.createElement('div');
        teamImages.className = 'team-images';

        const imgTeam1 = document.createElement('img');
        imgTeam1.src = schedule.team1Image;
        imgTeam1.alt = 'Team 1 image';
        imgTeam1.width = 40;
        teamImages.appendChild(imgTeam1);

        const imgTeam2 = document.createElement('img');
        imgTeam2.src = schedule.team2Image;
        imgTeam2.alt = 'Team 2 image';
        imgTeam2.width = 40;
        teamImages.appendChild(imgTeam2);

        matchContainer.appendChild(teamImages);

        // Create matchup element
        const matchup = document.createElement('div');
        matchup.className = 'matchup';
        matchup.innerText = schedule.matchup;
        matchContainer.appendChild(matchup);

        // Create details element
        const details = document.createElement('div');
        details.className = 'details';

        const dateDiv = document.createElement('div');
        dateDiv.className = 'date';
        dateDiv.innerText = localDateTime.date;
        details.appendChild(dateDiv);

        const timeDiv = document.createElement('div');
        timeDiv.className = 'time';
        timeDiv.innerText = localDateTime.time + ' (24 HOURS)';
        details.appendChild(timeDiv);

        matchContainer.appendChild(details);

        // Determine match status
        const now = new Date();
        const eventDateTime = new Date(schedule.date + 'T' + schedule.time + ':00+07:00');

        if (eventDateTime < now) {
            const expiredDiv = document.createElement('div');
            expiredDiv.className = 'status Online';
            expiredDiv.innerText = 'Live Now';
            matchContainer.appendChild(expiredDiv);
        } else if (eventDateTime > now && (eventDateTime - now) <= (60 * 60 * 1000)) {
            const liveIcon = document.createElement('div');
            liveIcon.className = 'live-icon';
            liveIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12"/></svg> Upcoming`;
            matchContainer.appendChild(liveIcon);
        } else {
            const countdownDiv = document.createElement('div');
            countdownDiv.className = 'countdown';
            const hoursLeft = Math.floor((eventDateTime - now) / (1000 * 60 * 60));
            const minutesLeft = Math.floor(((eventDateTime - now) % (1000 * 60 * 60)) / (1000 * 60));
            countdownDiv.innerText = `Upcoming in ${hoursLeft}h ${minutesLeft}m`;
            matchContainer.appendChild(countdownDiv);
        }

        // Append matchContainer to the matchLink
        matchLink.appendChild(matchContainer);
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
}

// Display schedules
