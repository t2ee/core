<p align="center">
    <a href="http://t2ee.org">
        <img width="200" src="https://github.com/t2ee/core/raw/master/docs/t2ee.png">
    </a>
</p>
<p align="center">
    <a href="http://core.t2ee.org">
        <img width="200" src="https://github.com/t2ee/core/raw/master/docs/core.png">
    </a>
</p>

<p align="center">
    <a href="https://travis-ci.org/t2ee/core">
        <img src="https://img.shields.io/travis/t2ee/core/master.svg?style=flat-square">
    </a>
    <a href="https://coveralls.io/r/t2ee/core?branch=master">
        <img src="https://img.shields.io/coveralls/t2ee/core/master.svg?style=flat-square">
    </a>
</p>

# Introduction

This projects aims to be foundation component for the rest of [@t2ee](https://github.com/t2ee) projects. It provides dependency injection and auto configuration functionalities.

For detailed introduction and examples, please visit [core.t2ee.org](http://core.t2ee.org).

# Installation

`npm i reflect-metadata @t2ee/core -S`

# Example

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
