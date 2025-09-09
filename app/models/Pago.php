<?php
require_once __DIR__ . '/../../core/Model.php';

class Pago extends Model {
    protected $table = 'pagos';

    public function create($data) {
        $query = "INSERT INTO " . $this->table . " 
                  (residente_id, concepto, monto, fecha_pago, fecha_vencimiento, estado, metodo_pago) 
                  VALUES (:residente_id, :concepto, :monto, :fecha_pago, :fecha_vencimiento, :estado, :metodo_pago)";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':residente_id', $data['residente_id']);
        $stmt->bindParam(':concepto', $data['concepto']);
        $stmt->bindParam(':monto', $data['monto']);
        $stmt->bindParam(':fecha_pago', $data['fecha_pago']);
        $stmt->bindParam(':fecha_vencimiento', $data['fecha_vencimiento']);
        $stmt->bindParam(':estado', $data['estado']);
        $stmt->bindParam(':metodo_pago', $data['metodo_pago']);
        
        return $stmt->execute();
    }

    public function getPagosPorResidente($residente_id) {
        $query = "SELECT * FROM " . $this->table . " WHERE residente_id = :residente_id ORDER BY fecha_pago DESC";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':residente_id', $residente_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getPagosPendientes() {
        $query = "SELECT p.*, r.nombre, r.apellido, r.unidad 
                  FROM " . $this->table . " p 
                  JOIN residentes r ON p.residente_id = r.id 
                  WHERE p.estado = 'pendiente' AND p.fecha_vencimiento < NOW()";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function marcarComoPagado($id, $metodo_pago) {
        $query = "UPDATE " . $this->table . " 
                  SET estado = 'pagado', fecha_pago = NOW(), metodo_pago = :metodo_pago 
                  WHERE id = :id";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':metodo_pago', $metodo_pago);
        
        return $stmt->execute();
    }

    public function getReporteFinanciero($fecha_inicio, $fecha_fin) {
        $query = "SELECT 
                    SUM(CASE WHEN estado = 'pagado' THEN monto ELSE 0 END) as total_cobrado,
                    SUM(CASE WHEN estado = 'pendiente' THEN monto ELSE 0 END) as total_pendiente,
                    COUNT(*) as total_facturas
                  FROM " . $this->table . " 
                  WHERE fecha_vencimiento BETWEEN :fecha_inicio AND :fecha_fin";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':fecha_inicio', $fecha_inicio);
        $stmt->bindParam(':fecha_fin', $fecha_fin);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
