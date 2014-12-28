# Pibi API - The official JSON API for Pibi, the personal financing software.
# Copyright (C) 2014 Ahmad Amireh <ahmad@algollabs.com>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

# @API Prayers
#
# @object Prayer
#  {
#  }
class PrayersController < ApplicationController
  include Rack::API::Resources
  include Rack::API::Parameters

  PRAYER_TYPES = %w[ fajr duha dhuhr asr maghrib ishaa witr ]

  before_filter :require_user
  before_filter :require_prayer, only: [ :show, :update, :destroy ]

  # @API Retrieving all access tokens
  #
  # @returns [ AccessToken ]
  def index
    expose current_user.prayers, each_serializer: PrayerSerializer
  end

  # @API Creating access tokens
  #
  # @argument [String] udid
  #   Unique identifier for the access token.
  #
  # @returns [ AccessToken ]
  def create
    parameter :date, type: :date, required: true
    parameter :type, type: :string, in: PRAYER_TYPES, required: true

    api_prayer_options

    date = api.transform(:date) { |d| d.beginning_of_day }
    type = api.transform(:type) { |t| "Prayer::#{t.capitalize}" }

    prayer = current_user.prayers.where({
      date: date,
      type: type
    }).first

    if prayer
      prayer.update_attributes(api.parameters)
    else
      prayer = current_user.prayers.create(api.parameters)
    end

    expose prayer, serializer: PrayerSerializer
  end

  # @API Retrieving an access token
  #
  # @returns [ AccessToken ]
  def show
    expose @prayer, serializer: PrayerSerializer
  end

  def update
    api_prayer_options

    unless @prayer.update_attributes(api.parameters)
      halt! 422, @prayer.errors
    end

    expose @prayer, serializer: PrayerSerializer
  end

  # @API Revoking access tokens
  #
  # @no_content
  def destroy
    @prayer.destroy

    no_content!
  end

  private

  def require_prayer
    unless @prayer = current_user.prayers.where({ id: params[:prayer_id] }).first
      halt! 404
    end
  end

  def api_prayer_options
    accepts [
      :on_time,
      :in_congregation,
      :in_mosque,
      :with_dhikr,
      :with_sunnah,
      :with_preceding_sunnah,
      :with_full_preceding_sunnah,
      :with_subsequent_sunnah,
      :with_sunnah_on_time,
      :in_last_third
    ]
  end
end