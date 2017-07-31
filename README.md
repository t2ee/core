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
