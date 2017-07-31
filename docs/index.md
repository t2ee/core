# Introduction

This projects aims to be foundation component for the rest of [@t2ee](https://github.com/t2ee) projects. It provides dependency injection and auto configuration functionalities.

# Usage

## Basic Depedency Injection
```typescript
import {
    Component,
} from '@t2ee/core';

@Component
class Mountable {
    message: string = 'hello world';
}
```

```typescript
import {
    Component,
    AutoWired,
    Container,
} from '@t2ee/core';

@Component
class Main {
    @AutoWired mounted: Mountable;
}

const main = Container.get(Main);
console.log(main.mounted.message) // 'hello world';
```

## Auto Configuration
```typescript
//@Component can't have this
class Mountable {
    message: string = 'hello world';
}
```

```typescript
@Configuration
class Config {
    @Bean mountable(): Mountable {
        const mountable = new Mountable();
        mountable.message = 'hello';
        return mountable;
    }
    @Bean('mount') stringMountable(): Mountable {
        const mountable = new Mountable();
        mountable.message = `I'm different`;
        return mountable;
    }
}
```

```typescript
@Component
class Main {
    @AutoWired mounted: Mountable;
    @AutoWired('mount') another: Mountable;
}
const main = Container.get(Main);
console.log(main.mounted.message) // 'hello'
console.log(main.another.message) // 'I\'m different'
```

## Load configuration file and Inject

`application.yaml`
```yaml
server:
    port: 8080
```

```typescript
ConfigurationStore.loadFile(path.resolve(__dirname, 'application'));
@Component
class Main {
    @Value('server.port') port: number;
}
```

__OR__

```typescript
@EnableConfiguration('application')
//or @EnableConfiguration(() => 'application')
@Component
class Main {
    @Value('server.port') port: number;
}
```

## Function and Variables in configuration file

```yaml
level: LogLevel.DEBUG
port: random(100)
```

```typescript
import {
    ConfigurationStore,
} from '@t2ee/core';
ConfigurationStore.provide('LogLevel', LogLevel);
ConfigurationStore.provide('random', (value) => Math.ceil(Math.random() * value));
```

## Implement Custom Provider

> example scenario: extrating information from process

```typescript
function Process(name: string) {
    return (target: Object, key: string) => {
        AutoWired('process-information', { name });
    };
}
```

```typescript
class MyProvider implements Provider {
    resolve<T extends Object>(value: T, meta: AutoWireMeta, args: any[]) {
        if (type === 'process-information') {
            const { name } = meta.data;
            return process.env[name];
        }
    }
}
Container.inject('process-information', new MyProvider());
```

```typescript
@Component
class Main {
    @Process('USER')
    systemUser: string;
}
```

# API

## Coming soon ...

Coming soon...
