class Prayer::Asr < Prayer
  def scoring_policy
    {
      on_time: 5,
      in_congregation: 1,
      in_mosque: 4,
      with_dhikr: 1,
      with_sunnah: 2
    }
  end
end