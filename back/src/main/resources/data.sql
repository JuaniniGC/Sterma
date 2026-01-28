-- === TECHNICIANS ===
INSERT INTO technician (id, username, password, name, surnames, role)
VALUES
    (101, 'tecnico1', '$2a$10$VsE1b6gM3V5zliIyWiGIm.sb/.5q7BdHpYXfamV1bZyNVgSUhwZ0i', 'Carlos', 'López García', 'TECHNICIAN'),
    (102, 'tecnico2', '$2a$10$VsE1b6gM3V5zliIyWiGIm.sb/.5q7BdHpYXfamV1bZyNVgSUhwZ0i', 'Laura', 'García Martínez', 'TECHNICIAN'),
    (103, 'tecnico3', '$2a$10$VsE1b6gM3V5zliIyWiGIm.sb/.5q7BdHpYXfamV1bZyNVgSUhwZ0i', 'Miguel', 'Fernández Ruiz', 'TECHNICIAN'),
    (104, 'tecnico4', '$2a$10$VsE1b6gM3V5zliIyWiGIm.sb/.5q7BdHpYXfamV1bZyNVgSUhwZ0i', 'Sofía', 'Rodríguez Pérez', 'MANAGEMENT');

-- === COMMUNITIES ===
INSERT INTO community (
    id, name, description, CIF,
    city, street, postal_code,
    community_leader_name, community_leader_telephone, community_leader_note
)
VALUES
    (101, 'Residencial Las Rosas', 'Edificio residencial de 10 plantas', 'A12345678',
     'Madrid', 'Calle Falsa 123', '28001',
     'Juan Pérez', '600111222', 'Presidente'),

    (102, 'Torre Barcelona', 'Torre de oficinas de 15 plantas', 'B87654321',
     'Barcelona', 'Gran Vía 456', '08001',
     'Ana Ruiz', '600222333', 'Presidenta'),

    (103, 'Complejo Vallecas', 'Conjunto de 3 edificios residenciales', 'C11223344',
     'Madrid', 'Av. Vallecas 789', '28031',
     'Luis Gómez', '600333444', 'Presidente'),

    (104, 'Edificio Diagonal', 'Edificio emblemático en Barcelona', 'D44332211',
     'Barcelona', 'Diagonal 101', '08011',
     'Marta Vidal', '600444555', 'Presidenta');

