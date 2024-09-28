// public/app.js

const listTogglers = document.querySelectorAll('.toggler');
const outerHymnList = document.querySelector('.outsided');
const backDrop = document.querySelector('.backdrop');

listTogglers.forEach(toggler => {
    toggler.addEventListener('click', () => {
        listTogglers.forEach(toggler => {
            toggler.classList.toggle('show');
        });
        outerHymnList.classList.toggle('show');
        backDrop.classList.toggle('show');
    });
});

backDrop.addEventListener('click', () => {
    listTogglers.forEach(toggler => {
        toggler.classList.toggle('show');
    });
    outerHymnList.classList.toggle('show');
    backDrop.classList.toggle('show');
});

const hymnLists = document.querySelectorAll('.hymn-list');

// Fetch all hymns from the backend
async function fetchHymns() {
    try {
        const response = await fetch('/hymns');
        const hymns = await response.json();
        console.log(hymns);
        displayHymns(hymns);
    } catch (error) {
        console.error('Error fetching hymns:', error);
    }
}
fetchHymns();

// Display hymns in the list
function displayHymns(hymns) {
    hymnLists.forEach(hymnList => hymnList.innerHTML = '');
    hymnLists.forEach(hymnList => {
        if (hymnList.classList.contains('outsided')) {
            hymns.forEach(hymn => {
                const li = document.createElement('li');
                li.classList.add('hymn','outers');
                const hymnNumber = document.createElement('span');
                hymnNumber.classList.add('hymn-number');
                hymnNumber.textContent = hymn.number;
                const hymnTitle = document.createElement('span');
                hymnTitle.classList.add('hymn-name');
                hymnTitle.textContent = hymn.title;
                li.appendChild(hymnNumber);
                li.appendChild(hymnTitle);
                hymnList.appendChild(li);
            });
        } else if (hymnList.classList.contains('insided')) {
            hymns.forEach(hymn => {
                const li = document.createElement('li');
                li.classList.add('hymn','insiders');
                const hymnNumber = document.createElement('span');
                hymnNumber.classList.add('hymn-number');
                hymnNumber.textContent = hymn.number;
                const hymnTitle = document.createElement('span');
                hymnTitle.classList.add('hymn-name');
                hymnTitle.textContent = hymn.title;
                li.appendChild(hymnNumber);
                li.appendChild(hymnTitle);
                hymnList.appendChild(li);
            }); 
        }
    });
    updateHymnView(hymns[0]);

    attachListeners(hymns);
}

// Update the Lyrics View
async function updateHymnView(object) {
    if (object) {
	const titleNumber = document.querySelector('.title-number');
        titleNumber.textContent = `${object.number}.`;
        const titleName = document.querySelector('.title-name');
        titleName.textContent = `${object.title}`;
        const titleAuthor = document.querySelector('.title-author');
        titleAuthor.textContent = `${object.author}`;
        const lyrics = document.querySelector('.lyrics');
        lyrics.innerHTML = '';
        object.verses.forEach(verse => {
            if ((object.verses.indexOf(verse)) === 1 && object.refrain) {
                const div = document.createElement('div');
                div.classList.add('refrain');
                const p = document.createElement('p');
                p.innerHTML = `<em>Gusubiramo:</em><br>${object.refrain}`;
                div.appendChild(p);
                lyrics.appendChild(div);
            }
            const span = document.createElement('span');
            span.classList.add('verse-number');
            span.textContent = `${object.verses.indexOf(verse) + 1}.`;
            const p = document.createElement('p');
            p.textContent = verse;
            const div = document.createElement('div');
            div.classList.add('verse');
            div.appendChild(span);
            div.appendChild(p);
            lyrics.appendChild(div);
        });
    }
}

// Selecting From List

function attachListeners(hymnsArr) {
    const hymns_O = document.querySelectorAll('.outers');
    const hymnArray_O = Array.from(hymns_O);

    hymnArray_O.forEach(hymn => {
        hymn.addEventListener('click', (event) => {
            updateHymnView(hymnsArr[hymnArray_O.indexOf(event.target.closest('.outers'))]);
	        listTogglers.forEach(toggler => {
                toggler.classList.toggle('show');
            });
            outerHymnList.classList.toggle('show');
            backDrop.classList.toggle('show');
	    });
    });

    const hymns_I = document.querySelectorAll('.insiders');
    const hymnArray_I = Array.from(hymns_I);

    hymnArray_I.forEach(hymn => {
        hymn.addEventListener('click', (event) => {
            updateHymnView(hymnsArr[hymnArray_I.indexOf(event.target.closest('.insiders'))]);
	    });
    });
}
