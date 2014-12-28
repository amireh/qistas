# Building

## Releasing a new version

    grunt release:[patch|minor|major]

This will automatically update the version strings in all the appropriate places.

**WARNING: this will automatically commit the entire working tree!**

## Building the assets (JS/CSS/Locales)

    grunt compile:locales
    grunt compile:css
    grunt compile:js

Make sure to compile the locales before the JS.

## Generating deployment builds

To deploy Pibi on the web or on Phonegap, we need to generate custom builds.
The builder script `bin/build` will do that for us, and it's wrapped in a Grunt
task for convenience:

    grunt deploy

Once the deploy script is done, you will find the generated builds under
`build/phonegap` and `build/web`.

**You must manually commit the changes in these repositories.**

## Generating these docs

    grunt docs