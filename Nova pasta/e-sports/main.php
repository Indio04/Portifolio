<?php
// Iniciar sessão no início do script
session_start();

// Configurações de cabeçalho para permitir requisições AJAX
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Tratar requisições OPTIONS para CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Configurações do banco de dados
$db_config = [
    'host' => 'localhost',
    'username' => 'root',
    'password' => '',
    'database' => 'esports_portal'
];

// Conexão com o banco de dados
function connectDB() {
    global $db_config;
    
    try {
        $conn = new mysqli(
            $db_config['host'],
            $db_config['username'],
            $db_config['password'],
            $db_config['database']
        );
        
        // Verificar conexão
        if ($conn->connect_error) {
            throw new Exception("Falha na conexão: " . $conn->connect_error);
        }
        
        // Definir charset
        $conn->set_charset("utf8mb4");
        
        return $conn;
    } catch (Exception $e) {
        // Em produção, você não deve exibir detalhes do erro
        error_log("Erro de conexão com o banco de dados: " . $e->getMessage());
        return false;
    }
}

// Função para responder com JSON
function jsonResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

// Obter dados da requisição
$request_method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Obter dados do corpo da requisição (para POST)
$request_body = file_get_contents('php://input');
$request_data = json_decode($request_body, true);

// Roteamento de ações
switch ($action) {
    case 'get_tournaments':
        getTournaments();
        break;
        
    case 'join_tournament':
        if ($request_method === 'POST') {
            joinTournament($request_data);
        } else {
            jsonResponse(['success' => false, 'message' => 'Método não permitido'], 405);
        }
        break;
        
    case 'register':
        if ($request_method === 'POST') {
            registerUser($request_data);
        } else {
            jsonResponse(['success' => false, 'message' => 'Método não permitido'], 405);
        }
        break;
        
    case 'login':
        if ($request_method === 'POST') {
            loginUser($request_data);
        } else {
            jsonResponse(['success' => false, 'message' => 'Método não permitido'], 405);
        }
        break;
        
    case 'logout':
        logoutUser();
        break;
        
    case 'check_login':
        checkLoginStatus();
        break;
        
    case 'get_news':
        getNews();
        break;
        
    case 'get_streams':
        getStreams();
        break;
        
    default:
        jsonResponse(['success' => false, 'message' => 'Ação não encontrada'], 404);
}

// Função para obter torneios
function getTournaments() {
    $conn = connectDB();
    
    // Se a conexão falhar, retornar dados de exemplo
    if (!$conn) {
        returnSampleTournaments();
        return;
    }
    
    try {
        $stmt = $conn->prepare("SELECT * FROM tournaments WHERE start_date >= CURDATE() ORDER BY start_date ASC LIMIT 10");
        $stmt->execute();
        $result = $stmt->get_result();
        
        $tournaments = [];
        while ($row = $result->fetch_assoc()) {
            // Formatar dados
            $tournament = [
                'id' => $row['id'],
                'name' => $row['name'],
                'date' => date('d \d\e F, Y', strtotime($row['start_date'])),
                'participants' => $row['max_teams'],
                'prize_pool' => 'R$ ' . number_format($row['prize_pool'], 2, ',', '.'),
                'description' => $row['description'],
                'game' => $row['game'],
                'game_icon' => $row['game_icon'],
                'image' => $row['image']
            ];
            
            $tournaments[] = $tournament;
        }
        
        $stmt->close();
        $conn->close();
        
        // Se não houver torneios no banco, retornar dados de exemplo
        if (empty($tournaments)) {
            returnSampleTournaments();
            return;
        }
        
        jsonResponse($tournaments);
    } catch (Exception $e) {
        error_log("Erro ao obter torneios: " . $e->getMessage());
        returnSampleTournaments();
    }
}

// Função para retornar torneios de exemplo
function returnSampleTournaments() {
    $sampleTournaments = [
        [
            'id' => 1,
            'name' => 'Copa NexusGG de League of Legends',
            'date' => '15 de Novembro, 2023',
            'participants' => 32,
            'prize_pool' => 'R$ 10.000,00',
            'description' => 'O maior torneio amador de League of Legends do Brasil. Participe com sua equipe e mostre seu valor!',
            'game' => 'League of Legends',
            'game_icon' => 'https://static.wikia.nocookie.net/leagueoflegends/images/0/07/League_of_Legends_icon.png/revision/latest?cb=20191018194326',
            'image' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        ],
        [
            'id' => 2,
            'name' => 'Campeonato Brasileiro de CS:GO',
            'date' => '20 de Novembro, 2023',
            'participants' => 16,
            'prize_pool' => 'R$ 15.000,00',
            'description' => 'Reúna sua equipe e participe do maior campeonato brasileiro de Counter-Strike: Global Offensive.',
            'game' => 'CS:GO',
            'game_icon' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/CSGO_Logo.svg/1200px-CSGO_Logo.svg.png',
            'image' => 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        ],
        [
            'id' => 3,
            'name' => 'Torneio Valorant Rising Stars',
            'date' => '5 de Dezembro, 2023',
            'participants' => 24,
            'prize_pool' => 'R$ 8.000,00',
            'description' => 'Um torneio para equipes emergentes mostrarem seu potencial no cenário competitivo de Valorant.',
            'game' => 'Valorant',
            'game_icon' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_pink_color_version.svg/1200px-Valorant_logo_-_pink_color_version.svg.png',
            'image' => 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        ]
    ];
    
    jsonResponse($sampleTournaments);
}

