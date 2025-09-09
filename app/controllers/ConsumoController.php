<?php
require_once __DIR__ . '/../../core/Controller.php';

class ConsumoController extends Controller {
    
    public function index() {
        $consumoModel = $this->model('ConsumoEnergetico');
        
        $unidad = $_GET['unidad'] ?? null;
        
        if ($unidad) {
            $consumos = $consumoModel->getConsumoPorUnidad($unidad);
            $promedio = $consumoModel->getPromedioConsumo($unidad);
            $huella = $consumoModel->getHuellaEnergetica($unidad);
        } else {
            $consumos = $consumoModel->getAll();
            $promedio = 0;
            $huella = [];
        }
        
        $data = [
            'consumos' => $consumos,
            'unidad' => $unidad,
            'promedio' => $promedio,
            'huella' => $huella
        ];
        
        $this->view('consumo/index', $data);
    }
    
    public function registrar() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $consumoModel = $this->model('ConsumoEnergetico');
            
            $data = [
                'unidad' => $_POST['unidad'],
                'fecha_lectura' => $_POST['fecha_lectura'],
                'consumo_kwh' => $_POST['consumo_kwh'],
                'costo' => $_POST['costo'],
                'tipo_medicion' => $_POST['tipo_medicion']
            ];
            
            if ($consumoModel->create($data)) {
                header('Location: /hhh/public/consumo');
                exit;
            }
        }
        
        $this->view('consumo/registrar');
    }
    
    public function porPiso() {
        $piso = $_GET['piso'] ?? '1';
        
        $consumoModel = $this->model('ConsumoEnergetico');
        $consumos = $consumoModel->getConsumoPorPiso($piso);
        
        $data = [
            'consumos' => $consumos,
            'piso' => $piso
        ];
        
        $this->view('consumo/por_piso', $data);
    }
    
    public function huella() {
        $unidad = $_GET['unidad'] ?? null;
        
        if (!$unidad) {
            header('Location: /hhh/public/consumo');
            exit;
        }
        
        $consumoModel = $this->model('ConsumoEnergetico');
        $residenteModel = $this->model('Residente');
        
        $huella = $consumoModel->getHuellaEnergetica($unidad);
        $residentes = $residenteModel->getByUnidad($unidad);
        $promedio = $consumoModel->getPromedioConsumo($unidad);
        
        $data = [
            'huella' => $huella,
            'unidad' => $unidad,
            'residentes' => $residentes,
            'promedio' => $promedio
        ];
        
        $this->view('consumo/huella', $data);
    }
    
    public function ajustes() {
        $unidad = $_GET['unidad'] ?? null;
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Aquí se implementaría la lógica para ajustar el consumo
            // Por ejemplo, enviar comandos a dispositivos IoT
            
            $mensaje = "Ajustes aplicados correctamente para la unidad " . $_POST['unidad'];
            
            $data = ['mensaje' => $mensaje];
            $this->view('consumo/ajustes', $data);
            return;
        }
        
        if (!$unidad) {
            header('Location: /hhh/public/consumo');
            exit;
        }
        
        $consumoModel = $this->model('ConsumoEnergetico');
        $promedio = $consumoModel->getPromedioConsumo($unidad);
        $huella = $consumoModel->getHuellaEnergetica($unidad);
        
        $data = [
            'unidad' => $unidad,
            'promedio' => $promedio,
            'huella' => $huella
        ];
        
        $this->view('consumo/ajustes', $data);
    }
}
?>
