namespace :doc do
  desc 'generate docs using yard-api'
  task :api => :environment do
    require 'yard-api'
    require 'yard-api/yardoc_task'
    require 'yard-api-slatelike'

    runner = YARD::APIPlugin::YardocTask.new(:salati_docs)
    output = runner.config['output']
    Rake::Task['salati_docs'].invoke
    puts <<-Message
      API Documentation successfully generated in #{output}
      See #{output}/index.html
    Message
  end
end
