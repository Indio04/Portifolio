function scrollToDiv(divId) {
    document.getElementById(divId).scrollIntoView({
        behavior: 'smooth'
    });
}

document.getElementById('Sobre_mim').addEventListener('click', function() {
    scrollToDiv('SobreMim');
});

document.getElementById('tecnologias').addEventListener('click', function() {
    scrollToDiv('Tecnologias');
});

document.getElementById('Contato').addEventListener('click', function() {
    scrollToDiv('Contatos');
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

document.getElementById('backToTop').addEventListener('click', scrollToTop);