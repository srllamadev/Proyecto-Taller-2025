<?php
require_once __DIR__ . '/../../core/Model.php';

class ConsumoEnergetico extends Model {
    protected $table = 'consumo_energetico';

    public function create($data) {
        $query = "INSERT INTO " . $this->table . " 
                  (unidad, fecha_lectura, consumo_kwh, costo, tipo_medicion) 
                  VALUES (:unidad, :fecha_lectura, :consumo_kwh, :costo, :tipo_medicion)";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':unidad', $data['unidad']);
        $stmt->bindParam(':fecha_lectura', $data['fecha_lectura']);
        $stmt->bindParam(':consumo_kwh', $data['consumo_kwh']);
        $stmt->bindParam(':costo', $data['costo']);
        $stmt->bindParam(':tipo_medicion', $data['tipo_medicion']);
        
        return $stmt->execute();
    }

    public function getConsumoPorUnidad($unidad, $fecha_inicio = null, $fecha_fin = null) {
        $query = "SELECT * FROM " . $this->table . " WHERE unidad = :unidad";
        
        if ($fecha_inicio && $fecha_fin) {
            $query .= " AND fecha_lectura BETWEEN :fecha_inicio AND :fecha_fin";
        }
        
        $query .= " ORDER BY fecha_lectura DESC";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':unidad', $unidad);
        
        if ($fecha_inicio && $fecha_fin) {
            $stmt->bindParam(':fecha_inicio', $fecha_inicio);
            $stmt->bindParam(':fecha_fin', $fecha_fin);
        }
        
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getPromedioConsumo($unidad, $meses = 3) {
        $query = "SELECT AVG(consumo_kwh) as promedio_consumo 
                  FROM " . $this->table . " 
                  WHERE unidad = :unidad 
                  AND fecha_lectura >= DATE_SUB(NOW(), INTERVAL :meses MONTH)";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':unidad', $unidad);
        $stmt->bindParam(':meses', $meses);
        $stmt->execute();
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['promedio_consumo'] ?? 0;
    }

    public function getConsumoPorPiso($piso) {
        $query = "SELECT 
                    unidad,
                    SUM(consumo_kwh) as total_consumo,
                    SUM(costo) as total_costo,
                    AVG(consumo_kwh) as promedio_consumo
                  FROM " . $this->table . " 
                  WHERE unidad LIKE :piso 
                  AND MONTH(fecha_lectura) = MONTH(NOW())
                  GROUP BY unidad";
        
        $stmt = $this->db->prepare($query);
        $piso_pattern = $piso . '%';
        $stmt->bindParam(':piso', $piso_pattern);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getHuellaEnergetica($unidad) {
        $query = "SELECT 
                    DATE(fecha_lectura) as fecha,
                    SUM(consumo_kwh) as consumo_diario,
                    tipo_medicion
                  FROM " . $this->table . " 
                  WHERE unidad = :unidad 
                  AND fecha_lectura >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                  GROUP BY DATE(fecha_lectura), tipo_medicion
                  ORDER BY fecha_lectura DESC";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':unidad', $unidad);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
