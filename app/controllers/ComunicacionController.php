<?php
require_once __DIR__ . '/../../core/Controller.php';

class ComunicacionController extends Controller {
    
    public function index() {
        $comunicacionModel = $this->model('Comunicacion');
        
        $tipo = $_GET['tipo'] ?? 'todos';
        
        if ($tipo === 'anuncios') {
            $comunicaciones = $comunicacionModel->getAnuncios();
        } else {
            $comunicaciones = $comunicacionModel->getAll();
        }
        
        $data = [
            'comunicaciones' => $comunicaciones,
            'tipo' => $tipo
        ];
        
        $this->view('comunicacion/index', $data);
    }
    
    public function crear() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $comunicacionModel = $this->model('Comunicacion');
            
            $data = [
                'titulo' => $_POST['titulo'],
                'mensaje' => $_POST['mensaje'],
                'tipo' => $_POST['tipo'],
                'fecha_creacion' => date('Y-m-d H:i:s'),
                'autor' => $_POST['autor'],
                'destinatario' => $_POST['destinatario'] === 'todos' ? null : $_POST['destinatario'],
                'estado' => 'activo'
            ];
            
            if ($comunicacionModel->create($data)) {
                header('Location: /hhh/public/comunicacion');
                exit;
            }
        }
        
        $residenteModel = $this->model('Residente');
        $residentes = $residenteModel->getAll();
        
        $data = ['residentes' => $residentes];
        $this->view('comunicacion/crear', $data);
    }
    
    public function mensajes() {
        $residente_id = $_GET['residente_id'] ?? null;
        
        if (!$residente_id) {
            header('Location: /hhh/public/residentes');
            exit;
        }
        
        $comunicacionModel = $this->model('Comunicacion');
        $residenteModel = $this->model('Residente');
        
        $mensajes = $comunicacionModel->getMensajesPorResidente($residente_id);
        $residente = $residenteModel->getById($residente_id);
        
        $data = [
            'mensajes' => $mensajes,
            'residente' => $residente
        ];
        
        $this->view('comunicacion/mensajes', $data);
    }
    
    public function marcarLeido() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
            
            $comunicacionModel = $this->model('Comunicacion');
            $comunicacionModel->marcarComoLeido($id);
            
            echo json_encode(['status' => 'success']);
            exit;
        }
    }
    
    public function anuncios() {
        $comunicacionModel = $this->model('Comunicacion');
        $anuncios = $comunicacionModel->getAnuncios();
        
        $data = ['anuncios' => $anuncios];
        $this->view('comunicacion/anuncios', $data);
    }
}
?>
