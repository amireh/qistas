if [ $# -lt 1 ]; then
  echo "usage: ${0} PATH_TO_WWW [show_filenames]";
  exit 1
fi

WWW=$1

if [ $# -eq 1 ]; then
  PATTERN="orPh"
else
  PATTERN="orPn"
fi

CSS_DIR="${WWW}/src/css"

find ${CSS_DIR} -name '*.less' | xargs grep "-${PATTERN}" 'font-family: (.*);' | sort | uniq