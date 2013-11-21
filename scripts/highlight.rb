def pygmentize(code)
  return "" if code.strip.empty?

  html = IO.popen ["pygmentize", "-l", 'coffeescript', '-f', 'html'], 'r+' do |pio|
    pio.write code
    pio.close_write
    pio.read
  end
  "\n#{html}\n"
end

ARGV.each do |file|
  code = ""

  File.readlines(file).each do |line|
    if line =~ /^ {4}(.*)$/
      code << $1.to_s + "\n"
    elsif line =~ /^ *$/ && !code.empty?
      code << "\n"
    else
      puts pygmentize(code) unless code.empty?
      puts line
      code = ""
    end
  end

  puts pygmentize(code) unless code.empty?
end