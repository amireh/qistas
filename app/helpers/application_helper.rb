module ApplicationHelper
  def text_hr
    '=' * 80
  end

  def readable_number(n)
    sprintf("%.2f" % (n.to_f.round(2)))
  end
end
