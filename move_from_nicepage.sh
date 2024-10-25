#!/bin/bash

# Source and destination folders as arguments
SOURCE_FOLDER="/Users/naveen/Documents/Nicepage Templates/Spotto Finance MVP/"
DESTINATION_FOLDER="./"

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

# Move and overwrite contents from source to destination using rsync
rsync -a "$SOURCE_FOLDER"/ "$DESTINATION_FOLDER"/

echo "All contents moved and overwritten from '$SOURCE_FOLDER' to '$DESTINATION_FOLDER'."

