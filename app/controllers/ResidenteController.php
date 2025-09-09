<?php
require_once __DIR__ . '/../../core/Controller.php';

class ResidenteController extends Controller {
    
    public function index() {
        $residenteModel = $this->model('Residente');
        $residentes = $residenteModel->getAll();
        
        $data = ['residentes' => $residentes];
        $this->view('residentes/index', $data);
    }
    
    public function create() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $residenteModel = $this->model('Residente');
            
            $data = [
                'nombre' => $_POST['nombre'],
                'apellido' => $_POST['apellido'],
                'email' => $_POST['email'],
                'telefono' => $_POST['telefono'],
                'unidad' => $_POST['unidad'],
                'fecha_ingreso' => date('Y-m-d'),
                'estado' => 'activo'
            ];
            
            if ($residenteModel->create($data)) {
                header('Location: /hhh/public/residentes');
                exit;
            }
        }
        
        $this->view('residentes/create');
    }
    
    public function edit() {
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            header('Location: /hhh/public/residentes');
            exit;
        }
        
        $residenteModel = $this->model('Residente');
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = [
                'nombre' => $_POST['nombre'],
                'apellido' => $_POST['apellido'],
                'email' => $_POST['email'],
                'telefono' => $_POST['telefono'],
                'unidad' => $_POST['unidad'],
                'estado' => $_POST['estado']
            ];
            
            if ($residenteModel->update($id, $data)) {
                header('Location: /hhh/public/residentes');
                exit;
            }
        }
        
        $residente = $residenteModel->getById($id);
        $data = ['residente' => $residente];
        $this->view('residentes/edit', $data);
    }
    
    public function delete() {
        $id = $_GET['id'] ?? null;
        
        if ($id) {
            $residenteModel = $this->model('Residente');
            $residenteModel->delete($id);
        }
        
        header('Location: /hhh/public/residentes');
        exit;
    }
    
    public function show() {
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            header('Location: /hhh/public/residentes');
            exit;
        }
        
        $residenteModel = $this->model('Residente');
        $pagoModel = $this->model('Pago');
        $consumoModel = $this->model('ConsumoEnergetico');
        
        $residente = $residenteModel->getById($id);
        $pagos = $pagoModel->getPagosPorResidente($id);
        $consumos = $consumoModel->getConsumoPorUnidad($residente['unidad']);
        
        $data = [
            'residente' => $residente,
            'pagos' => $pagos,
            'consumos' => array_slice($consumos, 0, 10) // Últimos 10 registros
        ];
        
        $this->view('residentes/show', $data);
    }
}
?>
