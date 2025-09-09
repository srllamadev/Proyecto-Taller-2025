<?php
require_once __DIR__ . '/../../core/Model.php';

class Residente extends Model {
    protected $table = 'residentes';

    public function create($data) {
        $query = "INSERT INTO " . $this->table . " 
                  (nombre, apellido, email, telefono, unidad, fecha_ingreso, estado) 
                  VALUES (:nombre, :apellido, :email, :telefono, :unidad, :fecha_ingreso, :estado)";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':nombre', $data['nombre']);
        $stmt->bindParam(':apellido', $data['apellido']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':telefono', $data['telefono']);
        $stmt->bindParam(':unidad', $data['unidad']);
        $stmt->bindParam(':fecha_ingreso', $data['fecha_ingreso']);
        $stmt->bindParam(':estado', $data['estado']);
        
        return $stmt->execute();
    }

    public function update($id, $data) {
        $query = "UPDATE " . $this->table . " 
                  SET nombre = :nombre, apellido = :apellido, email = :email, 
                      telefono = :telefono, unidad = :unidad, estado = :estado 
                  WHERE id = :id";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':nombre', $data['nombre']);
        $stmt->bindParam(':apellido', $data['apellido']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':telefono', $data['telefono']);
        $stmt->bindParam(':unidad', $data['unidad']);
        $stmt->bindParam(':estado', $data['estado']);
        
        return $stmt->execute();
    }

    public function getByUnidad($unidad) {
        $query = "SELECT * FROM " . $this->table . " WHERE unidad = :unidad";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':unidad', $unidad);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
