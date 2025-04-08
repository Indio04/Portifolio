/**
 * NexusGG - Portal de E-Sports
 * Arquivo principal de JavaScript
 */

// Função para verificar se o DOM está carregado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas as funcionalidades
    initMobileMenu();
    initSmoothScrolling();
    initHeaderScroll();
    initHeroButtons();
    loadTournaments();
    initRegisterForm();
    checkUserLogin();
});

// Função para inicializar o menu mobile
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const menu = document.querySelector('.menu');
    const userActions = document.querySelector('.user-actions');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            menu.classList.toggle('active');
            userActions.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
}

// Função para inicializar a rolagem suave
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Não interferir com links que não são âncoras internas
            if (this.getAttribute('href').length <= 1) return;
            
            // Verificar se o link é para uma página externa
            if (this.getAttribute('href').includes('.html')) return;
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Atualizar item de menu ativo
                document.querySelectorAll('.menu a').forEach(item => {
                    item.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
}

// Função para inicializar o efeito de scroll no cabeçalho
function initHeaderScroll() {
    const header = document.querySelector('header');
    
    if (header) {
        // Verificar posição inicial da página
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        }
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// Função para inicializar os botões da seção hero
function initHeroButtons() {
    // Botão "Ver Torneios"
    const viewTournamentsBtn = document.querySelector('.hero-buttons .primary-btn');
    if (viewTournamentsBtn) {
        viewTournamentsBtn.addEventListener('click', function(e) {
            if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
    
    // Botão "Criar Conta"
    const createAccountBtn = document.querySelector('.hero-buttons .secondary-btn');
    if (createAccountBtn) {
        if (createAccountBtn.tagName === 'BUTTON') {
            // Se já for um botão, não precisa fazer nada
        } else {
            createAccountBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'register.html';
            });
        }
    }
}

// Função para carregar torneios da API
function loadTournaments() {
    const tournamentsContainer = document.getElementById('tournaments-container');
    if (!tournamentsContainer) return;
    
    // Mostrar estado de carregamento
    tournamentsContainer.innerHTML = '<div class="loading">Carregando torneios...</div>';
    
    // Buscar torneios da API
    fetch('main.php?action=get_tournaments')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar torneios');
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                tournamentsContainer.innerHTML = '<div class="no-results">Nenhum torneio encontrado</div>';
                return;
            }
            
            // Limpar mensagem de carregamento
            tournamentsContainer.innerHTML = '';
            
            // Renderizar torneios
            data.forEach(tournament => {
                const tournamentCard = createTournamentCard(tournament);
                tournamentsContainer.appendChild(tournamentCard);
            });
        })
        .catch(error => {
            console.error('Erro:', error);
            tournamentsContainer.innerHTML = `<div class="error">Erro ao carregar torneios: ${error.message}</div>`;
            
            // Fallback: Mostrar torneios de exemplo se a API falhar
            setTimeout(() => {
                loadSampleTournaments();
            }, 2000);
        });
}

// Função para criar elemento de card de torneio
function createTournamentCard(tournament) {
    const card = document.createElement('div');
    card.className = 'tournament-card';
    
    card.innerHTML = `
        <div class="tournament-img">
            <img src="${tournament.image}" alt="${tournament.name}" onerror="this.src='https://via.placeholder.com/500x300?text=Imagem+Indisponível'">
        </div>
        <div class="tournament-info">
            <h3>${tournament.name}</h3>
            <div class="tournament-meta">
                <span><i class="fas fa-calendar"></i> ${tournament.date}</span>
                <span><i class="fas fa-users"></i> ${tournament.participants} equipes</span>
            </div>
            <div class="prize-pool">
                <i class="fas fa-trophy"></i> Premiação: ${tournament.prize_pool}
            </div>
            <p>${tournament.description}</p>
            <div class="tournament-footer">
                <div class="tournament-game">
                    <img src="${tournament.game_icon}" alt="${tournament.game}" onerror="this.src='https://via.placeholder.com/30x30?text=Game'">
                    <span>${tournament.game}</span>
                </div>
                <a href="#" class="join-btn" data-id="${tournament.id}">Inscrever-se</a>
            </div>
        </div>
    `;
    
    // Adicionar event listener ao botão de inscrição
    const joinBtn = card.querySelector('.join-btn');
    joinBtn.addEventListener('click', function(e) {
        e.preventDefault();
        joinTournament(tournament.id);
    });
    
    return card;
}

