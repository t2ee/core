<div style="display:flex;flex-direction:row;align-items:center;justify-content:center;width:100%;" align="center"><a href="https://t2ee.org"><img width="200" src="https://github.com/t2ee/core/raw/master/docs/t2ee.png"></a><a href="https://core.t2ee.org"><img width="200" src="https://github.com/t2ee/core/raw/master/docs/core.png"></a></div>



<p align="center">
<a href="https://travis-ci.org/t2ee/core">
<img src="https://img.shields.io/travis/t2ee/core/master.svg?style=flat-square">
</a>
<a href"=https://coveralls.io/r/t2ee/core?branch=master
">
<img src="https://img.shields.io/coveralls/t2ee/core/master.svg?style=flat-square">
</a>
</p>
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
