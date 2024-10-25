#!/bin/bash

# Source and destination folders as arguments
SOURCE_FOLDER="/Users/naveen/Documents/Nicepage Templates/Spotto Finance MVP/"
DESTINATION_FOLDER="../"

# Check if both arguments are provided
if [ -z "$SOURCE_FOLDER" ] || [ -z "$DESTINATION_FOLDER" ]; then
  echo "Usage: $0 <source_folder> <destination_folder>"
  exit 1
fi

# Check if source folder exists
if [ ! -d "$SOURCE_FOLDER" ]; then
  echo "Source folder '$SOURCE_FOLDER' does not exist."
  exit 1
fi

# Create destination folder if it does not exist
if [ ! -d "$DESTINATION_FOLDER" ]; then
  mkdir -p "$DESTINATION_FOLDER"
fi

# Move contents from source to destination
for item in "$SOURCE_FOLDER"/*; do
  mv -f "$item" "$DESTINATION_FOLDER"/
  if [ $? -eq 0 ]; then
    echo "Moved '$item' to '$DESTINATION_FOLDER'"
  else
    echo "Failed to move '$item'"
  fi
done
