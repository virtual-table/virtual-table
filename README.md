# VirtualTable

## What's VirtualTable?

[VirtualTable](https://www.virtualtable.app/) is a web application for playing tabletop
role-playing games (RPGs). It can be used to aid playing in person, or enable playing
remotely online.

## Development

The source for VirtualTable is hosted on GitHub. To download it, run:

    git clone git@github.com:virtual-table/virtual-table.git

### Ruby Version

VirtualTable is developed for Ruby 2.6.1. It's recommended to use [rbenv](https://github.com/rbenv/rbenv)
in order to install it. After rbenv is installed and configured, run the following
command to install the desired ruby version:

    rbenv install 2.6.1

A `.ruby-version` file is included that will automatically switch to the correct ruby
version when entering the project directory.

### External Dependencies

#### Bundler

After installing the correct Ruby version we can use [Bundler](https://bundler.io/) to
manager our external Ruby libraries.

    gem install bundler
    bundle install

#### Yarn

We use [yarn](https://yarnpkg.com/) in combination with the [webpacker](https://github.com/rails/webpacker)
gem to manage our javascript dependencies. Make sure yarn is installed and update or
install the dependenies by running:

    yarn install

### Database / PostgreSQL

See `config/database.yml.example` for database configuration. Only PostgreSQL is supported.

## License

VirtualTable is released under the [GNU General Public License version 3](https://opensource.org/licenses/GPL-3.0)
license.

## Sources

 * [VirtualTable](https://www.virtualtable.app/) -- VirtualTable
 * [rbenv](https://github.com/rbenv/rbenv) -- A simple Ruby version management tool
 * [bundler](https://bundler.io/) -- A Ruby gem dependency manager
 * [yarn](https://yarnpkg.com/) -- Dependency managment for JavaScript
 * [webpacker](https://github.com/rails/webpacker) -- Use webpack to manage app-like JavaScript modules in Rails
 * [GPL 3.0](https://opensource.org/licenses/GPL-3.0) -- a free, copyleft license for software and other kinds of works