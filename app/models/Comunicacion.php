<?php
require_once __DIR__ . '/../../core/Model.php';

class Comunicacion extends Model {
    protected $table = 'comunicaciones';

    public function create($data) {
        $query = "INSERT INTO " . $this->table . " 
                  (titulo, mensaje, tipo, fecha_creacion, autor, destinatario, estado) 
                  VALUES (:titulo, :mensaje, :tipo, :fecha_creacion, :autor, :destinatario, :estado)";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':titulo', $data['titulo']);
        $stmt->bindParam(':mensaje', $data['mensaje']);
        $stmt->bindParam(':tipo', $data['tipo']);
        $stmt->bindParam(':fecha_creacion', $data['fecha_creacion']);
        $stmt->bindParam(':autor', $data['autor']);
        $stmt->bindParam(':destinatario', $data['destinatario']);
        $stmt->bindParam(':estado', $data['estado']);
        
        return $stmt->execute();
    }

    public function getAnuncios() {
        $query = "SELECT * FROM " . $this->table . " 
                  WHERE tipo = 'anuncio' AND estado = 'activo' 
                  ORDER BY fecha_creacion DESC";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getMensajesPorResidente($residente_id) {
        $query = "SELECT * FROM " . $this->table . " 
                  WHERE destinatario = :residente_id OR destinatario IS NULL 
                  ORDER BY fecha_creacion DESC";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':residente_id', $residente_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function marcarComoLeido($id) {
        $query = "UPDATE " . $this->table . " SET estado = 'leido' WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
?>