// Função para carregar torneios de exemplo se a API falhar
function loadSampleTournaments() {
    const tournamentsContainer = document.getElementById('tournaments-container');
    if (!tournamentsContainer) return;
    
    const sampleTournaments = [
        {
            id: 1,
            name: "Copa NexusGG de League of Legends",
            date: "15 de Novembro, 2023",
            participants: 32,
            prize_pool: "R$ 10.000",
            description: "O maior torneio amador de League of Legends do Brasil. Participe com sua equipe e mostre seu valor!",
            game: "League of Legends",
            game_icon: "https://static.wikia.nocookie.net/leagueoflegends/images/0/07/League_of_Legends_icon.png/revision/latest?cb=20191018194326",
            image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 2,
            name: "Campeonato Brasileiro de CS:GO",
            date: "20 de Novembro, 2023",
            participants: 16,
            prize_pool: "R$ 15.000",
            description: "Reúna sua equipe e participe do maior campeonato brasileiro de Counter-Strike: Global Offensive.",
            game: "CS:GO",
            game_icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/CSGO_Logo.svg/1200px-CSGO_Logo.svg.png",
            image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 3,
            name: "Torneio Valorant Rising Stars",
            date: "5 de Dezembro, 2023",
            participants: 24,
            prize_pool: "R$ 8.000",
            description: "Um torneio para equipes emergentes mostrarem seu potencial no cenário competitivo de Valorant.",
            game: "Valorant",
            game_icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_pink_color_version.svg/1200px-Valorant_logo_-_pink_color_version.svg.png",
            image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
    ];
    
    // Limpar mensagem de carregamento
    tournamentsContainer.innerHTML = '';
    
    // Renderizar torneios de exemplo
    sampleTournaments.forEach(tournament => {
        const tournamentCard = createTournamentCard(tournament);
        tournamentsContainer.appendChild(tournamentCard);
    });
}

// Função para se inscrever em um torneio
function joinTournament(tournamentId) {
    // Verificar se o usuário está logado
    const isLoggedIn = checkUserLogin();
    
    if (!isLoggedIn) {
        showNotification('Você precisa estar logado para se inscrever em um torneio', 'error');
        
        // Rolar para a seção de registro
        const registerSection = document.getElementById('register');
        if (registerSection) {
            window.scrollTo({
                top: registerSection.offsetTop - 80,
                behavior: 'smooth'
            });
        } else {
            // Se não houver seção de registro, redirecionar para a página de registro
            setTimeout(() => {
                window.location.href = 'register.html';
            }, 1500);
        }
        return;
    }
    
    // Enviar solicitação de inscrição para o servidor
    fetch('main.php?action=join_tournament', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            tournament_id: tournamentId
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            showNotification('Inscrição realizada com sucesso!', 'success');
        } else {
            showNotification(data.message || 'Erro ao se inscrever no torneio', 'error');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        showNotification('Erro ao se inscrever no torneio', 'error');
    });
}

// Função para inicializar o formulário de registro
function initRegisterForm() {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Validar formulário
            if (!username || !email || !password) {
                showNotification('Por favor, preencha todos os campos', 'error');
                return;
            }
            
            if (username.length < 3) {
                showNotification('O nome de usuário deve ter pelo menos 3 caracteres', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Por favor, insira um e-mail válido', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('A senha deve ter pelo menos 6 caracteres', 'error');
                return;
            }
            
            // Enviar dados de registro para o servidor
            registerUser(username, email, password);
        });
    }
}

// Função para validar e-mail
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para registrar um novo usuário
function registerUser(username, email, password) {
    // Mostrar estado de carregamento
    const submitBtn = document.querySelector('.register-submit') || document.querySelector('.auth-submit');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Processando...';
    submitBtn.disabled = true;
    
    // Enviar dados de registro para o servidor
    fetch('main.php?action=register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }
        return response.json();
    })
    .then(data => {
        // Restaurar estado do botão
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        
        if (data.success) {
            showNotification('Conta criada com sucesso! Faça login para continuar.', 'success');
            document.getElementById('register-form').reset();
            
            // Redirecionar para a página de login após 2 segundos
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showNotification(data.message || 'Erro ao criar conta', 'error');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        showNotification('Erro ao criar conta', 'error');
        
        // Restaurar estado do botão
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    });
}

// Função para verificar se o usuário está logado
function checkUserLogin() {
    // Verificar se há dados de usuário no localStorage
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userActions = document.querySelector('.user-actions');
    
    if (isLoggedIn && userActions) {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (userData && userData.username) {
                userActions.innerHTML = `
                    <div class="user-profile">
                        <span>Olá, ${userData.username}</span>
                        <button onclick="logout()" class="logout-btn">Sair</button>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Erro ao processar dados do usuário:', error);
            // Em caso de erro, limpar dados corrompidos
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn');
            return false;
        }
    }
    
    return isLoggedIn;
}

// Função para fazer logout
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    showNotification('Logout realizado com sucesso!', 'success');
    
    // Recarregar a página após 1 segundo
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// Função para mostrar notificação
function showNotification(message, type = 'info') {
    // Criar elemento de notificação se não existir
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Definir conteúdo e estilo da notificação
    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    // Mostrar notificação
    notification.classList.add('show');
    
    // Esconder notificação após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Função para rolar suavemente para uma seção
window.scrollToSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        window.scrollTo({
            top: section.offsetTop - 80,
            behavior: 'smooth'
        });
    }
}

// Adicionar estilos de notificação
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 4px;
        color: white;
        font-weight: 600;
        z-index: 9999;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        max-width: 350px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .notification.success {
        background-color: #2ecc71;
    }
    
    .notification.error {
        background-color: #e74c3c;
    }
    
    .notification.info {
        background-color: #3498db;
    }
    
    .notification.warning {
        background-color: #f39c12;
    }
    
    /* Estilos para o perfil do usuário quando logado */
    .user-profile {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .user-profile span {
        font-weight: 600;
        color: var(--light-text);
    }
    
    .logout-btn {
        background: transparent;
        color: var(--light-text);
        border: 1px solid var(--primary-color);
        padding: 8px 15px;
        border-radius: 4px;
        cursor: pointer;
        font-family: 'Rajdhani', sans-serif;
        font-weight: 600;
        transition: var(--transition);
    }
    
    .logout-btn:hover {
        background-color: var(--primary-color);
        color: white;
    }
    
    /* Estilos para o menu mobile */
    @media (max-width: 768px) {
        .menu.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 80px;
            left: 0;
            width: 100%;
            background-color: var(--darker-bg);
            padding: 20px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
            z-index: 100;
        }
        
        .user-actions.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 250px;
            left: 0;
            width: 100%;
            background-color: var(--darker-bg);
            padding: 20px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
            z-index: 100;
        }
        
        .mobile-menu-btn.active i:before {
            content: "\\f00d";
        }
    }
`;

document.head.appendChild(notificationStyles);