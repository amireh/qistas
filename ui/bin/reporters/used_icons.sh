if [ $# -ne 1 ]; then
  echo "usage: ${0} PATH_TO_WWW";
  exit 1
fi

WWW=$1
FILES="${WWW}/index.html ${WWW}/src/js/templates ${WWW}/src/js"

ICONS=`grep -rohPz "icon-[^0-9]{1}[-\w+]+"   ${FILES} | sort | uniq`
EMBLEMS=`grep -rohPz "emblem-[^0-9]{1}[-\w+]+" ${FILES} | sort | uniq`

ruby -e "puts %w[ $ICONS $EMBLEMS ].reject { |e| e =~ /green|orange|red|black|white/ }"

exit 0