// Função para inscrever em um torneio
function joinTournament($data) {
    // Verificar se o usuário está logado
    if (!isLoggedIn()) {
        jsonResponse(['success' => false, 'message' => 'Você precisa estar logado para se inscrever em um torneio']);
        return;
    }
    
    // Verificar se o ID do torneio foi fornecido
    if (!isset($data['tournament_id'])) {
        jsonResponse(['success' => false, 'message' => 'ID do torneio não fornecido']);
        return;
    }
    
    $tournament_id = $data['tournament_id'];
    $user_id = $_SESSION['user_id'];
    
    $conn = connectDB();
    if (!$conn) {
        jsonResponse(['success' => false, 'message' => 'Erro de conexão com o banco de dados']);
        return;
    }
    
    try {
        // Verificar se o torneio existe
        $stmt = $conn->prepare("SELECT id, max_teams FROM tournaments WHERE id = ?");
        $stmt->bind_param("i", $tournament_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            jsonResponse(['success' => false, 'message' => 'Torneio não encontrado']);
            return;
        }
        
        $tournament = $result->fetch_assoc();
        
        // Verificar se o usuário já está inscrito
        $stmt = $conn->prepare("SELECT id FROM tournament_registrations WHERE tournament_id = ? AND user_id = ?");
        $stmt->bind_param("ii", $tournament_id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            jsonResponse(['success' => false, 'message' => 'Você já está inscrito neste torneio']);
            return;
        }
        
        // Verificar se o torneio está cheio
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM tournament_registrations WHERE tournament_id = ?");
        $stmt->bind_param("i", $tournament_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $count = $result->fetch_assoc()['count'];
        
        if ($count >= $tournament['max_teams']) {
            jsonResponse(['success' => false, 'message' => 'Este torneio já atingiu o número máximo de participantes']);
            return;
        }
        
        // Registrar inscrição
        $stmt = $conn->prepare("INSERT INTO tournament_registrations (tournament_id, user_id, registration_date) VALUES (?, ?, NOW())");
        $stmt->bind_param("ii", $tournament_id, $user_id);
        $stmt->execute();
        
        if ($stmt->affected_rows > 0) {
            jsonResponse(['success' => true, 'message' => 'Inscrição realizada com sucesso']);
        } else {
            jsonResponse(['success' => false, 'message' => 'Erro ao realizar inscrição']);
        }
        
        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        error_log("Erro ao processar inscrição: " . $e->getMessage());
        jsonResponse(['success' => false, 'message' => 'Erro ao processar inscrição']);
    }
}

// Função para registrar um novo usuário
function registerUser($data) {
    // Verificar se todos os campos necessários foram fornecidos
    if (!isset($data['username']) || !isset($data['email']) || !isset($data['password'])) {
        jsonResponse(['success' => false, 'message' => 'Todos os campos são obrigatórios']);
        return;
    }
    
    $username = trim($data['username']);
    $email = trim($data['email']);
    $password = $data['password'];
    
    // Validar dados
    if (strlen($username) < 3) {
        jsonResponse(['success' => false, 'message' => 'O nome de usuário deve ter pelo menos 3 caracteres']);
        return;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['success' => false, 'message' => 'E-mail inválido']);
        return;
    }
    
    if (strlen($password) < 6) {
        jsonResponse(['success' => false, 'message' => 'A senha deve ter pelo menos 6 caracteres']);
        return;
    }
    
    $conn = connectDB();
    if (!$conn) {
        jsonResponse(['success' => false, 'message' => 'Erro de conexão com o banco de dados']);
        return;
    }
    
    try {
        // Verificar se o usuário ou e-mail já existem
        $stmt = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
        $stmt->bind_param("ss", $username, $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            jsonResponse(['success' => false, 'message' => 'Nome de usuário ou e-mail já cadastrado']);
            return;
        }
        
        // Hash da senha
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        
         // Inserir novo usuário
         $stmt = $conn->prepare("INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())");
         $stmt->bind_param("sss", $username, $email, $password_hash);
         $stmt->execute();
         
         if ($stmt->affected_rows > 0) {
             jsonResponse(['success' => true, 'message' => 'Conta criada com sucesso']);
         } else {
             jsonResponse(['success' => false, 'message' => 'Erro ao criar conta']);
         }
         
         $stmt->close();
         $conn->close();
     } catch (Exception $e) {
         error_log("Erro ao processar registro: " . $e->getMessage());
         jsonResponse(['success' => false, 'message' => 'Erro ao processar registro']);
     }
 }
 
 // Função para login de usuário
 function loginUser($data) {
     // Verificar se todos os campos necessários foram fornecidos
     if (!isset($data['email']) || !isset($data['password'])) {
         jsonResponse(['success' => false, 'message' => 'E-mail e senha são obrigatórios']);
         return;
     }
     
     $email = trim($data['email']);
     $password = $data['password'];
     
     $conn = connectDB();
     if (!$conn) {
         jsonResponse(['success' => false, 'message' => 'Erro de conexão com o banco de dados']);
         return;
     }
     
     try {
         // Buscar usuário pelo e-mail
         $stmt = $conn->prepare("SELECT id, username, email, password FROM users WHERE email = ?");
         $stmt->bind_param("s", $email);
         $stmt->execute();
         $result = $stmt->get_result();
         
         if ($result->num_rows === 0) {
             jsonResponse(['success' => false, 'message' => 'E-mail ou senha incorretos']);
             return;
         }
         
         $user = $result->fetch_assoc();
         
         // Verificar senha
         if (!password_verify($password, $user['password'])) {
             jsonResponse(['success' => false, 'message' => 'E-mail ou senha incorretos']);
             return;
         }
         
         // Iniciar sessão
         $_SESSION['user_id'] = $user['id'];
         $_SESSION['username'] = $user['username'];
         $_SESSION['email'] = $user['email'];
         
         jsonResponse([
             'success' => true, 
             'message' => 'Login realizado com sucesso',
             'user' => [
                 'id' => $user['id'],
                 'username' => $user['username'],
                 'email' => $user['email']
             ]
         ]);
         
         $stmt->close();
         $conn->close();
     } catch (Exception $e) {
         error_log("Erro ao processar login: " . $e->getMessage());
         jsonResponse(['success' => false, 'message' => 'Erro ao processar login']);
     }
 }
 
 // Função para verificar se o usuário está logado
 function isLoggedIn() {
     return isset($_SESSION['user_id']);
 }
 
 // Função para verificar o status de login
 function checkLoginStatus() {
     if (isLoggedIn()) {
         jsonResponse([
             'success' => true,
             'logged_in' => true,
             'user' => [
                 'id' => $_SESSION['user_id'],
                 'username' => $_SESSION['username'],
                 'email' => $_SESSION['email']
             ]
         ]);
     } else {
         jsonResponse([
             'success' => true,
             'logged_in' => false
         ]);
     }
 }
 
 // Função para logout
 function logoutUser() {
     // Destruir a sessão
     session_unset();
     session_destroy();
     
     jsonResponse([
         'success' => true,
         'message' => 'Logout realizado com sucesso'
     ]);
 }
 
 // Função para obter notícias
 function getNews() {
     $conn = connectDB();
     
     if (!$conn) {
         jsonResponse(['success' => false, 'message' => 'Erro de conexão com o banco de dados']);
         return;
     }
     
     try {
         $stmt = $conn->prepare("SELECT * FROM news ORDER BY published_date DESC LIMIT 6");
         $stmt->execute();
         $result = $stmt->get_result();
         
         $news = [];
         while ($row = $result->fetch_assoc()) {
             $news[] = [
                 'id' => $row['id'],
                 'title' => $row['title'],
                 'excerpt' => $row['excerpt'],
                 'content' => $row['content'],
                 'category' => $row['category'],
                 'image' => $row['image'],
                 'date' => date('d \d\e F, Y', strtotime($row['published_date'])),
                 'author' => $row['author']
             ];
         }
         
         $stmt->close();
         $conn->close();
         
         // Se não houver notícias, retornar array vazio
         if (empty($news)) {
             // Opcionalmente, você pode retornar notícias de exemplo aqui
             jsonResponse([]);
             return;
         }
         
         jsonResponse($news);
     } catch (Exception $e) {
         error_log("Erro ao obter notícias: " . $e->getMessage());
         jsonResponse(['success' => false, 'message' => 'Erro ao obter notícias']);
     }
 }
 
 // Função para obter streams
 function getStreams() {
     $conn = connectDB();
     
     if (!$conn) {
         jsonResponse(['success' => false, 'message' => 'Erro de conexão com o banco de dados']);
         return;
     }
     
     try {
         $stmt = $conn->prepare("SELECT * FROM streams WHERE is_live = 1 ORDER BY viewers DESC LIMIT 6");
         $stmt->execute();
         $result = $stmt->get_result();
         
         $streams = [];
         while ($row = $result->fetch_assoc()) {
             $streams[] = [
                 'id' => $row['id'],
                 'title' => $row['title'],
                 'streamer' => $row['streamer_name'],
                 'streamer_avatar' => $row['streamer_avatar'],
                 'thumbnail' => $row['thumbnail'],
                 'game' => $row['game'],
                 'viewers' => $row['viewers']
             ];
         }
         
         $stmt->close();
         $conn->close();
         
         // Se não houver streams, retornar array vazio
         if (empty($streams)) {
             // Opcionalmente, você pode retornar streams de exemplo aqui
             jsonResponse([]);
             return;
         }
         
         jsonResponse($streams);
     } catch (Exception $e) {
         error_log("Erro ao obter streams: " . $e->getMessage());
         jsonResponse(['success' => false, 'message' => 'Erro ao obter streams']);
     }
 }
 ?>