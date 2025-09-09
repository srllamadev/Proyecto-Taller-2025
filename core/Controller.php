<?php
// Clase principal del controlador
class Controller {
    protected function view($view, $data = []) {
        extract($data);
        require_once __DIR__ . '/../app/views/' . $view . '.php';
    }

    protected function model($model) {
        require_once __DIR__ . '/../app/models/' . $model . '.php';
        return new $model();
    }
}
?>
