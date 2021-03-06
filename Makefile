
configure:
	sudo npm install
	sudo npm install requirejs-text

all:
	echo

dist: all
	perl -pi -e 's/return (?:true|false);/return false;/sg' src/x_ite/DEBUG.js

	npm run build

	perl -pi -e 's|text/text!|text!|sg' dist/x_ite.js
	perl -pi -e 's|text/text!|text!|sg' dist/x_ite.min.js

	cp src/components.js components.js
	cp src/x_ite.html x_ite.min.html
	perl -pi -e 's|\s*<script type="text/javascript" src="\.\./node_modules/requirejs/require.js"></script>\n||sg' x_ite.min.html
	perl -pi -e 's|\s*<script type="text/javascript" src="require.config.js"></script>\n||sg'                      x_ite.min.html
	perl -pi -e 's|"x_ite.js"|"dist/x_ite.min.js"|sg'                x_ite.min.html
	perl -pi -e 's|"x_ite.css"|"dist/x_ite.css"|sg'                  x_ite.min.html
	perl -pi -e 's|\.\./x_ite.min.html|src/x_ite.html|sg'            x_ite.min.html
	perl -pi -e 's|\>x_ite.min.html|>src/x_ite.html|sg'              x_ite.min.html
	perl -pi -e 's|x_ite-dev|x_ite-min|sg'                           x_ite.min.html
	perl -pi -e 's|"bookmarks.js"|"src/bookmarks.js"|sg'             x_ite.min.html
	perl -pi -e 's|\.\./tests/|tests/|sg'                            x_ite.min.html

	perl build/dist.pl

	echo
	ls -la dist/x_ite.min.js
	echo

	perl -pi -e 's/return (?:true|false);/return true;/sg' src/x_ite/DEBUG.js

version: dist
	perl build/version.pl


clean:
	rm x_ite.min.html
	rm x_ite.uncompressed.js
	rm x_ite.min.js
