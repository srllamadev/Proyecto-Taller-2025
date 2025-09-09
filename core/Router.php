<?php
// Sistema de enrutamiento
class Router {
    private $routes = [];
    
    public function get($route, $controller, $action) {
        $this->routes['GET'][$route] = ['controller' => $controller, 'action' => $action];
    }
    
    public function post($route, $controller, $action) {
        $this->routes['POST'][$route] = ['controller' => $controller, 'action' => $action];
    }
    
    public function dispatch() {
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $method = $_SERVER['REQUEST_METHOD'];
        
        // Remover el directorio base si existe
        $uri = str_replace('/hhh/public', '', $uri);
        
        if ($uri === '') {
            $uri = '/';
        }
        
        if (isset($this->routes[$method][$uri])) {
            $route = $this->routes[$method][$uri];
            $controllerName = $route['controller'];
            $action = $route['action'];
            
            require_once __DIR__ . '/../app/controllers/' . $controllerName . '.php';
            $controller = new $controllerName();
            $controller->$action();
        } else {
            // Ruta no encontrada
            http_response_code(404);
            echo "Página no encontrada";
        }
    }
}
?>
