<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $title ?? 'Sistema de Administración de Edificio' ?></title>
</head>
<body>
    <header>
        <h1>Sistema de Administración de Edificio</h1>
        <nav>
            <ul>
                <li><a href="/hhh/public/">Dashboard</a></li>
                <li><a href="/hhh/public/residentes">Residentes</a></li>
                <li><a href="/hhh/public/acceso">Control de Acceso</a></li>
                <li><a href="/hhh/public/pagos">Pagos</a></li>
                <li><a href="/hhh/public/consumo">Consumo Energético</a></li>
                <li><a href="/hhh/public/comunicacion">Comunicación</a></li>
                <li><a href="/hhh/public/seguridad">Seguridad</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <?= $content ?>
    </main>
    
    <footer>
        <p>&copy; 2025 Sistema de Administración de Edificio</p>
    </footer>
</body>
</html>
