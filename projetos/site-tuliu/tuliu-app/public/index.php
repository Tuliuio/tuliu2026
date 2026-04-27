<?php
// Roteamento SPA - redireciona todas as requisições para index.html
// exceto arquivos estáticos (assets, imagens, etc)

$request = $_SERVER['REQUEST_URI'];

// Remove a barra inicial se houver
$request = ltrim($request, '/');

// Lista de extensões que são arquivos estáticos
$staticExtensions = ['js', 'css', 'svg', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'woff', 'woff2', 'ttf', 'eot', 'ico'];

// Extrai a extensão do arquivo
$pathInfo = pathinfo($request);
$extension = $pathInfo['extension'] ?? '';

// Se for uma requisição para um arquivo estático, deixa o servidor servir normalmente
if (!empty($extension) && in_array(strtolower($extension), $staticExtensions)) {
    // Serve o arquivo estático
    return false;
}

// Se for uma pasta que existe, deixa o servidor processar
if (is_dir(__DIR__ . '/' . $request)) {
    return false;
}

// Para tudo mais (rotas SPA), redireciona para index.html
require_once __DIR__ . '/index.html';
?>
