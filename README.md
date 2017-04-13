# Pigalle Rest [![Build Status](https://travis-ci.org/9fevrier/pigalle-rest.svg?branch=master)](https://travis-ci.org/9fevrier/pigalle-rest)

Quickly reate NodeJS/Express.js RESTful applications using the Pigalle collection of decorators!

## Requires

* [NodeJS](http://nodejs.org) >= 5.7.0 
* [Pigalle Container](https://github.com/9fevrier/pigalle-container)

## Installation 

    npm install pigalle-rest

## Tests

    npm test
    
## Build

    npm install
    gulp babel
   
## Live development

    gulp watch
   
## Usage

## Example

See the example: `test/testApp/`

### Controller: `app/controller.js`

    import {Autowired, Component, container} from 'pigalle-container';
    import {RequestMapping, RequestMethod} from 'pigalle-rest';
    
    @Autowired()
    @Component('restControllerComponent')
    export default class Controller {
      constructor() {
        this._memoryDB = ['item1'];
      }
    
      @RequestMapping({value: '/api/items', method: RequestMethod.GET})
      list(req, res, next) {
        return res.json(this._memoryDB);
      }
    
      @RequestMapping({value: '/api/item', method: RequestMethod.POST})
      create(req, res, next) {
        const data = req.body;
        if (data.item) {
          this._memoryDB.push(data.item);
        }
        return res.json(data)
      }
    }

### ExpressJS server: `server.js`

    import express from 'express';
    import path from 'path';
    import http from 'http';
    import util from 'util';
    import bodyParser from 'body-parser';
    
    import {container} from 'pigalle-container';
    import {RestRunner} from 'pigalle-rest';
    
    // The ExpressJS application.
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    
    
    // The application directory.
    const appDir = path.join(__dirname, 'app/');
    
    // The REST router!
    const restRunner = RestRunner.instance;
    restRunner.app = app;
    restRunner.native = new express.Router(); // The native express router.
    
    // Run the REST application!
    container.scan(appDir).run().inject().run().done((instance) => {
      restRunner.initializeRouter().run().done((restRunner) => {
    
        const server = http.createServer(app);
        server.listen(3000, () => {
          console.log('Server is listening: http://localhost:3000/');
        });
    
      }).error((err) => {
        console.log('Error when initialize Pigalle RestRunner: ' + err.stack);
      });
    
    }).error((err) => {
      console.log('Error when initialize container: ' + err.stack);
    });

### Run application

    node ./node_modules/babel-cli/bin/babel-node.js \
        --presets es2015,stage-1 \
        --plugins transform-decorators-legacy \
        test/testApp/server.js
        
### Call services

* `GET /api/items` to obtain the list of items 
* `POST /api/item` to add an item to list

## Change history

### v0.1.0 (2016-09-28)

* Transform `RestRunner` as a real singleton.
* The attribute `nativeRouter` of `RestRunner` has been renamed to `native`.
* By using the unique container now provided by pigalle-container:
  * `setContainer` method has been removed in the `RestRunner` class;
  * `@RequestMapping`: the `container` parameter has been removed.
  * `@RequestMapping`: the `component` parameter has been removed (automatic binding).
* Upgrade dependencies: 
  * babel-cli@6.14.0
  * babel-preset-es2015@6.14.0
* Upgrade README.

### v0.0.2

* Add `preprocess` argument in `@RequestMapping`.

### v0.0.1

Initial version including:

* `RequestMapping` decorator
* `RequestMethod` enum

## License


    The MIT License (MIT)
    
    Copyright (c) 2016 9 Février <contact@9fevrier.com>
    
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
