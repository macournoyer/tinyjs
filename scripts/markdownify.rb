ARGV.each do |file|
  File.readlines(file).each do |line|
    if line =~ /^\/\/\s*(.*)$/
      puts $1.to_s + "\n"
    else
      puts "    " + line
    end
  end
  puts
end