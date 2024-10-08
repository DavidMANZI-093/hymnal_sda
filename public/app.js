const listTogglers = document.querySelectorAll('.toggler');
const outerHymnList = document.querySelector('.outsided');
const backDrop = document.querySelector('.backdrop');

listTogglers[0].addEventListener('click', () => {
    listTogglers[0].classList.remove('show');
    listTogglers[1].classList.add('show');
    outerHymnList.classList.add('show');
    backDrop.classList.add('show');
    outerHymnList.focus();
});

listTogglers[1].addEventListener('click', () => {
    listTogglers[0].classList.add('show');
    listTogglers[1].classList.remove('show');
    outerHymnList.classList.remove('show');
    backDrop.classList.remove('show');
});

// outerHymnList.addEventListener('blur', () => {
//     setTimeout(() => {
//         listTogglers[0].classList.add('show');
//         listTogglers[1].classList.remove('show');
//         outerHymnList.classList.remove('show');
//         backDrop.classList.remove('show');
//     }, 10);
// });

backDrop.addEventListener('click', () => {
    listTogglers.forEach(toggler => {
        toggler.classList.toggle('show');
    });
    outerHymnList.classList.toggle('show');
    backDrop.classList.toggle('show');
});

const hymnLists = document.querySelectorAll('.hymn-list');

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

function displayHymns(hymns) {
    const lyricsPage = document.querySelector('.lyrics');
    lyricsPage.classList.add('changed');

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
    initiateSearch(hymns);
}

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

const searchBar = document.querySelector('.search-input');
const searchBox = document.querySelector('.funct-wrap');
const resultList = document.querySelector('.searched-list');

function initiateSearch(hymns) {
    
    searchBar.addEventListener('click', () => {
        searchBox.classList.add('round');
        resultList.classList.add('active');
        if (outerHymnList.classList.contains('show')) {
            listTogglers[0].classList.add('show');
        listTogglers[1].classList.remove('show');
        outerHymnList.classList.remove('show');
        backDrop.classList.remove('show');
        }
    });

    searchBar.addEventListener('blur', () => {
        setTimeout(() => {
            searchBox.classList.remove('round');
            resultList.classList.remove('active');
        }, 50);
    });


    searchBar.addEventListener('input', (event) => {
        resultList.innerHTML = '';
        const input = event.target.value.trim();
    
        function listFiller(hymns) {
            const li = document.createElement('li');
            li.classList.add('hymn', 'results');
            const hymnNumber = document.createElement('span');
            hymnNumber.classList.add('hymn-number');
            hymnNumber.textContent = hymns.number;
            const hymnTitle = document.createElement('span');
            hymnTitle.classList.add('hymn-name');
            hymnTitle.textContent = hymns.title;
            li.appendChild(hymnNumber);
            li.appendChild(hymnTitle);
            li.addEventListener('click', () => {
                updateHymnView(hymns);
                searchBar.value = '';
                resultList.innerHTML = '';
            });
            resultList.appendChild(li);
        }
    
        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
    
        if (!isNaN(input) && input !== '') {
            if (input <= hymns.length && input > 0) {
                const response = hymns[input - 1];
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
            }
        }
    });
    
}