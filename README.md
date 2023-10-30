# Micro Front-end Loader

Micro Front-end Loader (or MFE Loader) is a powerful utility that simplifies the process of loading remote apps or modules dynamically within a host/container app at runtime using Webpack 5's [Module Federation](https://webpack.js.org/concepts/module-federation/). It also provides a lot of control and flexibility to the developers with its configurable options.

#### This tool can be used in any client side rendered app that uses Webpack's ModuleFederationPlugin for federating modules

## Table of Contents

- [Features](#features)
- [Usage](#usage)
- [RemoteModuleProps](#remotemoduleprops)
- [Sample](#sample)

## Features

1. **Lightweight** - MFE Loader is a lightweight package with `0` dependencies.
2. **Dynamic Loading** - Load remote apps or modules on demand at runtime.
3. **Automatic Environment Handling** - Automatically detects the current environment and accordingly, builds the base `remoteUrl`.
4. **Error Boundary** - It comes with a default Error Boundary component that will handle the errors while loading the modules. You can also create your own custom Error Boundary component and use it instead of the default one.
5. **Lazy Loaded** - The remote modules are lazy loaded by default using React's `lazy` and `Suspense` components. A static `SkeletonLoader` component is used as a fallback while the module is being loaded. You can also provide your own custom fallback component.
6. **Caching** - Caches the loaded modules to avoid loading them again.

> **_NOTE:_**
>
> - No need to wrap the components in an asynchronous boundary (like creating a bootstrap.js file) to load remote modules as MFE Loader will handle that for you.
> - If you want to import remotes statically (not recommended), then you might need an asynchronous boundary.
> - No need to configure the remotes in the Webpack configuration file of your host/container app (i.e. no need to define `remotes` in host module federation config).

## Usage

1. Install the package using `npm install @coderebus/microapp-loader` or `yarn add @coderebus/microapp-loader`.

2. Import `FederatedComponent` and [RemoteModuleProps](#remotemoduleprops) from the package where you want to load any exposed module.

   ```jsx
   import {
     FederatedComponent,
     RemoteModuleProps,
   } from "@coderebus/microapp-loader";
   ```

3. Create an object that will contain the information of the remote module to be loaded and then, provide it to the `FederatedComponent` as a prop.

   ```jsx
   const config: RemoteModuleProps = {
     scope: "remote_app1",
     module: "Header",
     url: `http://localhost:3000/remoteEntry.js`, // manually add the url of the remoteEntry.js file
   };
   ```

   ```jsx
   <FederatedComponent {...config} />
   ```

## RemoteModuleProps

| Prop             | Required | Type                               | Description                                                                            |
| ---------------- | -------- | ---------------------------------- | -------------------------------------------------------------------------------------- |
| scope            | Y        | `string`                           | The scope of the remote app.                                                           |
| module           | Y        | `string`                           | The name of the module to be loaded.                                                   |
| url              | Y        | `string`                           | The URL of the remoteEntry.js file of the remote app.                                  |
| suspenseFallback | N        | `() => JSX.Element` or `ReactNode` | The fallback component to be rendered while the module is being loaded.                |
| errorFallback    | N        | `() =>JSX.Element` or `ReactNode`  | The fallback component to be rendered if there is an error while rendering the module. |
| ErrorBoundary    | N        | `ComponentType<any>`               | A custom Error Boundary component to be used instead of the default one.               |

## Sample

```jsx
import React, { useState } from "react";
import {
  FederatedComponent,
  RemoteModuleProps,
} from "@coderebus/microapp-loader";
import { Button, Loader } from "my-ui-lib"; // change the import accordingly

const ErrorFallback = <div>Something went wrong!</div>;

const config: RemoteModuleProps = {
  scope: "remote_app1",
  module: "Header",
  url: `http://localhost:3000/remoteEntry.js`,
  suspenseFallback: Loader, // optional but recommended
  errorFallback: ErrorFallback, // optional
};

const App = () => {
  const [load, setLoad] = useState(false);

  return (
    <div>
      <Button onClick={() => setLoad(true)}>Load Component</Button>
      {load && <FederatedComponent {...config} />}
    </div>
  );
};
```

> **_FEW POINTS TO NOTE:_**
>
> - If you want to create and use your own custom Error Boundary component, then make sure to include `ErrorBoundary` in the config object.
> - You do not have to provide `errorFallback` if you are using your own custom Error Boundary component.
> - I would recommend using the [react-error-boundary](https://www.npmjs.com/package/react-error-boundary) package to create your own custom Error Boundary component. Also, use this amazing [blog by Kent C. Dodds](https://kentcdodds.com/blog/use-react-error-boundary-to-handle-errors-in-react) as a reference.
