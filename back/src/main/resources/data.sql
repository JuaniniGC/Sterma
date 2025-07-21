-- === TECHNICIANS ===
INSERT INTO technician (id, username, password, name, surnames)
VALUES
    (101, 'tecnico1', '$2a$10$VsE1b6gM3V5zliIyWiGIm.sb/.5q7BdHpYXfamV1bZyNVgSUhwZ0i', 'Carlos', 'López García'),
    (102, 'tecnico2', '$2a$10$VsE1b6gM3V5zliIyWiGIm.sb/.5q7BdHpYXfamV1bZyNVgSUhwZ0i', 'Laura', 'García Martínez'),
    (103, 'tecnico3', '$2a$10$VsE1b6gM3V5zliIyWiGIm.sb/.5q7BdHpYXfamV1bZyNVgSUhwZ0i', 'Miguel', 'Fernández Ruiz'),
    (104, 'tecnico4', '$2a$10$VsE1b6gM3V5zliIyWiGIm.sb/.5q7BdHpYXfamV1bZyNVgSUhwZ0i', 'Sofía', 'Rodríguez Pérez');

-- === COMMUNITIES ===
INSERT INTO community (id, name, description, CIF, localization, info_community_leader)
VALUES
    (101, 'Residencial Las Rosas', 'Edificio residencial de 10 plantas', 'A12345678', '40.4168,-3.7038', 'Presidente: Juan Pérez - Tel: 600111222'),
    (102, 'Torre Barcelona', 'Torre de oficinas de 15 plantas', 'B87654321', '41.3851,2.1734', 'Presidenta: Ana Ruiz - Tel: 600222333'),
    (103, 'Complejo Vallecas', 'Conjunto de 3 edificios residenciales', 'C11223344', '40.3925,-3.6497', 'Presidente: Luis Gómez - Tel: 600333444'),
    (104, 'Edificio Diagonal', 'Edificio emblemático en Barcelona', 'D44332211', '41.3979,2.1604', 'Presidente: Marta Vidal - Tel: 600444555');

-- === ELEVATORS ===
INSERT INTO elevator (id, rae, instalation_year, community_id)
VALUES
    (101, 'RAE001', 2015, 101),
    (102, 'RAE002', 2018, 101),
    (103, 'RAE003', 2020, 102),
    (104, 'RAE004', 2017, 103),
    (105, 'RAE005', 2019, 103),
    (106, 'RAE006', 2021, 104);

-- === COMMON MISTAKES ===
INSERT INTO common_mistakes (id, identificator, description)
VALUES
    (101, 'CM001', 'Fallo en el panel de control'),
    (102, 'CM002', 'Ruidos anómalos en el motor'),
    (103, 'CM003', 'Puerta no se cierra correctamente'),
    (104, 'CM004', 'Iluminación interior defectuosa'),
    (105, 'CM005', 'Botones de llamada no responden'),
    (106, 'CM006', 'Ascensor se detiene entre plantas');

-- === MAINTENANCE RULES ===
INSERT INTO maintenance_rules (id, name, description, order_num, maintenance_type)
VALUES
    (101, 'Revisión mensual', 'Comprobar funcionamiento general', 1, 'MONTHLY'),
    (102, 'Lubricación', 'Lubricar piezas móviles', 2, 'BIANNUAL'),
    (103, 'Revisión anual completa', 'Revisión exhaustiva de todos los componentes', 3, 'ANNUAL'),
    (104, 'Comprobación de seguridad', 'Verificar sistemas de emergencia', 4, 'BIANNUAL'),
    (105, 'Limpieza general', 'Limpieza profunda de cabina y mecanismos', 5, 'BIANNUAL');

-- === MAINTENANCE REPORTS ===
INSERT INTO maintenance_report (id, start_date, end_date, commentary, technician_id, elevator_id)
VALUES
    (101, '2025-01-15 09:00:00', '2025-01-15 11:30:00', 'Revisión mensual rutinaria - Todo correcto', 101, 101),
    (102, '2025-01-16 10:00:00', '2025-01-16 12:45:00', 'Lubricación realizada - Se detectó desgaste en rodamientos', 102, 102),
    (103, '2025-02-10 08:30:00', '2025-02-10 16:00:00', 'Revisión anual completa - Cambiados 3 componentes', 103, 103),
    (104, '2025-02-12 09:15:00', '2025-02-12 10:30:00', 'Comprobación de seguridad - Sistemas OK', 101, 104),
    (105, '2025-03-05 11:00:00', '2025-03-05 13:20:00', 'Limpieza general - Cabina en buen estado', 101, 105);

-- === INCIDENT REPORTS ===
INSERT INTO incident_report (id, start_date, end_date, commentary, technician_id, elevator_id)
VALUES
    (101, '2025-01-20 15:30:00', '2025-01-20 17:45:00', 'Panel de control no respondía - Reemplazado módulo principal', 101, 101),
    (102, '2025-02-03 08:00:00', '2025-02-03 10:30:00', 'Ruidos en motor - Ajustados componentes mecánicos', 102, 102),
    (103, '2025-02-18 14:15:00', '2025-02-18 15:30:00', 'Puerta atascada - Realineado mecanismo', 103, 103),
    (104, '2025-03-10 16:45:00', '2025-03-10 18:00:00', 'Botones no funcionaban - Reemplazada placa de control', 104, 104),
    (105, '2025-03-15 09:30:00', NULL, 'Ascensor detenido entre plantas - Pendiente diagnóstico completo', 101, 105);
