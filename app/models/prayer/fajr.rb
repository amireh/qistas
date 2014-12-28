class Prayer::Fajr < Prayer
  def scoring_policy
    {
      on_time: 5,
      in_congregation: 1,
      in_mosque: 4,
      with_dhikr: 1,
      with_sunnah: 3,
      with_sunnah_on_time: 2
    }
  end

  def calculate_score
    score = 1
    score += 5 if self.on_time

    if in_congregation
      score += 1

      if in_mosque
        score += 4
      end
    end

    score += 1 if with_dhikr
    score += 3 if with_sunnah
    score += 2 if with_sunnah && with_sunnah_on_time

    score
  end
end