window.addEventListener('resize', () => {
    if (window.innerWidth > 767) {
        fcToggleHymnList();
    }
});

const searchInputField = document.querySelector('#search-in');
const searchBar = document.querySelector('.search-bar');
const resultList = document.querySelector('.result-list');

searchInputField.addEventListener('focus', () => {
    searchBar.classList.add('focus');
});

searchInputField.addEventListener('blur', () => {
    setTimeout(() => {
        searchBar.classList.remove('focus');
        resultList.innerHTML = '';
        searchInputField.value = '';
    }, 100);
});

function initiateSearch(hymns) {
    
    searchInputField.addEventListener('input', (event) => {
        resultList.innerHTML = '';
        const input = event.target.value.trim();
    
        function listFiller(hymns) {
            const li = document.createElement('li');
            li.classList.add('hymn', 'results');
            const hymnNumber = document.createElement('span');
            hymnNumber.classList.add('hymn-number');
            hymnNumber.innerHTML = hymns.number;
            const hymnTitle = document.createElement('span');
            hymnTitle.classList.add('hymn-name');
            hymnTitle.textContent = hymns.title;
            li.appendChild(hymnNumber);
            li.appendChild(hymnTitle);
            if (!(hymns?.touch) && (hymns.touch === false)) {
                li.addEventListener('click', () => {
                    searchInputField.value = '';
                    resultList.innerHTML = '';
                });
            } else {
                li.addEventListener('click', () => {
                    updateHymnView(hymns);
                    searchInputField.value = '';
                    resultList.innerHTML = '';
                });
            }
            resultList.appendChild(li);
        }
    
        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
    
        if (!isNaN(input) && input !== '') {
            if (input <= hymns.length && input > 0) {
                const response = hymns[input - 1];
                listFiller(response);
            } else {
                const response = {
                    touch: false,
                    number: "<i class='bx bx-info-circle'></i>",
                    title: 'Nta gisubizo!'
                }
                listFiller(response);
            }
        } else {
            const searchValue = event.target.value.trim();
    
            if (searchValue !== '') {
                const escapedSearchValue = escapeRegExp(searchValue);
    
                const searchKey = new RegExp(escapedSearchValue, 'i');
    
                const response_S = [];
    
                hymns.forEach(hymn => {
                    if (searchKey.test(hymn.title)) {
                        response_S.push(hymn);
                    } 
                });
    
                response_S.forEach(hymn => {
                    listFiller(hymn);
                });
            } else {
              if (searchValue !== '') {
              const response = {
                touch: false,
                number: "<i class='bx bx-info-circle'></i>",
                title: 'Nta gisubizo!'
              }
              listFiller(response);
              } 
            }
        }
    });
    
}

// -------------------------------------- //

const openPlaylistButton = document.querySelector('.open-playlist');
const closePlaylistButton = document.querySelector('.close-playlist');
const playlistButton = document.querySelector('.playlist-toggler');
const backdrop = document.querySelector('.drop-back');
const outerHymnPlaylist = document.querySelector('.outer-list');
const header = document.querySelector('.page-header');


function toggleHymnList() {
    openPlaylistButton.classList.toggle('show');
    closePlaylistButton.classList.toggle('show');
    backdrop.classList.toggle('show');
    outerHymnPlaylist.classList.toggle('active');
}

function fcToggleHymnList() {
    if (outerHymnPlaylist.classList.contains('active')) {
        toggleHymnList();
    }
}

function hFcToggleHymnList(e) {
    if (outerHymnPlaylist.classList.contains('active') && !(e.target.closest('.playlist-toggler'))) {
        toggleHymnList();
    }
}

playlistButton.addEventListener('click', toggleHymnList);
backdrop.addEventListener('click', fcToggleHymnList);
header.addEventListener('click', (e) => hFcToggleHymnList(e));

// -------------------------------------- //

async function fetchHymns() {
    try {
        const response = await fetch('/hymns');
        const hymns = await response.json();
        displayHymns(hymns);
    } catch (error) {
        console.error('Error fetching hymns:', error);
    }
}
fetchHymns();


const hymnLists = document.querySelectorAll('.hymn-list');
function displayHymns(hymns) {

    hymnLists.forEach(hymnList => hymnList.innerHTML = '');
    hymnLists.forEach(hymnList => {
        if (hymnList.classList.contains('outer-list')) {
            hymns.forEach(hymn => {
                const li = document.createElement('li');
                li.classList.add('hymn','outer-hymn');
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
        } else if (hymnList.classList.contains('origin-list')) {
            hymns.forEach(hymn => {
                const li = document.createElement('li');
                li.classList.add('hymn','origin-hymn');
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
    initiateSearch(hymns);
}

async function updateHymnView(object) {
    if (object) {
        const asideIconHolder = document.querySelector('.asd-head .icon-holder');
        const asideHeadHolder = document.querySelector('.asd-head .head-holder');
        if (asideIconHolder && asideHeadHolder) {
            asideIconHolder.remove();
            asideHeadHolder.remove();
        }

        const asideIcon = document.querySelector('.asd-head .head-icon');
        const asideTitle = document.querySelector('.asd-head .head-text');
        asideTitle.style.display = 'inline-flex';
        asideIcon.style.display = 'inline-flex';

        const hymnTitle = document.querySelector('.hymn-title');
        const hymnAuthor = document.querySelector('.hymn-author');
        hymnTitle.innerHTML = '';
        hymnAuthor.innerHTML = '';
        const span1 = document.createElement('span');
        span1.classList.add('hymn-number');
        span1.textContent = `${object.number}.`;
        const span2 = document.createElement('span');
        span2.classList.add('hymn-name');
        span2.textContent = `${object.title}`;
        const h3 = document.createElement('h3');
        h3.textContent = `${object.author}`;

        hymnTitle.appendChild(span1);
        hymnTitle.appendChild(span2);
        hymnAuthor.appendChild(h3);

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
            span.classList.add('number');
            span.textContent = `${object.verses.indexOf(verse) + 1}`;

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

function attachListeners(hymnsArr) {
    const hymns_O = document.querySelectorAll('.outer-hymn');
    const hymnArray_O = Array.from(hymns_O);

    hymnArray_O.forEach(hymn => {
        hymn.addEventListener('click', (event) => {
            updateHymnView(hymnsArr[hymnArray_O.indexOf(event.target.closest('.outer-hymn'))]);
            toggleHymnList();
	    });
    });

    const hymns_I = document.querySelectorAll('.origin-hymn');
    const hymnArray_I = Array.from(hymns_I);

    hymnArray_I.forEach(hymn => {
        hymn.addEventListener('click', (event) => {
            updateHymnView(hymnsArr[hymnArray_I.indexOf(event.target.closest('.origin-hymn'))]);
	    });
    });
}