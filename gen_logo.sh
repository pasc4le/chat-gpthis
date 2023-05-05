#!/bin/bash
sizes=(128 48 32 16)

set -x
for i in "${sizes[@]}"
do
	convert ./static/logo.png -resize "${i}x${i}" "./static/logo${i}.png"
done
set +x
