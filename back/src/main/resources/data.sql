-- === TECHNICIANS ===
INSERT INTO technician (id, username, password, name, surnames)
VALUES
    (1, 'tecnico1', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrYVJY52G5YdXZ6kMvT.FQCv/qjAZG2', 'Carlos', 'López García'),
    (2, 'tecnico2', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrYVJY52G5YdXZ6kMvT.FQCv/qjAZG2', 'Laura', 'García Martínez'),
    (3, 'tecnico3', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrYVJY52G5YdXZ6kMvT.FQCv/qjAZG2', 'Miguel', 'Fernández Ruiz'),
    (4, 'tecnico4', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrYVJY52G5YdXZ6kMvT.FQCv/qjAZG2', 'Sofía', 'Rodríguez Pérez');

-- === COMMUNITIES ===
INSERT INTO community (id, name, description, CIF, localization, info_community_leader)
VALUES
    (1, 'Residencial Las Rosas', 'Edificio residencial de 10 plantas', 'A12345678', '40.4168,-3.7038', 'Presidente: Juan Pérez - Tel: 600111222'),
    (2, 'Torre Barcelona', 'Torre de oficinas de 15 plantas', 'B87654321', '41.3851,2.1734', 'Presidenta: Ana Ruiz - Tel: 600222333'),
    (3, 'Complejo Vallecas', 'Conjunto de 3 edificios residenciales', 'C11223344', '40.3925,-3.6497', 'Presidente: Luis Gómez - Tel: 600333444'),
    (4, 'Edificio Diagonal', 'Edificio emblemático en Barcelona', 'D44332211', '41.3979,2.1604', 'Presidente: Marta Vidal - Tel: 600444555');

-- === ELEVATORS ===
INSERT INTO elevator (id, rae, instalation_year, community_id)
VALUES
    (1, 'RAE001', 2015, 1),
    (2, 'RAE002', 2018, 1),
    (3, 'RAE003', 2020, 2),
    (4, 'RAE004', 2017, 3),
    (5, 'RAE005', 2019, 3),
    (6, 'RAE006', 2021, 4);

-- === COMMON MISTAKES ===
INSERT INTO common_mistakes (id, identificator, description)
VALUES
    (1, 'CM001', 'Fallo en el panel de control'),
    (2, 'CM002', 'Ruidos anómalos en el motor'),
    (3, 'CM003', 'Puerta no se cierra correctamente'),
    (4, 'CM004', 'Iluminación interior defectuosa'),
    (5, 'CM005', 'Botones de llamada no responden'),
    (6, 'CM006', 'Ascensor se detiene entre plantas');

-- === MAINTENANCE RULES ===
INSERT INTO maintenance_rules (id, name, description, order_num, maintenance_type)
VALUES
    (1, 'Revisión mensual', 'Comprobar funcionamiento general', 1, 'MONTHLY'),
    (2, 'Lubricación', 'Lubricar piezas móviles', 2, 'BIANNUAL'),
    (3, 'Revisión anual completa', 'Revisión exhaustiva de todos los componentes', 3, 'ANNUAL'),
    (4, 'Comprobación de seguridad', 'Verificar sistemas de emergencia', 4, 'BIANNUAL'),
    (5, 'Limpieza general', 'Limpieza profunda de cabina y mecanismos', 5, 'BIANNUAL');

-- === MAINTENANCE REPORTS ===
INSERT INTO maintenance_report (id, start_date, end_date, commentary, technician_id, elevator_id)
VALUES
    (1, '2025-01-15 09:00:00', '2025-01-15 11:30:00', 'Revisión mensual rutinaria - Todo correcto', 1, 1),
    (2, '2025-01-16 10:00:00', '2025-01-16 12:45:00', 'Lubricación realizada - Se detectó desgaste en rodamientos', 2, 2),
    (3, '2025-02-10 08:30:00', '2025-02-10 16:00:00', 'Revisión anual completa - Cambiados 3 componentes', 3, 3),
    (4, '2025-02-12 09:15:00', '2025-02-12 10:30:00', 'Comprobación de seguridad - Sistemas OK', 4, 4),
    (5, '2025-03-05 11:00:00', '2025-03-05 13:20:00', 'Limpieza general - Cabina en buen estado', 1, 5);

-- === INCIDENT REPORTS ===
INSERT INTO incident_report (id, start_date, end_date, commentary, technician_id, elevator_id)
VALUES
    (1, '2025-01-20 15:30:00', '2025-01-20 17:45:00', 'Panel de control no respondía - Reemplazado módulo principal', 1, 1),
    (2, '2025-02-03 08:00:00', '2025-02-03 10:30:00', 'Ruidos en motor - Ajustados componentes mecánicos', 2, 2),
    (3, '2025-02-18 14:15:00', '2025-02-18 15:30:00', 'Puerta atascada - Realineado mecanismo', 3, 3),
    (4, '2025-03-10 16:45:00', '2025-03-10 18:00:00', 'Botones no funcionaban - Reemplazada placa de control', 4, 4),
    (5, '2025-03-15 09:30:00', NULL, 'Ascensor detenido entre plantas - Pendiente diagnóstico completo', 1, 5);
