class Prayer::Maghrib < Prayer
  def scoring_policy
    {
      on_time: 5,
      in_congregation: 1,
      in_mosque: 4,
      with_dhikr: 1,
      with_sunnah: 1
    }
  end
end