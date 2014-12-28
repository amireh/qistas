define([
  'ext/underscore',
  'ext/pixy',
  'collections/transactions'
], function(_, Pixy, Transactions) {

  /**
   * @class  Pibi.Models.PaymentMethod
   * @extends Pixy.DeepModel
   *
   * A payment method.
   *
   * @alternateClassName PaymentMethod
   */
  return Pixy.DeepModel.extend({
    name: 'PaymentMethod',

    defaults: {
      /**
       * @property {String} name
       * A unique name of the payment method.
       */
      name: '',

      /**
       * @property {String} color
       * A color that helps to visually identify the PM.
       */
      color: 'FFBB33'
    },

    /**
     * Validate the payment method's state. The following tests are done:
     *
     *  - name exists
     *  - name isn't too short
     *  - name is unique
     *
     * @returns {Object/false}
     *          false if the validation passes, an object containing the erratic
     *          field and a message otherwise
     */
    validate: function(data) {
      var name = (data.name||'').toLowerCase();
      var id = this.get('id');

      if (!data.name || !data.name.length) {
        return { name: '[PMTD:MISSING_NAME] You must provide a name for the payment method.' };
      }
      else if (data.name.length < 3) {
        return { name: '[PMTD:NAME_TOO_SHORT] A payment method must be at least 3 characters long.' };
      }

      // make sure it's unique
      var similarilyNamed = this.collection && this.collection.find(function(pm) {
        return !pm.isNew() &&
          pm.get('id') != id &&
          pm.get('name').toLowerCase() == name;
      });

      if ( similarilyNamed ) {
        return { name: '[PMTD:NAME_UNAVAILABLE] You already have such a payment method.' };
      }

      return false;
    }
  });
});