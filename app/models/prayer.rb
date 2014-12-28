class Prayer < ActiveRecord::Base
  belongs_to :user

  before_save do
    self.in_mosque = false if !in_congregation
    self.with_sunnah_on_time = false if !with_sunnah
    self.with_full_preceding_sunnah = false if !with_preceding_sunnah

    self.score = calculate_score
  end

  def calculate_score
    scoring_policy.reduce(1) do |sum, (item, weight)|
      sum += !!self[item] ? weight : 0
    end
  end

  def normalized_score
    max_score = scoring_policy.values.sum
    max_score == 0 ? 1 : self.score / max_score
  end

  protected

  def scoring_policy
    {}
  end
end
