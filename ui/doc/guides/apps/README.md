# Apps

Every distinct section in Pibi is treated as a separate "app" that hosts its own JS, CSS, and tests. These are found under `/apps/*` and must follow a specific structure for them to function and build properly.

This is a reference to all the work needed to get a new app running.

## Creating an app

### `js/main.js`

This file must exist and it must be a module that returns a subclass of `core/app.js`. At a minimum, for an app to be loadable, you need:

1. a unique name
2. a root route

Here's a skeleton implementation:

```javascript
// @file: /apps/dashboard/js/main.js
define(function(require) {
  var CoreApp = require('core/app');
  var Route = require('routes/base');

  var RootRoute = new Route('app:dashboard', {});

  return CoreApp.extend({
    name: 'dashboard'
  });
});
```

The root route MUST be named `app:NAME_OF_APP`, otherwise the router can not determine whether the requested route belongs to your app or not.

## Registering the app

You need to list your newly created app in `/config/available_apps.json`:

```json
{
  "name": "dashboard"
}
```

Reference of the app schema:


```javascript
{
    /**
     * Required. A unique name for the app.
     */
    "name": "",

    /**
     * @property {Boolean}
     * Turn this on if you want the navigation module to show a link
     * to your app. You can customize the link with properties detailed
     * below.
     */
    "navigation_link": false,

    /**
     * @property {String}
     * Used by the navigation module if you want your app to have its
     * own navigation link.
     */
    "title": "",

    /**
     * @property {String} href
     * The @href of the navigation anchor. This must point to a route
     * mapped by one of the routes you've defined. It's ok if it's
     * a nested route.
     */
    "href": "",

    /**
     * @property {Boolean}
     * Normally, all routes defined by an app are contained under its
     * name as a namespace. So, for a "dashboard" app, any nested routes
     * it defines, like "history", will be reachable under "/dashboard/history"
     *
     * In special scenarios, like an app that handles landing/guest requests,
     * the app may require more than one entry point and they do not
     * necessarily need to be nested under the app's name. For this use-case,
     * you may set your app to be a "top-level" one where it gets to define
     * routes exactly at the top-level (right under the root "/").
     */
    "top_level": false,

    /**
     * @property {String[]}
     * An explicit list of routes that your app knows how to handle.
     * This only makes sense and is necessary if you're defining
     * a top-level app.
     *
     * For example, for an top-level app named "guest", you may want
     * "/login" to be handled by your app, and so you would list that
     * route in this property and any-time the router transitions to
     * "/login", it will request the loader to boot your app and give
     * it control.
     */
    "entry_scripts": []
}
```

See `/src/js/core/app_loader.js` for loading and instantiating apps at run-time. Also, the app "bundle" which tracks all the available apps can be found at `/src/js/bundles/apps.js`.

## Adding tests to your app

All tests must reside under `/apps/APP_NAME/test/` and they must end with `_test.js` for them to be picked up by the runner. You may choose to run tests only for your app by specifying its name as a target to the grunt task:

```shell
# run tests only for the "dashboard" app:
grunt test:dashboard
```

You can also define a custom r.js config file for your test suite under `/apps/APP_NAME/test/config.js`. Helpers and support files should be placed under `test/helpers`. You can also define CSS overrides in a file called `test/overrides.css`.

Note that, inside your tests, you must prefix all paths to app scripts by `app/`, otherwise the r.js runtime loader will try to load that file from `/src/js` which is the common repository. For example, to require your view file which is found at `/apps/dashboard/js/views/index.jsx` inside a test:

```javascript
define(function(require) {
    var View = require('jsx!app/views/index');
});
```