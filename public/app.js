// public/app.js
const hymnList = document.getElementById('hymnList');
const hymnDetails = document.getElementById('hymnDetails');
const searchBar = document.getElementById('searchBar');

// Fetch all hymns from the backend
async function fetchHymns() {
    try {
        const response = await fetch('/hymns');
        const hymns = await response.json();
        displayHymns(hymns);
    } catch (error) {
        console.error('Error fetching hymns:', error);
    }
}

// Display hymns in the list
function displayHymns(hymns) {
    hymnList.innerHTML = '';
    hymns.forEach(hymn => {
        const li = document.createElement('li');
        li.textContent = hymn.title;
        li.addEventListener('click', () => displayHymnDetails(hymn.id));
        hymnList.appendChild(li);
    });
}

// Fetch and display hymn details by ID
async function displayHymnDetails(id) {
    try {
        const response = await fetch(`/hymns/${id}`);
        const hymn = await response.json();
        hymnDetails.innerHTML = `
            <h3>${hymn.title}</h3>
            <p><strong>Number:</strong> ${hymn.number}</p>
            <p><strong>Author:</strong> ${hymn.author}</p>
            <p><strong>Verses:</strong></p>
            ${hymn.verses.map(verse => `<p>${verse}</p>`).join('')}
            ${hymn.refrain ? `<p><strong>Refrain:</strong> ${hymn.refrain}</p>` : ''}
        `;
        hymnDetails.style.display = 'block';
    } catch (error) {
        console.error('Error fetching hymn details:', error);
    }
}

// Search hymns dynamically
searchBar.addEventListener('input', async (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const response = await fetch('/hymns');
    const hymns = await response.json();
    const filteredHymns = hymns.filter(hymn =>
        hymn.title.toLowerCase().includes(searchTerm)
    );
    displayHymns(filteredHymns);
});

// Initial fetch of hymns when page loads
fetchHymns();
