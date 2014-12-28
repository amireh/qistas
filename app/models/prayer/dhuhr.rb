class Prayer::Dhuhr < Prayer
  def scoring_policy
    {
      on_time: 5,
      in_congregation: 1,
      in_mosque: 4,
      with_dhikr: 1,
      with_preceding_sunnah: 1,
      with_full_preceding_sunnah: 1,
      with_subsequent_sunnah: 1
    }
  end

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