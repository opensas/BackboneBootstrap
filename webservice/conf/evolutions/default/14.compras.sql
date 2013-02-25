# --- First database schema

# --- !Ups

INSERT INTO Menu VALUES
  (01, 'menu', null, 01, 'Inicio',                    '', '/',              '', '#Menu.Inicio', true) ,

  (10, 'menu', null, 02, 'Proveedores',               '', '#',              '',               '#Menu.Proveedores', true) ,
  (11, 'menu', 10,   01, 'Proveedores',               '', 'Proveedor',      '',               '#Menu.Proveedores', true) ,
  (12, 'menu', 10,   02, 'Abm Proveedores',           '', 'AbmProveedor',   '',               '#Menu.Abm Proveedores', true) ,
  (13, 'sep',  10,   03, '-',                         '', '',               '',               '', true) ,
  (14, 'menu', 10,   04, 'Situación IVA',             '', 'SituacionIVA',   '',               '#Menu.Situación IVA', true) ,
  (15, 'menu', 10,   05, 'Categorías AFIP',           '', 'CategoriaAFIP',  '',               '#Menu.Categorías AFIP', true) ,
  (16, 'menu', 10,   06, 'Tipos de domicilio',        '', 'TipoDomicilio',  'tipoDomicilio',  '#Menu.Tipos de domicilio', true) ,
  (17, 'menu', 10,   07, 'Provincias',                '', 'Provincia',      'provincia',      '#Menu.Provincias', true) ,
  (18, 'menu', 10,   08, 'Localidades',               '', 'Localidad',      'localidad',      '#Menu.Localidades', true) ,
  (19, 'menu', 10,   09, 'Tipos de actividades AFIP', '', 'TipoActividadAFIP', '',            '#Menu.Tipos de actividades AFIP', true) ,
  (20, 'menu', 10,   10, 'Actividades AFIP',          '', 'ActividadAFIP', '',                '#Menu.Actividades AFIP', true) ,
  (21, 'menu', 10,   11, 'Condiciones de pago',       '', 'CondicionPago', '',                '#Menu.Condiciones de pago', true) ,

  (30, 'menu', null, 03, 'Ordenes de compra',               '', 'OrdenCompra',        '', '#Menu.Ordenes de compra', true) ,
  (31, 'menu', 30,   01, 'Importador SLU',                  '', 'ImportadorSLU',      '', '#Menu.Importador SLU', true) ,
  (32, 'menu', 30,   02, 'Abm orden de Compra',             '', 'AbmOrdenCompra',     '', '#Menu.Abm orden de Compra', true) ,
  (33, 'sep',  30,   03, '-',                               '', '',                   '', '', true) ,
  (34, 'menu', 30,   04, 'Tipo orden de compra',            '', 'TipoOrdenCompra',    '', '#Menu.Tipo orden de compra', true) ,
  (35, 'menu', 30,   05, 'Objecto de la orden de compra',   '', 'ObjetoOrdenCompra',  '', '#Menu.Objecto de la orden de compra', true) ,
  (36, 'menu', 30,   06, 'Tipos de procedimiento',          '', 'TipoProcedimiento',  '', '#Menu.Tipos de procedimiento', true) ,
  (37, 'menu', 30,   07, 'Acto de adjudicación',            '', 'ActoAdjudicacion',   '', '#Menu.Acto de adjudicación', true) ,

  (50, 'menu', null, 04, 'Facturas',                          '', 'Factura',          '', '#Menu.Facturas', true) ,
  (51, 'menu', 50,   01, 'Bandeja Internet',                  '', 'BandejaInternet',  '', '#Menu.Bandeja Internet', true) ,
  (52, 'menu', 50,   02, 'Bandeja interior',                  '', 'BandejaInterior',  '', '#Menu.Bandeja interior', true) ,
  (53, 'menu', 50,   03, 'ABM factura',                       '', 'AbmFactura',       '', '#Menu.ABM factura', true) ,
  (54, 'sep',  50,   04, '-',                                 '', '',                 '', '', true) ,
  (55, 'menu', 50,   05, 'Tipo de comprobante',               '', 'TipoComprobante',  '', '#Menu.Tipo de comprobante', true) ,
  (56, 'menu', 50,   06, 'Conceptos',                         '', 'Concepto',         '', '#Menu.Conceptos', true) ,
  (57, 'menu', 50,   07, 'Retenciones',                       '', 'Retencion',        '', '#Menu.Retenciones', true) ,
  (58, 'menu', 50,   08, 'Deducciones',                       '', 'Deduccion',        '', '#Menu.Deducciones', true) ,

  (70, 'menu', null, 04, 'Consultas',                  '', '#',         'consultas', '#Menu.Consultas', true) ,
  (71, 'menu', 70,   01, 'Consulta1',                  '', 'Consulta1', 'consulta1', '#Menu.Consulta1', false) ,
  (72, 'sep',  70,   02, '-',                          '', '',          '', '', true) ,
  (73, 'menu', 70,   03, 'Consulta2',                  '', 'Consulta2', 'consulta2', '#Menu.Consulta2', false) ,
  (74, 'menu', 70,   04, 'Consulta3',                  '', 'Consulta3', 'consulta3', '#Menu.Consulta3', false) ,
  (75, 'menu', 70,   05, 'Consulta4',                  '', 'Consulta4', 'consulta4', '#Menu.Consulta4', false) ,
  (76, 'sep',  70,   06, '-',                          '', '',          '', '', true) ,
  (77, 'menu', 70,   07, 'Consulta5',                  '', 'Consulta5', 'consulta5', '#Menu.Consulta5', false) ,

  (090, 'menu', null, 05, 'Configuración',              '', 'Configuracion',  '', '#Menu.Configuración', false) ,
  (091, 'menu', 090,  01, 'Oficinas',                   '', 'Oficina',        '', '#Menu.Oficinas', true) ,
  (092, 'menu', 090,  02, 'Usuarios',                   '', 'Usuario',        '', '#Menu.Usuarios', true) ,
  (093, 'menu', 090,  03, 'Auditoria',                  '', 'Auditoria',      '', '#Menu.Auditoria', false) ,
  (094, 'sep',  090,  04, '-',                          '', '',               '', '', true) ,
  (095, 'menu', 090,  05, 'Contadores',                 '', 'Contador',       '', '#Menu.Contadores', false) ,
  (096, 'menu', 090,  06, 'Variables',                  '', 'Variable',       '', '#Menu.Variables', false) ,
  (097, 'menu', 090,  07, 'Database info',              '', 'DatabaseInfo',   '', '#Menu.Database info', false) ,
  (098, 'menu', 090,  08, 'Permisos',                   '', 'Permiso',        '', '#Menu.Permisos', false) ,
  (099, 'sep',  090,  09, '-',                          '', '',               '', '', true) ,
  (100, 'menu', 090,  10, 'Archivos',                   '', 'Archivo',        '', '#Menu.Archivos', false) ,
  (101, 'menu', 090,  11, 'Tipos de archivo',           '', 'TipoArchivo',    '', '#Menu.Tipos de archivo', false) ,

  (110, 'menu', 098,  01, 'Recursos',                   '', 'Recurso',      '', '#Menu.Recursos', false) ,
  (111, 'menu', 098,  02, 'Tipos de objetos',           '', 'TipoObjeto',   '', '#Menu.Tipos de objetos', false) ,
  (112, 'menu', 098,  03, 'Grupos',                     '', 'Grupo',        '', '#Menu.Grupos', true) ,
  (113, 'menu', 098,  04, 'Permisos',                   '', 'Permiso',      '', '#Menu.Permisos', true)

# --- !Downs
truncate table Menu;