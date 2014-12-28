module Algol::Worker
  def self.enqueue(worker_klass, job_params)
    Resque.enqueue_to('salati_jobs', worker_klass, job_params)
  end
end