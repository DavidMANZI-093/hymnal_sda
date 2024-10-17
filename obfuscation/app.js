const toggleButton = document.querySelector('.theme');
const themeShow = document.querySelector('.theme-show');
const themeStyle = document.querySelector('.theme-style');
const savedTheme = localStorage.getItem('theme');

if (savedTheme) {
    themeStyle.setAttribute('href', savedTheme);
}

function changeTheme() {
  const currentTheme = themeStyle.getAttribute('href');
  const newTheme = currentTheme === 'styles_light.css' ? 'styles_dark.css' : 'styles_light.css';
  themeStyle.setAttribute('href', newTheme);
  localStorage.setItem('theme', newTheme);
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

    if (!isNaN(input) && input !== '') {
      handleNumberSearch(input, hymns);
    } else {
      handleTitleSearch(input, hymns);
    }
  });
}

function handleNumberSearch(input, hymns) {
  const hymnNumber = parseInt(input, 10);

  if (hymnNumber > 0 && hymnNumber <= hymns.length) {
    const hymn = hymns[hymnNumber - 1];
    listFiller(hymn);
  } else {
    showNoResult();
  }
}

function handleTitleSearch(input, hymns) {
  const searchValue = input.trim();

  if (searchValue !== '') {
    const escapedSearchValue = escapeRegExp(searchValue);
    const searchKey = new RegExp(escapedSearchValue, 'i');
    const filteredHymns = hymns.filter(hymn => searchKey.test(hymn.title));

    if (filteredHymns.length > 0) {
      filteredHymns.forEach(hymn => listFiller(hymn));
    } else {
      showNoResult();
    }
  }
}

function listFiller(hymn) {
  const li = document.createElement('li');
  li.classList.add('hymn', 'results');
  
  const hymnNumber = document.createElement('span');
  hymnNumber.classList.add('hymn-number');
  hymnNumber.innerHTML = hymn.number;
  
  const hymnTitle = document.createElement('span');
  hymnTitle.classList.add('hymn-name');
  hymnTitle.textContent = hymn.title;

  li.appendChild(hymnNumber);
  li.appendChild(hymnTitle);

  li.addEventListener('click', () => {
    searchInputField.value = '';
    resultList.innerHTML = '';
    if (hymn.touch !== false) {
      updateHymnView(hymn);
    }
  });

  resultList.appendChild(li);
}

function showNoResult() {
  const response = {
    touch: false,
    number: "<i class='bx bx-info-circle'></i>",
    title: 'Nta gisubizo!'
  };
  listFiller(response);
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// -------------------------------------- //

const openPlaylistButton = document.querySelector('.open-playlist');
const closePlaylistButton = document.querySelector('.close-playlist');
const playlistButton = document.querySelector('.playlist-toggler');
const backdrop = document.querySelector('.drop-back');
const outerHymnPlaylist = document.querySelector('.outer-list');
const header = document.querySelector('.page-header');

function toggleHymnList() {
  const isActive = outerHymnPlaylist.classList.contains('active');
  toggleClassState(openPlaylistButton, 'show', !isActive);
  toggleClassState(closePlaylistButton, 'show', !isActive);
  toggleClassState(outerHymnPlaylist, 'active', !isActive);
  toggleClassState(backdrop, 'show', !isActive);
}

function toggleSmallList() {
  const isSmallListVisible = smallList.classList.contains('show');
  
  if (!isSmallListVisible) {
    toggleClassState(smallList, 'show', true);
    toggleClassState(backdrop, 'show', true);
    addWiggleEffect();
  } else {
    toggleClassState(smallList, 'show', false);
    toggleClassState(backdrop, 'show', false);
    addWiggleEffect();
  }
}

function addWiggleEffect() {
  themeShow.classList.add('wiggle');
  setTimeout(() => themeShow.classList.remove('wiggle'), 1000);
}

function closeAllLists() {
  if (smallList.classList.contains('show')) {
    toggleSmallList();
  } else if (outerHymnPlaylist.classList.contains('active')) {
    toggleHymnList();
  }
}

function toggleClassState(element, className, state) {
  state ? element.classList.add(className) : element.classList.remove(className);
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
    hymns.forEach(hymn => {
      const li = document.createElement('li');
      li.classList.add('hymn', hymnList.classList.contains('outer-list') ? 'outer-hymn' : 'origin-hymn');

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
  });

  updateHymnView(hymns[0]);
  attachListeners(hymns);
  initiateSearch(hymns);
}

function highLightHymn(object) {
  document.querySelectorAll('.hymn').forEach(hymn => hymn.classList.remove('selected'));

  document.querySelectorAll('.hymn').forEach(hymn => {
    const hymnNumber = hymn.querySelector('span.hymn-number');
    if (hymnNumber.textContent == object.number) {
      hymn.classList.add('selected');
    }
  });
}

async function updateHymnView(object) {
  highLightHymn(object);
  if (object) {
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
    span2.textContent = object.title;

    const h3 = document.createElement('h3');
    h3.textContent = object.author;

    hymnTitle.appendChild(span1);
    hymnTitle.appendChild(span2);
    hymnAuthor.appendChild(h3);

    const lyrics = document.querySelector('.lyrics');
    lyrics.innerHTML = '';

    object.verses.forEach((verse, index) => {
      const div = document.createElement('div');
      div.classList.add('verse');
      
      const span = document.createElement('span');
      span.classList.add('number');
      span.textContent = index + 1;

      const p = document.createElement('p');
      p.classList.add('text');
      p.textContent = verse;

      div.appendChild(span);
      div.appendChild(p);
      lyrics.appendChild(div);
    });

    if (object.refrain) {
      const refrainDiv = document.createElement('div');
      refrainDiv.classList.add('refrain');
      
      const p = document.createElement('p');
      p.classList.add('text');
      p.textContent = object.refrain;
      
      refrainDiv.appendChild(p);
      lyrics.appendChild(refrainDiv);
    }
  }
}

function attachListeners(hymns) {
  const allHymns = document.querySelectorAll('.hymn');
  allHymns.forEach(hymn => hymn.addEventListener('click', () => {
    const hymnNumber = hymn.querySelector('span.hymn-number').textContent;
    const hymnObject = hymns.find(h => h.number === hymnNumber);
    updateHymnView(hymnObject);
  }));
}