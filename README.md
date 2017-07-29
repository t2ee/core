# Example

## Auto Configuration

### Load Configuration File

> Configurations can be loaded through decorators or manually

#### Load mannually

```typescript
import {
    ConfigurationStore,
} from '@t2ee/core';
ConfigurationStore.loadFile(path.resolve(__dirname, `application`), null);
```

> This will search for file where its name starts with `application`, ending with (in the order of): `yaml`, `yml`, `json`, `.js`

> If a envrionment variable (second arugment) is passed, it will search for file where its name starts with `application.{env}`. E.g, if envrionment variable is `dev`, it will search for `application.dev`.

#### Load through decorators

```typescript
import {
    EnableConfiguration,
}  from '@t2ee/core';

@EnableConfiguration('application')
class Main {

}

@EnableConfiguration(() => 'application')
class Main {

}
```

> It does the same procedure except it does not take an environment argument


### Use Configuration

`application.yaml`
```yaml
server:
    port: 80
```

```typescript
import {
    Value,
    Container,
    Component,
    ConfigurationStore,
} from 't2ee/core';

ConfigurationStore.loadFile(path.resolve(__dirname, `application`));

@Component
class Main {
    @Value('server.port') port: number;

    test() {
        console.log(this.port);
    }
}

const main = Container.get(Main);
main.test();
```

### Provide Dynamic Usage in configuration file

> this allows developers to provide custom variables to be used in configuration files

`example.yaml`
```yaml
level: LogLevel.DEBUG
random_value: random(100)
```

`index.ts`
```typescript
import {
    ConfigurationStore,
} from '@t2ee/core';

enum LogLevel {
    DEBUG,
    ERROR,
}

ConfigurationStore.provide('LogLevel', LogLevel);
ConfigurationStore.provide('random', (num) => Math.ceil(Math.random() * num));
```

### Bean Configuration

```typescript
import {
    Bean,
    Configuration,
    Component,
    Container,
    AutoWired,
} from '@t2ee/core';

class Time {
    date: Date = new Date();
}

@Configuration
class ConfigProvider {
    @Bean('stringValue')
    stringValue(): string {
        return `I'm string`;
    }

    @Bean('accessByKey')
    accessByKey(): Time {
        const time = new Time();
        time.date = new Date('2001-01-01');
        return time;
    }

    @Bean
    accessByClass(): Time {
        return new Time();
    }
}

@Component
class Mountable {
    value: stirng = 'mountable';
}

@Component
class Main {
    @AutoWired('stringValue')
    privateStringValue: string;

    @AutoWired('accessByKey')
    oldTime: Time;

    @AutoWired
    latestTime: Time;

    @AutoWired
    mountable: Mountable;
}

const main = Container.get(Main);
```

