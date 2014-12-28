namespace :salati do
  desc 'run necessary tasks on outstanding resources'
  task :process => :environment do
    def run(task_id, &block)
      puts '=' * 80
      puts "Invoking rake task '#{task_id}'"
      puts '-' * 80

      task = Rake::Task[task_id.to_sym]
      task.invoke

      block.call(task) if block_given?

      puts '=' * 80
    end
  end
end