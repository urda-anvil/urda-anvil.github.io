########################################################################################################################
# Configuration & Variables
########################################################################################################################

#-----------------------------------------------------------
# General Configuration
#-----------------------------------------------------------

SHELL := /bin/bash

# Local preview server. Serving over http gives the directory-index behavior GitHub Pages
# has in production, so the clean /slug/ links resolve without the file:// shim.
SERVE_PORT := 8000

########################################################################################################################
# Commands
########################################################################################################################

# `make help` needs to be first so it is ran when a bare `make` is called.
.PHONY: help
help: # Show this help screen
	@grep -E '^[a-zA-Z_-]+:.*# .*$$' ${MAKEFILE_LIST} |\
	sort -k1,1 |\
	awk 'BEGIN {FS = ":.*?# "}; {printf "\033[1m%-30s\033[0m %s\n", $$1, $$2}'

########################################################################################################################

.PHONY: serve
serve: # Serve site/ at localhost like GitHub Pages would.
	python3 -m http.server ${SERVE_PORT} --directory ./site
