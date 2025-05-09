.PHONY: build
build:
	pyinstaller --onefile \
  	--add-data "image_classifier.keras:." \
  	--add-data "classes.json:." \
  	predict.py