class Prayer < ActiveRecord::Base
  # To recalculate this, do:
  #
  #     Prayer.subclasses.map { |klass| klass.new.max_score }.sum
  MAX_DAILY_SCORE = 72
  BASE_SCORE = 1

  belongs_to :user

  before_save do
    self.in_mosque = false if !in_congregation
    self.with_sunnah_on_time = false if !with_sunnah
    self.with_full_preceding_sunnah = false if !with_preceding_sunnah

    self.score = calculate_score
  end

  def calculate_score
    scoring_policy.reduce(BASE_SCORE) do |sum, (item, weight)|
      sum += !!self[item] ? weight : 0
    end
  end

  def normalized_score
    score.to_f / max_score
  end

  def max_score
    @max_score ||= (scoring_policy.values.sum.to_f + BASE_SCORE)
  end

  protected

  def scoring_policy
    {}
  end
end