-- === ELEVATORS ===
INSERT INTO elevator (id, rae, instalation_year, community_id)
VALUES
    (101, 'RAE001', 2015, 101),
    (102, 'RAE002', 2018, 101),
    (103, 'RAE003', 2020, 102),
    (104, 'RAE004', 2017, 103),
    (105, 'RAE005', 2019, 103),
    (106, 'RAE006', 2021, 104),
    (107, 'RAE007', 2014, 101),
    (108, 'RAE008', 2016, 101),
    (109, 'RAE009', 2017, 102),
    (110, 'RAE010', 2022, 102),
    (111, 'RAE011', 2013, 103),
    (112, 'RAE012', 2015, 103),
    (113, 'RAE013', 2023, 103),
    (114, 'RAE014', 2018, 104),
    (115, 'RAE015', 2019, 104),
    (116, 'RAE016', 2022, 104),
    (117, 'RAE017', 2024, 104);

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
INSERT INTO maintenance_report (id, start_date, end_date, commentary, technician_id, elevator_id, maintenance_type)
VALUES
    (101, '2025-01-15 09:00:00', '2025-01-15 11:30:00', 'Revisión mensual rutinaria - Todo correcto', 101, 101, 'MONTHLY'),
    (102, '2025-01-16 10:00:00', '2025-01-16 12:45:00', 'Lubricación realizada - Se detectó desgaste en rodamientos', 102, 102, 'BIANNUAL'),
    (103, '2025-02-10 08:30:00', '2025-02-10 16:00:00', 'Revisión anual completa - Cambiados 3 componentes', 103, 103, 'ANNUAL'),
    (104, '2025-02-12 09:15:00', '2025-02-12 10:30:00', 'Comprobación de seguridad - Sistemas OK', 101, 104, 'MONTHLY'),
    (105, '2025-03-05 11:00:00', '2025-03-05 13:20:00', 'Limpieza general - Cabina en buen estado', 101, 105, 'BIANNUAL'),
    (106, '2025-03-20 14:00:00', '2025-03-20 17:30:00', 'Revisión semestral completa', 102, 101, 'BIANNUAL'),
    (107, '2025-04-01 08:00:00', '2025-04-01 09:15:00', 'Revisión mensual rápida', 103, 102, 'MONTHLY'),
    (108, '2025-06-15 07:30:00', '2025-06-15 15:45:00', 'Mantenimiento anual exhaustivo', 101, 103, 'ANNUAL'),
    (109, '2025-05-10 09:00:00', '2025-05-10 12:00:00', 'Revisión mensual rutinaria', 101, 101, 'MONTHLY'),
    (110, '2024-11-22 08:00:00', '2024-11-22 10:15:00', 'Lubricación de mecanismos principales', 102, 101, 'BIANNUAL'),
    (111, '2024-07-03 09:30:00', '2024-07-03 17:00:00', 'Revisión anual completa sin incidencias', 103, 101, 'ANNUAL'),
    (112, '2025-03-12 07:45:00', '2025-03-12 09:55:00', 'Revisión mensual programada', 104, 102, 'MONTHLY'),
    (113, '2024-10-14 10:00:00', '2024-10-14 12:30:00', 'Lubricación semestral - rodamientos aceptables', 102, 102, 'BIANNUAL'),
    (114, '2024-04-18 08:20:00', '2024-04-18 16:45:00', 'Revisión anual exhaustiva - reemplazo de cables', 103, 102, 'ANNUAL'),
    (115, '2025-05-22 10:00:00', '2025-05-22 11:10:00', 'Revisión mensual sin incidencias', 101, 103, 'MONTHLY'),
    (116, '2024-09-02 09:00:00', '2024-09-02 12:00:00', 'Lubricación biannual', 104, 103, 'BIANNUAL'),
    (117, '2024-12-15 08:00:00', '2024-12-15 16:00:00', 'Revisión anual general', 103, 103, 'ANNUAL'),
    (118, '2024-03-10 09:30:00', '2024-03-10 11:00:00', 'Verificación mensual', 101, 103, 'MONTHLY'),
    (119, '2025-04-11 10:10:00', '2025-04-11 12:00:00', 'Revisión mensual correcta', 102, 104, 'MONTHLY'),
    (120, '2024-08-30 09:00:00', '2024-08-30 12:30:00', 'Lubricación general', 101, 104, 'BIANNUAL'),
    (121, '2024-06-01 08:00:00', '2024-06-01 16:00:00', 'Revisión anual completa - sustitución de frenos', 104, 104, 'ANNUAL'),
    (122, '2025-01-25 07:30:00', '2025-01-25 09:45:00', 'Revisión mensual sin hallazgos', 103, 104, 'MONTHLY'),
    (123, '2025-02-19 08:30:00', '2025-02-19 10:20:00', 'Revisión mensual rutinaria', 101, 105, 'MONTHLY'),
    (124, '2024-10-01 09:00:00', '2024-10-01 13:00:00', 'Lubricación de cableado', 102, 105, 'BIANNUAL'),
    (125, '2024-05-20 08:00:00', '2024-05-20 15:00:00', 'Revisión anual total', 103, 105, 'ANNUAL'),
    (126, '2024-03-11 10:30:00', '2024-03-11 12:00:00', 'Revisión mensual', 104, 105, 'MONTHLY'),
    (127, '2025-04-08 08:30:00', '2025-04-08 10:00:00', 'Revisión mensual correcta', 101, 106, 'MONTHLY'),
    (128, '2024-09-21 09:00:00', '2024-09-21 13:00:00', 'Lubricación semestral - ajuste de guías', 103, 106, 'BIANNUAL'),
    (129, '2024-12-10 07:30:00', '2024-12-10 15:45:00', 'Revisión anual completa', 102, 106, 'ANNUAL'),
    (130, '2024-03-29 11:00:00', '2024-03-29 12:30:00', 'Revisión mensual', 104, 106, 'MONTHLY'),
    (131, '2025-03-18 08:00:00', '2025-03-18 10:15:00', 'Control mensual de seguridad', 101, 107, 'MONTHLY'),
    (132, '2024-11-08 09:00:00', '2024-11-08 12:00:00', 'Lubricación y ajuste', 102, 107, 'BIANNUAL'),
    (133, '2024-04-14 08:00:00', '2024-04-14 09:40:00', 'Revisión mensual', 101, 108, 'MONTHLY'),
    (134, '2025-05-20 07:45:00', '2025-05-20 14:30:00', 'Revisión anual completa', 103, 108, 'ANNUAL'),
    (135, '2024-10-25 09:10:00', '2024-10-25 12:20:00', 'Lubricación general', 104, 108, 'BIANNUAL'),
    (136, '2024-02-11 08:20:00', '2024-02-11 10:30:00', 'Revisión mensual', 102, 109, 'MONTHLY'),
    (137, '2024-09-15 09:00:00', '2024-09-15 12:45:00', 'Lubricación de ejes', 101, 109, 'BIANNUAL'),
    (138, '2025-01-10 07:00:00', '2025-01-10 15:00:00', 'Revisión anual', 104, 109, 'ANNUAL'),
    (139, '2024-03-05 10:00:00', '2024-03-05 11:40:00', 'Verificación mensual', 101, 110, 'MONTHLY'),
    (140, '2025-04-29 09:00:00', '2025-04-29 12:00:00', 'Lubricación biannual', 103, 110, 'BIANNUAL'),
    (141, '2024-06-14 08:30:00', '2024-06-14 10:00:00', 'Revisión mensual', 102, 111, 'MONTHLY'),
    (142, '2025-03-03 09:00:00', '2025-03-03 15:00:00', 'Revisión anual - ajustes importantes', 101, 111, 'ANNUAL'),
    (143, '2024-12-06 08:00:00', '2024-12-06 11:15:00', 'Lubricación general', 104, 111, 'BIANNUAL'),
    (144, '2025-02-14 08:00:00', '2025-02-14 09:45:00', 'Control mensual', 104, 112, 'MONTHLY'),
    (145, '2024-08-20 09:00:00', '2024-08-20 13:00:00', 'Lubricación semestral', 102, 112, 'BIANNUAL'),
    (146, '2024-05-18 09:00:00', '2024-05-18 10:30:00', 'Revisión mensual', 101, 113, 'MONTHLY'),
    (147, '2024-11-17 08:00:00', '2024-11-17 15:30:00', 'Revisión anual exhaustiva', 103, 113, 'ANNUAL'),
    (148, '2025-02-20 09:00:00', '2025-02-20 12:30:00', 'Lubricación general', 104, 113, 'BIANNUAL'),
    (149, '2024-04-21 08:10:00', '2024-04-21 09:50:00', 'Revisión mensual', 101, 114, 'MONTHLY'),
    (150, '2025-03-28 09:00:00', '2025-03-28 12:20:00', 'Lubricación', 104, 114, 'BIANNUAL'),
    (151, '2024-10-09 07:30:00', '2024-10-09 15:00:00', 'Revisión anual', 102, 114, 'ANNUAL'),
    (152, '2025-01-14 08:00:00', '2025-01-14 09:40:00', 'Revisión mensual', 101, 115, 'MONTHLY'),
    (153, '2024-09-11 09:00:00', '2024-09-11 12:40:00', 'Lubricación general', 102, 115, 'BIANNUAL'),
    (154, '2024-06-02 08:00:00', '2024-06-02 09:50:00', 'Revisión mensual', 104, 116, 'MONTHLY'),
    (155, '2025-04-04 07:30:00', '2025-04-04 15:20:00', 'Revisión anual completa', 102, 116, 'ANNUAL'),
    (156, '2024-11-26 09:00:00', '2024-11-26 12:00:00', 'Lubricación profunda', 103, 116, 'BIANNUAL'),
    (157, '2025-02-01 09:00:00', '2025-02-01 10:20:00', 'Revisión mensual', 101, 117, 'MONTHLY'),
    (158, '2024-07-22 08:00:00', '2024-07-22 15:00:00', 'Revisión anual - todo correcto', 104, 117, 'ANNUAL');


-- === INCIDENT REPORTS ===
INSERT INTO incident_report (id, start_date, end_date, commentary, technician_id, elevator_id)
VALUES
    (101, '2025-01-20 15:30:00', '2025-01-20 17:45:00', 'Panel de control no respondía - Reemplazado módulo principal', 101, 101),
    (102, '2025-02-03 08:00:00', '2025-02-03 10:30:00', 'Ruidos en motor - Ajustados componentes mecánicos', 102, 102),
    (103, '2025-02-18 14:15:00', '2025-02-18 15:30:00', 'Puerta atascada - Realineado mecanismo', 103, 103),
    (104, '2025-03-10 16:45:00', '2025-03-10 18:00:00', 'Botones no funcionaban - Reemplazada placa de control', 104, 104),
    (105, '2025-03-15 09:30:00', NULL, 'Ascensor detenido entre plantas - Pendiente diagnóstico completo', 101, 105);

