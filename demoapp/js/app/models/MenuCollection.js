/*globals define, app*/

define( [
    'src/models/MenuCollection', 'app/models/MenuModel'
  ], function(
    MenuCollection, MenuModel
  ) {

'use strict';

var Collection = MenuCollection.extend({

  model: MenuModel,

  name:   'Menu',
  label:  'Menues',

  parentId: undefined,

  url: app.endpoint + '/' + 'Menu',

  resource: 'Menu',          // to get permissions from meta

  menuAdapter: function(menu) {
    return {
      id:           menu.MenuId,
      type:         menu.Tipo,
      parentId:     (menu.MenuPadreId === null || menu.MenuPadreId === 0) ? 'root' : menu.MenuPadreId,
      order:        menu.Orden,
      name:         menu.Nombre,
      description:  menu.Descripcion,
      url:          menu.Url,
      resource:     menu.Permiso,
      help:         menu.Ayuda,
      show:         menu.Mostrar
    };
  }

});

  return Collection;
});
