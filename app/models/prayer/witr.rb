class Prayer::Witr < Prayer
  def scoring_policy
    {
      in_last_third: 5
    }
  end
end