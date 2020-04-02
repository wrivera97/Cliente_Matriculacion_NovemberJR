SELECT
  asignaturas.nombre,
  asignaturas.id,
  docente_asignaturas.docente_id
FROM asignaturas
JOIN docente_asignaturas ON asignaturas.id = docente_asignaturas.asignatura_id

select * from asignaturas
where asignaturas.id=16

