# Craft UltraKit

Craft UltraKit builds awesome assets for your craft site. (You can actually use it for any site)

### What's in it?

- [Gulp](http://gulpjs.com/)
- [BrowserSync](https://www.browsersync.io/)
- [Webpack](https://webpack.github.io/)
- [Babel](https://babeljs.io/)
- [jsHint](http://jshint.com/)
- [Sass](http://sass-lang.com/) + [Autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer)

Everything is handled trough Gulp. Spinning up the dev server with live-reloading, compiling  modules and ES6 into a bundle and compiling scss/sass into css. Read more below about the usage.

### Setting things up:

Make sure to setup a vhost with Mamp (or something alike) that will be serving the /**public** folder of this project root. More info on how to do this read: [Adding a virtual host in Mamp](https://medium.com/@wilbo/adding-a-virtual-host-in-mamp-for-mac-a6c717cc0475#.hz6nhm20v). It basically comes down to editing these two files (with Atom):

    $ atom /etc/hosts
    $ atom /Applications/MAMP/conf/apache/extra/httpd-vhosts.conf

After having your Mamp settings in order, edit the proxy in gulpfile.js on line 25 to match the domain you just configured.

Next up, clone the project files and install the dependencies:

    $ git clone https://github.com/wilbo/Craft-UltraKit.git
    $ cd Craft-UltraKit
    $ npm install

Finally, download the Craft cms from [craftcms.com](https://craftcms.com/) and drag the content of the zip inside the project. Done!

### Usage:

Use the following commands to start developing/build assets:

    # Build assets, BrowserSync dev server
    $ gulp

    # Build minified assets, ready for production
    $ gulp build --env production
