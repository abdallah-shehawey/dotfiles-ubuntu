#!/bin/bash
for file in *"#"*; do

  num=$(echo "$file" | grep -oE '#[0-9]+')
  
 
  rest=$(echo "$file" | sed -E "s/ *$num *//")
  

  newname="$num $rest"
  

  mv -- "$file" "$newname"
done
