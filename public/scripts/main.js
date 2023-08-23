let darkMode = localStorage.getItem('darkMode');

const darkModeToggle = document.querySelector('#dark-mode-toggle');

const enableDarkMode = () => {
    document.body.classList.add('darkmode');
    darkModeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
    localStorage.setItem('darkMode', 'enabled');
}

const disableDarkMode = () => {
    document.body.classList.remove('darkmode');
    darkModeToggle.innerHTML = '<i class="bi bi-moon-fill"></i>';
    localStorage.setItem('darkMode', null);
}

if (darkMode === 'enabled') {
    enableDarkMode();
}else {
    darkModeToggle.innerHTML = '<i class="bi bi-moon-fill"></i>';
}

darkModeToggle.addEventListener('click', () => {
    darkMode = localStorage.getItem('darkMode');

    if (darkMode !== 'enabled') {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
});
