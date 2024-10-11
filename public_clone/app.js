const searchInputField = document.querySelector('#search-in');
const searchBar = document.querySelector('.search-bar');

console.log(searchInputField);
console.log(searchBar);

searchInputField.addEventListener('focus', () => {
    searchBar.classList.add('focus');
});

searchInputField.addEventListener('blur', () => {
    searchBar.classList.remove('focus');
});

// -------------------------------------- //

const openPlaylistButton = document.querySelector('.open-playlist');
const closePlaylistButton = document.querySelector('.close-playlist');
const playlistButton = document.querySelector('.playlist-toggler');
const backdrop = document.querySelector('.drop-back');
const outerHymnPlaylist = document.querySelector('.outer');

playlistButton.addEventListener('click', () => {
    openPlaylistButton.classList.toggle('show');
    closePlaylistButton.classList.toggle('show');
    backdrop.classList.toggle('show');
    outerHymnPlaylist.classList.toggle('active');
})