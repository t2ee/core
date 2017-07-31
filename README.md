[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
# Introduction

This projects aims to be foundation component for the rest of [@t2ee](https://github.com/t2ee) projects. It provides dependency injection and auto configuration functionalities.

For detailed introduction and examples, please visit [t2ee.org/core](http://t2ee.org/core).


```typescript
@Component({ scope: new SingletonScope() })
class BootstrapTime {
    date: new Date();
}

@Component
class Main {
    @AutoWired
    programStartedAt: BootstrapTime
}

```

[travis-image]: https://img.shields.io/travis/t2ee/core/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/t2ee/core
[coveralls-image]: https://img.shields.io/coveralls/t2ee/core/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/t2ee/core?branch=master
