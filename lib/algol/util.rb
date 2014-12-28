require 'addressable/uri'

module Algol::Util
  def self.parse_date(string, default=nil)
    date = Rack::API::ParameterValidators::DateValidator.new.coerce(string)
    date || default
  end

  def self.encode_url(url)
    Addressable::URI.parse(url).normalize.to_str
  end

  def self.sanitize_string(str)
    Addressable::URI.
      parse(str.downcase.gsub(/[[:^word:]]/u,'-').
      squeeze('-').
      chomp('-')).
      normalized_path
  end
end