### Configuring

Copy the template in `config/js/environments/production-template.js` to `src/js/config/environments/production.js` and tune accordingly.

### Running without Apache httpd

You can use grunt connect to launch a small server that's configured to do the proper rewriting to serve Pibi assets. Running it is as simple as:

```shell
grunt server
```

You should be able to locate the app at: [http://localhost:8000].
