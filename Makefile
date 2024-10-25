help::
	@echo "Spotto Finance Make File instructions"
	@echo "make help - shows help information"
	@echo "---"
	@echo "make dev_deploy - Deploy the code for dev testing"
	@echo "---"

build:
	cp -R *.html ./output
	cp -R *.js ./output
	cp -R *.css ./output
	cp -r ./images ./output
	cp -r ./blog ./output
	cp -r ./intlTelInput ./output


dev_deploy: build
	sudo rm -rf /opt/homebrew/var/www
	cp -r ./output/ /opt/homebrew/var/www

prod_deploy: build
	aws s3 sync ./output/ s3://spottofinance.com.au
	aws cloudfront create-invalidation --distribution-id=E17ZYXG5PGP73T --paths "/*"
