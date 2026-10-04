.PHONY: default prepare

default: prepare

prepare:
	@for kit in starter-kit-*/starter-kit-config.properties; do \
		dir=$$(dirname "$$kit"); \
		echo "Preparing $$dir..."; \
		bash ./prepare_starter_kit.sh "$$dir"; \
	done
