class Prayer::Dhuhr < Prayer
  def calculate_score
    score = 1
    score += 5 if self.on_time

    score += 1 if in_congregation
    score += 4 if in_congregation && in_mosque
    score += 1 if with_dhikr
    score += 1 if with_preceding_sunnah
    score += 1 if with_preceding_sunnah && with_full_preceding_sunnah
    score += 1 if with_subsequent_sunnah

    score
  end
end