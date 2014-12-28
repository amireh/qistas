if [ $# -lt 1 ]; then
  echo "usage: ${0} PATH_TO_EMBLEM_STYLESHEET.less";
  exit 1
fi

FILE=$1

cat ${FILE} | grep -P "\.emblem-([\w|-]+),?+\s\{" | grep -P "\.emblem([\w|-])+" | ruby -e 'puts ARGF.read.gsub(/\.emblem-|{/, "")' | ruby -e "puts '[' + ARGF.read.gsub(/([\w|-]+)/, '\'\1\'').strip + ']'"