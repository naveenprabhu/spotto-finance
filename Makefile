# Define variables for source and target directories
SOURCE_DIR := ./src
OUTPUT_DIR := ./output

help::
	@echo "Spotto Finance Make File instructions"
	@echo "make help - shows help information"
	@echo "---"
	@echo "make dev_deploy - Deploy the code for dev testing"
	@echo "---"

build:
	rm -rf $(OUTPUT_DIR)/*
	@echo "Building the project..."
	mkdir -p $(OUTPUT_DIR)          # Create the output directory if it doesn't exist
	cp -r $(SOURCE_DIR)/* $(OUTPUT_DIR)  # Copy source files to the output directory
	@echo "Build complete. Files copied to $(OUTPUT_DIR)."


dev_deploy: build
	sudo rm -rf /opt/homebrew/var/www
	cp -r ./output/ /opt/homebrew/var/www

prod_deploy: build
	aws s3 sync ./output/ s3://spottofinance.com.au
	aws cloudfront create-invalidation --distribution-id=E17ZYXG5PGP73T --paths "/*"
