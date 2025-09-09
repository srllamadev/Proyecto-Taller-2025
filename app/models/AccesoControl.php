<?php
require_once __DIR__ . '/../../core/Model.php';

class AccesoControl extends Model {
    protected $table = 'control_acceso';

    public function create($data) {
        $query = "INSERT INTO " . $this->table . " 
                  (residente_id, tarjeta_rfid, fecha_acceso, punto_acceso, estado) 
                  VALUES (:residente_id, :tarjeta_rfid, :fecha_acceso, :punto_acceso, :estado)";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':residente_id', $data['residente_id']);
        $stmt->bindParam(':tarjeta_rfid', $data['tarjeta_rfid']);
        $stmt->bindParam(':fecha_acceso', $data['fecha_acceso']);
        $stmt->bindParam(':punto_acceso', $data['punto_acceso']);
        $stmt->bindParam(':estado', $data['estado']);
        
        return $stmt->execute();
    }

    public function getAccesosPorFecha($fecha_inicio, $fecha_fin) {
        $query = "SELECT ca.*, r.nombre, r.apellido, r.unidad 
                  FROM " . $this->table . " ca 
                  JOIN residentes r ON ca.residente_id = r.id 
                  WHERE ca.fecha_acceso BETWEEN :fecha_inicio AND :fecha_fin 
                  ORDER BY ca.fecha_acceso DESC";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':fecha_inicio', $fecha_inicio);
        $stmt->bindParam(':fecha_fin', $fecha_fin);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function validarAcceso($tarjeta_rfid) {
        $query = "SELECT r.* FROM residentes r 
                  JOIN " . $this->table . " ca ON r.id = ca.residente_id 
                  WHERE ca.tarjeta_rfid = :tarjeta_rfid AND r.estado = 'activo'";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':tarjeta_rfid', $tarjeta_rfid);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
