BackboneBootstrap
=================

Basic Backbone application using Twitter Bootstrap to use as a skeleton for new
applications.

This is my first attempt at developing a complete and full-featured crud
application using client side technologies like backbone.

This is a work in progress, and is far from becoming a full featured and generic
framework ready to be used out of the box by the community.

It's just being published here so that everybody can learn from the (far too
many) mistakes I've made, discuss features and, hopefully, collaborate with the
development.

Rationale
=========

In the old days of classic asp and php, quite a couple of times we often ended
up developing our own framework with the features needed for every app. There
are certain features, like crud forms, validations, pagination, filtering,
master- detail forms, and several others features that could really let you come
out with the common parts of an app, and let you concentrate on the heavy stuff.

This project aims to implement features.

Demo application
================

There's a demo application up and running on [openshift](http://www.openshift.com/).
You can have a look at it at [http://bbbootstrap.com.ar/](http://bbbootstrap.com.ar/).
(Take into account that we left the src files unminified to let you have a look
at them, so it will take some time for the browser to download every js file).

To make the demo we prepared a rest web service returning json, inspired in the
excellent [Wine Cellar backbone tutorial](http://coenraets.org/blog/2011/12/backbone-js-wine-cellar-tutorial-part-1-getting-started/] (github repo at [https://github.com/ccoenraets/backbone-cellar#readme](https://github.com/ccoenraets/backbone-cellar#readme). The web
service is built with [play framework](http://www.playframework.com/) and
[scala](http://www.scala-lang.org/). You will find it at the webservice folder
[here](https://github.com/opensas/BackboneBootstrap/tree/master/webservice).

To test the foreign key we added a Countries endpoint (every wine belongs to a
country), and to test the master-detail feature we added a Reviews entity (every
wine can have one or more reviews).

You can have a look at the entities, and the endpoints at
[http://bbbootstrap.com.ar/api](http://bbbootstrap.com.ar/api)

The demo application is located at the
[demoapp](https://github.com/opensas/BackboneBootstrap/tree/master/demoapp)
folder.

Everything specific to your application should be at
[js/app](https://github.com/opensas/BackboneBootstrap/tree/master/demoapp/js/app)

You will find the part common to every application in the
[js/src](https://github.com/opensas/BackboneBootstrap/tree/master/demoapp/js/src)

As stated before this is a work in progress, and even though there are lots of
features working, everything is pretty tied up to the particular requirements
I have in mind.

There is some good ammount of work ahead to turn it into a general and reusable
framework.

Features already working
========================

- [x] Declarative model schema.

The idea is to specify as much information about your models in order to create
fully working forms using that info.
[Here](https://github.com/opensas/BackboneBootstrap/blob/master/demoapp/js/app/models/WineModel.js#L22)
you can find the schema definition for the wine model.

- [x] Declarative fields collection for common tasks (edit forms, query forms,
table headers, master headers).

Taking the schema as a base, it is easy to define new schemas just by specifying
the differences (you know the 'don't repeat yourself' mantra).
[Here](https://github.com/opensas/BackboneBootstrap/blob/master/demoapp/js/app/models/WineModel.js#L123)
you can see the definition of the formFields,queryFields and tableFields for
the Wine model based on it's schema.

- [x] Declarative validations enforced and displayed at the client.

Clien-side validations from the model schema are checked when editing every
field. If there's an error it will be shown right next to the control.
You can try using it the
[wine crud form](http://bbbootstrap.com.ar/index.html#Wine).
Just click on the first wine to edit it, and clear it's name.

- [x] Handling and displaying of server-side validations.

Just like with client-side validations, the model will process server-side
errors and it will display them next to each invalid field.
You can try using it the
[wine crud form](http://bbbootstrap.com.ar/index.html#Wine).
Just click on the first wine to edit it, enter a duplicated name, like
'REX HILL' (in uppercase).

- [x] Permission management by resource, limiting the actions available and the
main menu options enabled/visibles according to the user's permisions.

- [x] Automatic main menu buiding from a resource (backbone collection) at the
server.

The menu you see on the [main page](http://bbbootstrap.com.ar) is dinamically
build from the information available at the
[menu endpoint](http://bbbootstrap.com.ar/api/Menu).

You should implement a menuAdapter function in your menu collection to adapt
the output from your endpoint to the fields needed by the
[MenuItem](https://github.com/opensas/BackboneBootstrap/blob/master/demoapp/js/src/controls/menu/MenuItem.js)
class. Have a look at [this example](https://github.com/opensas/BackboneBootstrap/blob/master/demoapp/js/app/models/MenuCollection.js#L24)
for more information.

- [x] Server-side pagination and ordering of collections.

Just click on the header to change the order of the fields. You can give it a
try if with the [countries crud form](http://bbbootstrap.com.ar/index.html#Country).

- [x] Rich and flexible query language for server-side filtering of information.

Just click on the nut icon on the top right of the crud form, and the query form
will appear. You can give it a
try if with the [countries crud form](http://bbbootstrap.com.ar/index.html#Country).

You can enter queries like '2..3' in the _id_ field to fetch countries whose ids
are between two and three, or '<B' in the _name_ field to query countries whose
name starts with A, or entering '*A' to get those that end with A.

- [x] Quick filter using the fields on the table.

Just enter a text in the quick search input box at the top right corner, and
records will be automatically filtered.

- [x] Automatic generation of twitter-bootstrap compatibles forms.

- [x] Automatic generation of crud form using the info from the schema, with
support for filtering, ordering, pagination, edition and validations and error
handling.

Every form you see in the demo is generated from the info entered in the model's
definition.

- [x] Automatic generation of master-detail forms (work in progress).

You can give a try to the master-detail feature with the
[Wines with reviews](http://bbbootstrap.com.ar/index.html#WineParent). Just
click on a wine, and the _Reviews_ tab will let you create, edit or delete that
wine's reviews.

- [x] Handling of foreign-key relations with a CollectionCombo control that
generates a select box using the info from a Backbone Collection.

Check it out in action in the country combo in the
[wines form](http://bbbootstrap.com.ar/index.html#Wine).

- [x] Integration of bootstrap-datepicker for date fields edition

Give it a try in the
[reviews form](http://bbbootstrap.com.ar/index.html#Review).

- [x] Hooks for translating your backend data format to native javascript types
(specially useful for handling asp.net dates, for example)

- [x] UI building using overridable templates.

- [x] Optimization and minification of jvascript assets using RequireJS
optimizer.

(In the demo app we are just serving every file on it's own, to let you have a
look at the code).

Features missing
================

- [ ] Support for Handlebars precompiled templates. Right now we are using
underscore templates.

- [ ] Integration with
[select2](http://ivaynberg.github.com/select2/index.html) combo for selecting a
record from collections with thousands of options.

- [ ] Super-charged combo select using all the features of the crud form.
Basically if would be a crud form that would allow you to search, create, edit
or delete the record, and also select the chosen one.

- [ ] Custom actions on forms. Right now there's a drop-down button with no
functionality.

- [ ] Memory leaks prevention. Do as much as possible to prevent any memory
leak. Right now, every controller that is lodaded fires a new redirect, in
order to prevent memory holes.

- [ ] Internationalization suport (I18N). Haven't even though about it yet. In
fact, you'll find a couple of label buttons in spanish.

And most important
==================

- [ ] Documentation. The documentation is still very lacking.

- [ ] Testing. No tests avaibles so far.

- [ ] Major refactors. Lots of functinality is already working, but the code has
grown out a little wild. Once we have a fairly complete battery test we will
start refactoring it all.

Sources of inspiration
======================

There are several projects I looked into to see how they solved this problems.
These are just a fiew of them:

- [Backgrid](http://wyuenho.github.com/backgrid/)

- [Backbone pageable](https://github.com/wyuenho/backbone-pageable)

- [Backbone.Schema](https://github.com/DreamTheater/Backbone.Schema)

- [backbone-forms](https://github.com/DreamTheater/Backbone.Schema)

- [Airbnb javascript style guide](https://github.com/airbnb/javascript#readme)

- [backbone.baseview](https://github.com/airbnb/backbone.baseview)

Libraries we cannot live without
================================

- [backbone-0.9.10](http://backbonejs.org/)

- [twitter bootstrap 2.2.2](http://twitter.github.com/bootstrap/)

- [jquery-1.9.1](http://jquery.com/)

- [lodash.compat-1.0.1](http://lodash.com/)

- [jquery-gritter-1.7.4](http://boedesign.com/blog/2009/07/11/growl-for-jquery-gritter/)(for sexy event notifications)

- [moment-2.0.0](http://momentjs.com/) (for date handling)

- [require-2.1.4](http://requirejs.org/)(for module loading and assets minification)

- [text-2.0.5 require plugin](https://github.com/requirejs/text)

## License

This software is distributed under the Apache 2.0 license:
http://www.apache.org/licenses/LICENSE-2.0

BackboneBootstrap is free software: you can redistribute it and/or modify it
under the terms of the Apache 2.0 license:
http://www.apache.org/licenses/LICENSE-2.0

BackboneBootstrap is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
