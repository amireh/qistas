module Fixtures
  class UserFixture < Fixture
    def self.password
      'helloWorld123'
    end

    def build(params = {})
      attrs = accept(params, json_fixture('user.json').merge({
        uid: UUID.generate
      }))

      User.create!(attrs)
    end
  end # UserFixture
end