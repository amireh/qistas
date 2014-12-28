class UiController < ApplicationController
  skip_before_filter :require_json_format
  before_filter :reject_json_format

  def index
    respond_to do |format|
      format.html do
        render :file => File.join(Rails.root, 'public', 'index.html')
      end

      format.js   { halt! 404 }
      format.json { halt! 404 }
      format.any do
        render text: 'Not Found', :status => :not_found
      end
    end
  rescue ActionController::UnknownFormat => e
    render text: 'Not Found', status: :not_found
  end
end
