function scrollToDiv(divId) {
    document.getElementById(divId).scrollIntoView({
        behavior: 'smooth'
    });
}

document.getElementById('Sobre_Nos').addEventListener('click', function() {
    scrollToDiv('SobreNos');
});

document.getElementById('Servicos').addEventListener('click', function() {
    scrollToDiv('Serviços');
});

document.getElementById('Tecnologias').addEventListener('click', function() {
    scrollToDiv('Tecnologia');
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

document.getElementById('backToTop').addEventListener('click', scrollToTop);