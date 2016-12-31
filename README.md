# weave
A framework for building universal inferno applications

## Feature

* Inferno 1.0.3
* Express 4
* Universal rendering (Server-side and Browser)
* Offline-first
* Redux predictable state
* Redux persistent storage with `localforage`
* Redux Thunk support
* Initial props when page loads `static async getInitialProps ({ navigator, location, document, cookies, headers })`
* Appending elements to the `<head>`
* [Redux-Devtools Chrome Extension](https://github.com/zalmoxisus/redux-devtools-extension)
* CSS Modules
* Live reload

## Installation

Install weave-io library
```
$ npm install weave-io --save
```

Add script to your package.json
```
{
  "scripts": {
    "dev": "weave",
    "build": "weave build"
  }
}
```

Create `index.js` file

```
import Inferno from 'inferno';
import Component from 'inferno-component';

import { Router, Route } from 'weave-router';

const Weave = (props) => <div>Welcome to Weave!</div>

export default () => <Router>
  <Route path="/" component={Weave} />
  <Route path="*" component={Weave} />
</Router>
```
## Usage

#### Initialization
```
import Inferno from 'inferno';
import Component from 'inferno-component';

export default class Path extends Component {

  static async getInitialProps({ location }) {
    return { pathname: location.pathname };
  }

  render() {
    return <div>Path: { this.props.pathname }</div>
  }
}
```

#### Title and Meta tags
```
import Inferno from 'inferno';
import Component from 'inferno-component';

import { Head, Title, Meta } from 'weave-head';

export default class Sample extends Component {

  static async getInitialProps({ location }) {
    return { pathname: location.pathname };
  }

  render() {
    const { pathname } = this.props;
    return <div>
      <Head>
        <Title>{ pathname }</Title>
        <Meta name="description" content="content here" />
      </Head>
      Path: { this.props.pathname }
    </div>
  }
}
```

#### Redux
```
function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1
  ...
}

const reducers = { counter };

export default () => <Router reducers={ reducers }>
  ...
</Router>
```

#### CSS

```
import styles from './styles.css'

const view = () => <div className={styles.something}>
  ...
</div>
```

## Development
```
$ npm run dev
```

## Bundling
```
$ npm run build
```

## Contributing

Everyone is encouraged to help improve this project. Here are a few ways you can help:

- [Report bugs](https://github.com/samuelngs/weave/issues)
- Fix bugs and [submit pull requests](https://github.com/samuelngs/weave/pulls)
- Write, clarify, or fix documentation
- Suggest or add new features

## License

This project is distributed under the MIT license found in the [LICENSE](./LICENSE) file.

```
The MIT License (MIT)

Copyright (c) 2016 Samuel

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
```

