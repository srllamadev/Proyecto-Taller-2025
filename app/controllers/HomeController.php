<?php
require_once __DIR__ . '/../../core/Controller.php';

class HomeController extends Controller {
    
    public function index() {
        // Dashboard principal
        $residenteModel = $this->model('Residente');
        $pagoModel = $this->model('Pago');
        $comunicacionModel = $this->model('Comunicacion');
        
        $totalResidentes = count($residenteModel->getAll());
        $pagosPendientes = count($pagoModel->getPagosPendientes());
        $anuncios = $comunicacionModel->getAnuncios();
        
        $data = [
            'totalResidentes' => $totalResidentes,
            'pagosPendientes' => $pagosPendientes,
            'anuncios' => array_slice($anuncios, 0, 5) // Solo los últimos 5
        ];
        
        $this->view('home/index', $data);
    }
}
?>
