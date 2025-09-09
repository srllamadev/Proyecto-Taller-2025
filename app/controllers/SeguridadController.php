<?php
require_once __DIR__ . '/../../core/Controller.php';

class SeguridadController extends Controller {
    
    public function index() {
        $auditoriaModel = $this->model('AuditoriaSeguridad');
        $accesosSospechosos = $auditoriaModel->getAccesosSospechosos();
        
        $data = ['accesosSospechosos' => $accesosSospechosos];
        $this->view('seguridad/index', $data);
    }
    
    public function auditoria() {
        $auditoriaModel = $this->model('AuditoriaSeguridad');
        
        $usuario_id = $_GET['usuario_id'] ?? null;
        $fecha_inicio = $_GET['fecha_inicio'] ?? date('Y-m-d', strtotime('-7 days'));
        $fecha_fin = $_GET['fecha_fin'] ?? date('Y-m-d');
        
        if ($usuario_id) {
            $logs = $auditoriaModel->getLogsPorUsuario($usuario_id, $fecha_inicio, $fecha_fin);
        } else {
            $logs = $auditoriaModel->getAll();
        }
        
        $residenteModel = $this->model('Residente');
        $residentes = $residenteModel->getAll();
        
        $data = [
            'logs' => $logs,
            'residentes' => $residentes,
            'usuario_id' => $usuario_id,
            'fecha_inicio' => $fecha_inicio,
            'fecha_fin' => $fecha_fin
        ];
        
        $this->view('seguridad/auditoria', $data);
    }
    
    public function videovigilancia() {
        // Simulación de sistema de videovigilancia
        $camaras = [
            [
                'id' => 1,
                'nombre' => 'Entrada Principal',
                'ubicacion' => 'Lobby',
                'estado' => 'activa',
                'url_stream' => '/streams/camera1'
            ],
            [
                'id' => 2,
                'nombre' => 'Parqueadero',
                'ubicacion' => 'Sótano 1',
                'estado' => 'activa',
                'url_stream' => '/streams/camera2'
            ],
            [
                'id' => 3,
                'nombre' => 'Azotea',
                'ubicacion' => 'Piso 10',
                'estado' => 'mantenimiento',
                'url_stream' => null
            ],
            [
                'id' => 4,
                'nombre' => 'Salón Social',
                'ubicacion' => 'Piso 1',
                'estado' => 'activa',
                'url_stream' => '/streams/camera4'
            ]
        ];
        
        $data = ['camaras' => $camaras];
        $this->view('seguridad/videovigilancia', $data);
    }
    
    public function reporteIncidente() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $auditoriaModel = $this->model('AuditoriaSeguridad');
            
            $data = [
                'usuario_id' => $_POST['usuario_id'] ?? null,
                'accion' => 'reporte_incidente',
                'ip_address' => $_SERVER['REMOTE_ADDR'],
                'user_agent' => $_SERVER['HTTP_USER_AGENT'],
                'fecha_hora' => date('Y-m-d H:i:s'),
                'detalles' => json_encode([
                    'tipo_incidente' => $_POST['tipo_incidente'],
                    'descripcion' => $_POST['descripcion'],
                    'ubicacion' => $_POST['ubicacion'],
                    'gravedad' => $_POST['gravedad']
                ])
            ];
            
            if ($auditoriaModel->registrarAcceso($data)) {
                $mensaje = "Incidente reportado correctamente. Se ha generado un registro de auditoría.";
                $this->view('seguridad/reporte_incidente', ['mensaje' => $mensaje]);
                return;
            }
        }
        
        $this->view('seguridad/reporte_incidente');
    }
    
    public function configuracion() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Aquí se guardarían las configuraciones de seguridad
            $configuraciones = [
                'intentos_maximos' => $_POST['intentos_maximos'],
                'tiempo_bloqueo' => $_POST['tiempo_bloqueo'],
                'notificaciones_email' => isset($_POST['notificaciones_email']),
                'backup_automatico' => isset($_POST['backup_automatico'])
            ];
            
            // Simular guardado de configuraciones
            $mensaje = "Configuraciones de seguridad actualizadas correctamente.";
            $data = ['mensaje' => $mensaje, 'configuraciones' => $configuraciones];
            $this->view('seguridad/configuracion', $data);
            return;
        }
        
        // Configuraciones por defecto
        $configuraciones = [
            'intentos_maximos' => 5,
            'tiempo_bloqueo' => 30,
            'notificaciones_email' => true,
            'backup_automatico' => true
        ];
        
        $data = ['configuraciones' => $configuraciones];
        $this->view('seguridad/configuracion', $data);
    }
}
?>
