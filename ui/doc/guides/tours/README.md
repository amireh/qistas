# Usage Tours (via Guide.js)

In this article we'll go through building a `guide.js` tour, configuring it, and registering with the Pibi engine.

**1. Name the tour**

You'll need a unique name for the tour. It can contain spaces and any custom characters. Also, keep a `snake_cased_version` of it somewhere nearby, you'll need it for naming files.

For the sake of this example, we'll call the tour `Customizing Your Account`.

**2. Create the tour template**

The tour should be defined inside an HBS template inside `templates/tours/customizing_your_account.hbs`, and the filename should be the name of the tour in snake_style form.

Here's a sample of a blank tour with no spots:

    <div data-guide-tour="Customizing Your Account"></div>

**3. Configure the tour (optional)**

If you need to define custom options for the tour, or bind JS handlers, etc., then you do that in a separate file in `views/tours/customizing_your_account.js`, with the following structure:


    define('views/tours/customizing_your_account', [], function() {
      return {
        tour: 'Customizing Your Account', // The name must match the tour name here
        optios: { // Tour options go here
        },

        bind: function(tour, director, actor) {
         // install any handlers you need here
         // actor is a Backbone model object that you can use to bind to events
        },

        build: function(tour, director, actor) {
          // build spots here
        }
      }
    });


**4. Register the tour**

Open `bundles/all_tours.js` and add the files you created above to the list of dependencies, ie:

    define('bundles/all_tours', [
      'views/tours/customizing_your_account',
      'hbs!templates/tours/customizing_your_account'
    ], // ...

That's it!