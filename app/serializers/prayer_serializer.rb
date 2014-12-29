# Salati API - The official JSON API for Salati, the muslim prayer tracker.
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

class PrayerSerializer < ActiveModel::Serializer
  attributes :id,
    :type,
    :date,
    :score,
    :on_time,
    :in_congregation,
    :in_mosque,
    :with_dhikr,
    :with_sunnah,
    :with_preceding_sunnah,
    :with_full_preceding_sunnah,
    :with_subsequent_sunnah,
    :with_sunnah_on_time,
    :in_last_third,
    :normalized_score,
    :max_score

  def type
    object.type.sub('Prayer::', '').underscore
  end
end
