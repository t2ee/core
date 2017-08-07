<p align="center">
    <a href="https://t2ee.org">
        <img width="200" src="https://t2ee.org/img/logos/t2ee.png">
    </a>
</p>
<p align="center">
    <a href="https://core.t2ee.org">
        <img width="200" src="https://t2ee.org/img/logos/core.png">
    </a>
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/@t2ee/core">
        <img src="https://badge.fury.io/js/%40t2ee%2Fcore.svg">
    </a>
    <a href="https://travis-ci.org/t2ee/core">
        <img src="https://img.shields.io/travis/t2ee/core/master.svg?style=flat-square">
    </a>
    <a href="https://coveralls.io/r/t2ee/core?branch=master">
        <img src="https://img.shields.io/coveralls/t2ee/core/master.svg?style=flat-square">
    </a>
</p>

# Introduction

This projects aims to be foundation component for the rest of [@t2ee](https://github.com/t2ee) projects. It provides dependency injection and auto configuration functionalities.

For detailed introduction and examples, please visit [core.t2ee.org](//core.t2ee.org).

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
