# Define variables for source and target directories
SOURCE_DIR := ./src
OUTPUT_DIR := ./output

help::
	@echo "Spotto Finance Make File instructions"
	@echo "make help - shows help information"
	@echo "---"
	@echo "make dev_deploy - Deploy the code for dev testing"
	@echo "---"

format:
	@echo "Formatting code..."
	# Example for JavaScript/TypeScript
	prettier --write "$(SOURCE_DIR)/**/*.{js,ts,jsx,tsx,css,html}"
	@echo "Formatting complete."
	
build:
	@echo "Building the project..."
	npm run build
	@echo "Build complete. Files written to $(OUTPUT_DIR)."


dev_deploy: build
	sudo rm -rf /opt/homebrew/var/www
	cp -r ./output/ /opt/homebrew/var/www

prod_deploy: build
	aws s3 sync ./output/ s3://spottofinance.com.au --profile qtechit
	aws cloudfront create-invalidation --distribution-id=E17ZYXG5PGP73T --paths "/*" --profile qtechit
