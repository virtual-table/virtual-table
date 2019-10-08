# VirtualTable

## What's VirtualTable?

[VirtualTable](https://www.virtualtable.app/) is a web application for playing tabletop role-playing games (RPGs). It can be
used to aid playing in person, or enable playing remotely online.

## Development

The source for VirtualTable is hosted on GitHub. To download it, run:

    git clone git@github.com:virtual-table/virtual-table.git

### Ruby Version

VirtualTable is developed for Ruby 2.6.5. It's recommended to use [rbenv](https://github.com/rbenv/rbenv) in order to install 
it. After rbenv is installed and configured, run the following command to install the desired ruby version:

    rbenv install 2.6.5

A `.ruby-version` file is included that will automatically switch to the correct ruby version when entering the project 
directory.

### External Dependencies

#### 1. PostgreSQL
Before running bundler libpq-dev or its equivelent for your OS needs te be installed becaus gem pg 1.1.4 deppends on it.

Using Mac Homebrew:
    brew install postgresql

Ubuntu/Debian systems:
    udo apt-get install libpq-dev


#### 2. Bundler

After installing the correct Ruby version we can use [Bundler](https://bundler.io/) to manager our external Ruby libraries.

    gem install bundler
    bundle install

#### 3. Yarn

We use [yarn](https://yarnpkg.com/) in combination with the [webpacker](https://github.com/rails/webpacker) gem to manage our 
javascript dependencies. Make sure yarn is installed:

Using Mac Homebrew, this wil also install Node.je if it is not already installed.
    brew install yarn

Ubuntu/Debian systems
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

then:
    sudo apt-get update && sudo apt-get install yarn

Update or install the dependencies by running:

    yarn install

### Database / PostgreSQL config

See `config/database.yml.example` for database configuration. Only PostgreSQL is supported.

#### Dockerized database

The included `docker-compose.yml` file allows you to run your PostgreSQL database in a docker container. Create, or start, your database container as a daemon by running

    docker-compose up -d

Then, fill in the port the database is running on in your .env file:

```
DOCKER_DB_HOST=127.0.0.1
DOCKER_DB_PORT=32773
```

You can stop the database container by with `docker-compose stop`

### Testing [![Build Status](https://travis-ci.org/virtual-table/virtual-table.svg)](https://travis-ci.org/virtual-table/virtual-table)

We use [RSpec](https://rspec.info/) for testing our application.

## License

VirtualTable is released under the [GNU General Public License version 3](https://opensource.org/licenses/GPL-3.0).

## Sources

 * [VirtualTable](https://www.virtualtable.app/) -- VirtualTable
 * [rbenv](https://github.com/rbenv/rbenv) -- A simple Ruby version management tool
 * [bundler](https://bundler.io/) -- A Ruby gem dependency manager
 * [yarn](https://yarnpkg.com/) -- Dependency managment for JavaScript
 * [webpacker](https://github.com/rails/webpacker) -- Use webpack to manage app-like JavaScript modules in Rails
 * [RSpec](https://rspec.info/) -- Behaviour Driven Development for Ruby
 * [GPL 3.0](https://opensource.org/licenses/GPL-3.0) -- a free, copyleft license for software and other kinds of works
