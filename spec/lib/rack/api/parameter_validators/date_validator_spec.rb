describe Rack::API::ParameterValidators::DateValidator do
  it "should coerce from a [MM/DD/YYYY] string" do
    data = { date: '03/01/2014' }

    described_class.any_instance.should_receive(:validate).and_call_original
    described_class.any_instance.should_receive(:coerce).twice.and_call_original

    Rack::API.trigger :parameter_parsed, :date, data, {
      type: :date,
      coerce: true
    }

    data[:date].should == Time.new(2014, 3, 1)
  end

  it "should coerce from an epoch string" do
    data = { date: Time.now.beginning_of_month.to_i.to_s }

    described_class.any_instance.should_receive(:validate).and_call_original
    described_class.any_instance.should_receive(:coerce).twice.and_call_original

    Rack::API.trigger :parameter_parsed, :date, data, {
      type: :date,
      coerce: true
    }

    data[:date].should == Time.now.beginning_of_month
  end

  it "should coerce from an epoch number" do
    data = { date: Time.now.beginning_of_month.to_i }

    described_class.any_instance.should_receive(:validate).and_call_original
    described_class.any_instance.should_receive(:coerce).twice.and_call_original

    Rack::API.trigger :parameter_parsed, :date, data, {
      type: :date,
      coerce: true
    }

    data[:date].should == Time.now.beginning_of_month
  end

  it "should coerce from an ISO-8601 string" do
    data = { date: "2014-02-18T00:00:00Z" }

    described_class.any_instance.should_receive(:validate).and_call_original
    described_class.any_instance.should_receive(:coerce).twice.and_call_original

    Rack::API.trigger :parameter_parsed, :date, data, {
      type: :date,
      coerce: true
    }

    data[:date].should == Time.new(2014, 2, 18)
  end

  it "should reject an unknown format" do
    data = { date: "2014-02x-1" }
    expect {
      Rack::API.trigger :parameter_parsed, :date, data, {
        type: :date,
        coerce: true
      }
    }.to raise_error(Rack::API::Error)
  end

  it "should reject an out-of-range date" do
    data = { date: "2014-02-133" }
    expect {
      Rack::API.trigger :parameter_parsed, :date, data, {
        type: :date,
        coerce: true
      }
    }.to raise_error(Rack::API::Error)
  end

  xit 'should zero the hours, if requested' do
    data = { date: "2014-02-18T08:43:00Z" }

    Rack::API.trigger :parameter_parsed, :date, data, {
      type: :date,
      coerce: true,
      zero: true
    }

    data[:date].should == Time.new(2014, 2, 18)

    data = { date: "2014-02-18T08:43:00Z" }

    Rack::API.trigger :parameter_parsed, :date, data, {
      type: :date,
      coerce: true,
      zero: false
    }

    data[:date].should == Time.new(2014, 2, 18, 8, 43)
  end
end