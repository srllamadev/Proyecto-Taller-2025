<?php
require_once __DIR__ . '/../../core/Model.php';

class AuditoriaSeguridad extends Model {
    protected $table = 'auditoria_seguridad';

    public function registrarAcceso($data) {
        $query = "INSERT INTO " . $this->table . " 
                  (usuario_id, accion, ip_address, user_agent, fecha_hora, detalles) 
                  VALUES (:usuario_id, :accion, :ip_address, :user_agent, :fecha_hora, :detalles)";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':usuario_id', $data['usuario_id']);
        $stmt->bindParam(':accion', $data['accion']);
        $stmt->bindParam(':ip_address', $data['ip_address']);
        $stmt->bindParam(':user_agent', $data['user_agent']);
        $stmt->bindParam(':fecha_hora', $data['fecha_hora']);
        $stmt->bindParam(':detalles', $data['detalles']);
        
        return $stmt->execute();
    }

    public function getLogsPorUsuario($usuario_id, $fecha_inicio = null, $fecha_fin = null) {
        $query = "SELECT * FROM " . $this->table . " WHERE usuario_id = :usuario_id";
        
        if ($fecha_inicio && $fecha_fin) {
            $query .= " AND fecha_hora BETWEEN :fecha_inicio AND :fecha_fin";
        }
        
        $query .= " ORDER BY fecha_hora DESC";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':usuario_id', $usuario_id);
        
        if ($fecha_inicio && $fecha_fin) {
            $stmt->bindParam(':fecha_inicio', $fecha_inicio);
            $stmt->bindParam(':fecha_fin', $fecha_fin);
        }
        
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAccesosSospechosos() {
        $query = "SELECT 
                    ip_address, 
                    COUNT(*) as intentos,
                    MAX(fecha_hora) as ultimo_intento
                  FROM " . $this->table . " 
                  WHERE accion = 'login_fallido' 
                  AND fecha_hora >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
                  GROUP BY ip_address
                  HAVING intentos >= 5
                  ORDER BY intentos DESC";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
