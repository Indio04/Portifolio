function toggleMenu() {
  const menu = document.querySelector('.menu');
  const hamburguer = document.querySelector('.menu-hamburguer');
  
  menu.classList.toggle('ativo');
  hamburguer.classList.toggle('ativo');
}

document.querySelectorAll('.menu-link').forEach(link => {
  link.addEventListener('click', () => {
      const menu = document.querySelector('.menu');
      const hamburguer = document.querySelector('.menu-hamburguer');
      
      if (menu.classList.contains('ativo')) {
          menu.classList.remove('ativo');
          hamburguer.classList.remove('ativo');
      }
  });
});

function enviarWhats(event) {
    event.preventDefault()  
  
    const nome = document.getElementById("nome").value;
    const mensagem = document.getElementById("mensagem").value;
    const telefone = "5555996482798";
  
    const texto = `Olá! Me chamo ${nome}, ${mensagem}`;
    const msgFormatada = encodeURIComponent(texto);
  
    const url = `https://wa.me/${telefone}?text=${msgFormatada}`;
  
    window.open(url, "_blank");
  }