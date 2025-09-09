<?php
require_once __DIR__ . '/../../core/Controller.php';

class AccesoController extends Controller {
    
    public function index() {
        $accesoModel = $this->model('AccesoControl');
        
        $fecha_inicio = $_GET['fecha_inicio'] ?? date('Y-m-d', strtotime('-7 days'));
        $fecha_fin = $_GET['fecha_fin'] ?? date('Y-m-d');
        
        $accesos = $accesoModel->getAccesosPorFecha($fecha_inicio, $fecha_fin);
        
        $data = [
            'accesos' => $accesos,
            'fecha_inicio' => $fecha_inicio,
            'fecha_fin' => $fecha_fin
        ];
        
        $this->view('acceso/index', $data);
    }
    
    public function registrar() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $accesoModel = $this->model('AccesoControl');
            
            $data = [
                'residente_id' => $_POST['residente_id'],
                'tarjeta_rfid' => $_POST['tarjeta_rfid'],
                'fecha_acceso' => date('Y-m-d H:i:s'),
                'punto_acceso' => $_POST['punto_acceso'],
                'estado' => 'autorizado'
            ];
            
            if ($accesoModel->create($data)) {
                header('Location: /hhh/public/acceso');
                exit;
            }
        }
        
        $residenteModel = $this->model('Residente');
        $residentes = $residenteModel->getAll();
        
        $data = ['residentes' => $residentes];
        $this->view('acceso/registrar', $data);
    }
    
    public function validar() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $accesoModel = $this->model('AccesoControl');
            $auditoria = $this->model('AuditoriaSeguridad');
            
            $tarjeta_rfid = $_POST['tarjeta_rfid'];
            $residente = $accesoModel->validarAcceso($tarjeta_rfid);
            
            $response = ['status' => 'denied', 'message' => 'Acceso denegado'];
            
            if ($residente) {
                // Registrar acceso exitoso
                $accesoModel->create([
                    'residente_id' => $residente['id'],
                    'tarjeta_rfid' => $tarjeta_rfid,
                    'fecha_acceso' => date('Y-m-d H:i:s'),
                    'punto_acceso' => $_POST['punto_acceso'] ?? 'Principal',
                    'estado' => 'autorizado'
                ]);
                
                $response = [
                    'status' => 'granted',
                    'message' => 'Acceso autorizado',
                    'residente' => $residente['nombre'] . ' ' . $residente['apellido'],
                    'unidad' => $residente['unidad']
                ];
            }
            
            // Registrar en auditoría
            $auditoria->registrarAcceso([
                'usuario_id' => $residente['id'] ?? null,
                'accion' => $residente ? 'acceso_autorizado' : 'acceso_denegado',
                'ip_address' => $_SERVER['REMOTE_ADDR'],
                'user_agent' => $_SERVER['HTTP_USER_AGENT'],
                'fecha_hora' => date('Y-m-d H:i:s'),
                'detalles' => json_encode(['tarjeta_rfid' => $tarjeta_rfid])
            ]);
            
            header('Content-Type: application/json');
            echo json_encode($response);
            exit;
        }
        
        $this->view('acceso/validar');
    }
}
?>
