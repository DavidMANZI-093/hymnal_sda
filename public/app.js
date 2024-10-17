const toggleButton = document.querySelector('.theme');
const themeShow = document.querySelector('.theme-show');
const themeStyle = document.querySelector('.theme-style');

const savedTheme = localStorage.getItem('theme');

if (savedTheme) {
    themeStyle.setAttribute('href', savedTheme);
}

function changeTheme() {
  if (themeStyle.getAttribute('href') === 'styles_light.css') {
      themeStyle.setAttribute('href', 'styles_dark.css');
      localStorage.setItem('theme', 'styles_dark.css');
  } else {
      themeStyle.setAttribute('href', 'styles_light.css');
      localStorage.setItem('theme', 'styles_light.css');
  }
}

toggleButton.addEventListener('click', changeTheme);


// -------------------------------------- //

const easterEgg = document.querySelector('.logo-box');
const smallList = document.querySelector('.small-list');

easterEgg.addEventListener('click', toggleSmallList);

// -------------------------------------- //

window.addEventListener('resize', () => {
    if (window.innerWidth > 767) {
        closeAllLists();
    }
});

// -------------------------------------- //

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

      li.addEventListener('click', () => {
        searchInputField.value = '';
        resultList.innerHTML = '';
        if (hymns.touch !== false) {
          updateHymnView(hymns);
        }
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
      } else {
        const response = {
          touch: false,
          number: "<i class='bx bx-info-circle'></i>",
          title: 'Nta gisubizo!'
        };
        listFiller(response);
      }
    } else {
      const searchValue = event.target.value.trim();

      if (searchValue !== '') {
        const escapedSearchValue = escapeRegExp(searchValue);
        const searchKey = new RegExp(escapedSearchValue, 'i');

        const response_S = hymns.filter(hymn => searchKey.test(hymn.title));

        if (response_S.length > 0) {
          response_S.forEach(hymn => {
            listFiller(hymn);
          });
        } else {
          const response = {
            touch: false,
            number: "<i class='bx bx-info-circle'></i>",
            title: 'Nta gisubizo!'
          };
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
    if (!(outerHymnPlaylist.classList.contains('active'))) {
      if (smallList.classList.contains('show')) {
        smallList.classList.toggle('show');
        openPlaylistButton.classList.toggle('show');
        closePlaylistButton.classList.toggle('show');
        outerHymnPlaylist.classList.toggle('active');
      } else {
        openPlaylistButton.classList.toggle('show');
        closePlaylistButton.classList.toggle('show');
        outerHymnPlaylist.classList.toggle('active');
        backdrop.classList.toggle('show');
      }
    } else {
      openPlaylistButton.classList.toggle('show');
      closePlaylistButton.classList.toggle('show');
      outerHymnPlaylist.classList.toggle('active');
      backdrop.classList.toggle('show');
    }
}

function toggleSmallList() {
  if (!(smallList.classList.contains('show'))) {
    if (outerHymnPlaylist.classList.contains('active')) {
      outerHymnPlaylist.classList.toggle('active');
      openPlaylistButton.classList.toggle('show');
      closePlaylistButton.classList.toggle('show');
      smallList.classList.toggle('show');
    } else {
      smallList.classList.toggle('show');
      backdrop.classList.toggle('show');
      themeShow.classList.add('wiggle');
      setTimeout(() => {
        themeShow.classList.remove('wiggle');
      }, 1000);
    }
  } else {
    smallList.classList.toggle('show');
    backdrop.classList.toggle('show');
    themeShow.classList.add('wiggle');
      setTimeout(() => {
        themeShow.classList.remove('wiggle');
      }, 1000);
  }
}

function closeAllLists() {
  if (smallList.classList.contains('show')) {
    toggleSmallList();
  } else if (outerHymnPlaylist.classList.contains('active')) {
    toggleHymnList();
  }
}

function hFcCloseAllLists(e) {
  if (!(e.target.closest('.playlist-toggler')) && !(e.target.closest('.logo-box'))) {
    closeAllLists();
  }
}

playlistButton.addEventListener('click', toggleHymnList);
backdrop.addEventListener('click', closeAllLists);
header.addEventListener('click', (event) => hFcCloseAllLists(event));

// -------------------------------------- //

async function fetchHymns() {
    try {
        const response = await fetch('/hymns?api_key=158649e85e694ead18f97ac89a5ede40');
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

function highLightHymn(object) {
  document.querySelectorAll('.hymn').forEach(hymn => {
    hymn.classList.remove('selected');
  });
  
  const hymns = document.querySelectorAll('.hymn');

  hymns.forEach(hymn => {
    const hymnNumber = hymn.querySelector('span.hymn-number');
    if (hymnNumber.textContent == object.number) {
      hymn.classList.add('selected');
      console.log('dine');
    }
  });

}

async function updateHymnView(object) {
  highLightHymn(object);
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