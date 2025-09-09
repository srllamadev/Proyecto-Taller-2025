<?php
require_once __DIR__ . '/../../core/Controller.php';

class PagoController extends Controller {
    
    public function index() {
        $pagoModel = $this->model('Pago');
        
        $estado = $_GET['estado'] ?? 'todos';
        
        if ($estado === 'pendientes') {
            $pagos = $pagoModel->getPagosPendientes();
        } else {
            $pagos = $pagoModel->getAll();
        }
        
        $data = [
            'pagos' => $pagos,
            'estado' => $estado
        ];
        
        $this->view('pagos/index', $data);
    }
    
    public function create() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $pagoModel = $this->model('Pago');
            
            $data = [
                'residente_id' => $_POST['residente_id'],
                'concepto' => $_POST['concepto'],
                'monto' => $_POST['monto'],
                'fecha_pago' => null,
                'fecha_vencimiento' => $_POST['fecha_vencimiento'],
                'estado' => 'pendiente',
                'metodo_pago' => null
            ];
            
            if ($pagoModel->create($data)) {
                header('Location: /hhh/public/pagos');
                exit;
            }
        }
        
        $residenteModel = $this->model('Residente');
        $residentes = $residenteModel->getAll();
        
        $data = ['residentes' => $residentes];
        $this->view('pagos/create', $data);
    }
    
    public function marcarPagado() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
            $metodo_pago = $_POST['metodo_pago'];
            
            $pagoModel = $this->model('Pago');
            $pagoModel->marcarComoPagado($id, $metodo_pago);
        }
        
        header('Location: /hhh/public/pagos');
        exit;
    }
    
    public function reporte() {
        $pagoModel = $this->model('Pago');
        
        $fecha_inicio = $_GET['fecha_inicio'] ?? date('Y-m-01');
        $fecha_fin = $_GET['fecha_fin'] ?? date('Y-m-t');
        
        $reporte = $pagoModel->getReporteFinanciero($fecha_inicio, $fecha_fin);
        $pagos = $pagoModel->getAll(); // Todos los pagos para detalles
        
        $data = [
            'reporte' => $reporte,
            'pagos' => $pagos,
            'fecha_inicio' => $fecha_inicio,
            'fecha_fin' => $fecha_fin
        ];
        
        $this->view('pagos/reporte', $data);
    }
    
    public function historial() {
        $residente_id = $_GET['residente_id'] ?? null;
        
        if (!$residente_id) {
            header('Location: /hhh/public/residentes');
            exit;
        }
        
        $pagoModel = $this->model('Pago');
        $residenteModel = $this->model('Residente');
        
        $pagos = $pagoModel->getPagosPorResidente($residente_id);
        $residente = $residenteModel->getById($residente_id);
        
        $data = [
            'pagos' => $pagos,
            'residente' => $residente
        ];
        
        $this->view('pagos/historial', $data);
    }
}
?>
