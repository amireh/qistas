define([ 'modules/api_error_decorator' ], function(APIErrorDecorator) {
  describe('Modules::APIErrorDecorator', function() {
    var decorator;
    var emptyError = {
      message: undefined,
      code: undefined,
      fieldErrors: {}
    };

    beforeEach(function() {
      expect(function() {
        decorator = APIErrorDecorator;
      }).not.toThrow();
    });

    describe('#isError', function() {
      it('should parse from xhr.responseJSON', function() {
        expect(decorator.isError({
          status: 'error'
        })).toEqual(true);
      });
    });

    describe('#parse', function() {
      it('should not fail on empty responses', function() {
        var output = decorator.parse({});

        expect(output).toEqual(emptyError);
      });

      it('should extract the first message', function() {
        var output = decorator.parse({ messages: [ 'hello' ] });

        expect(output).toEqual({
          message: 'hello',
          code: undefined,
          fieldErrors: {}
        });
      });

      it('should extract the code', function() {
        var output = decorator.parse({ messages: [ '[ITEM:CODE]: hello' ] });

        expect(output).toEqual({
          message: 'hello',
          code: 'ITEM_CODE',
          fieldErrors: {}
        });
      });

      it('should extract the code without a colon', function() {
        var output = decorator.parse({ messages: [ '[ITEM:CODE]hello' ] });

        expect(output).toEqual({
          message: 'hello',
          code: 'ITEM_CODE',
          fieldErrors: {}
        });
      });

      it('should extract the codes for each field error', function() {
        var output = decorator.parse({
          "status": "error",
          "messages": [
            "[USR:PASSWORD_MISSING] You must provide a password.",
            "[USR:PASSWORD_TOO_SHORT] Password is too short, it must be at least 7 characters long.",
            "[USR:PASSWORD_CONFIRMATION_MISSING] You must confirm the password.",
            "[USR:BAD_PASSWORD] The current password you entered is wrong."
          ],
          "field_errors": {
            "password": [
              "[USR:PASSWORD_MISSING] You must provide a password.",
              "[USR:PASSWORD_TOO_SHORT] Password is too short, it must be at least 7 characters long."
            ],
            "password_confirmation": [
              "[USR:PASSWORD_CONFIRMATION_MISSING] You must confirm the password."
            ],
            "current_password": [
              "[USR:BAD_PASSWORD] The current password you entered is wrong."
            ]
          }
        });

        expect(output).toEqual({
          message: 'You must provide a password.',
          code: 'USR_PASSWORD_MISSING',
          fieldErrors: {
            password: {
              code: "USR_PASSWORD_MISSING",
              message: "You must provide a password."
            },
            password_confirmation: {
              code: 'USR_PASSWORD_CONFIRMATION_MISSING',
              message: 'You must confirm the password.'
            },
            current_password: {
              code: 'USR_BAD_PASSWORD',
              message: 'The current password you entered is wrong.'
            }
          }
        });
      });

    });
  });
});