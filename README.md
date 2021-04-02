# openapi-validator-utils

This library expose some methods to validate request, parameters, headers and response based on your OpenAPI Json definition.
## Methods
### validate(openApiDef, options) -> {ValidationMethods}

You can checkout more info about this method in our [Docs link](https://brikev.github.io/openapi-validator-utils/global.html#validate).

**Parameters**

| Name        | Type   | Description        |
| ------------|:------:| ------------------:|
| openApiDef  | object | OpenAPI definition |
| options     | object | Options to extend the errorHandler or Ajv configuration |


**Returns:**
validator methods
 - Type

      [ValidatorMethods](#ValidatorMethods)

## ValidatorMethods object

These are the object keys the validate method returns.

```js
{
  validateRequest,
  validateQueryParam,
  validatePathParam,
  validateHeaderParam,
  validateResponse,
}
```

| Name                                        | Type     | Description        |
| --------------------------------------------|:--------:| ------------------:|
| [validateRequest](#validateRequest)         | function | Method to validate an endpoint's request |
| [validateQueryParam](#validateQueryParam)   | function | Method to validate an endpoint's query parameter |
| [validatePathParam](#validatePathParam)     | function | Method to validate an endpoint's path parameter |
| [validateHeaderParam](#validateHeaderParam) | function | Method to validate an endpoint's header parameter |
| [validateResponse](#validateResponse)       | function | Method to validate an endpoint's response |

#### validateRequest

```js
validateRequest(definition, endpoint, method, contentType)
```

| Name        | Type   | Description        |
| ------------|:------:| ------------------:|
| definition  | object | OpenAPI definition |
| endpoint    | string | OpenApi endpoint we want to validate |
| method      | string | OpenApi method we want to validate |
| contentType | string | Content api of the request we want to validate. Optional |

#### validateQueryParam

```js
validateQueryParam(definition, endpoint, method, contentType)
```

| Name        | Type   | Description        |
| ------------|:------:| ------------------:|
| definition  | object | OpenAPI definition |
| endpoint    | string | OpenApi endpoint we want to validate |
| method      | string | OpenApi method we want to validate |
| contentType | string | Content api of the request we want to validate. Optional |

#### validatePathParam

```js
validatePathParam(definition, endpoint, method, contentType)
```

| Name        | Type   | Description        |
| ------------|:------:| ------------------:|
| definition  | object | OpenAPI definition |
| endpoint    | string | OpenApi endpoint we want to validate |
| method      | string | OpenApi method we want to validate |
| contentType | string | Content api of the request we want to validate. Optional |

#### validateHeaderParam

```js
validateHeaderParam(definition, endpoint, method, contentType)
```

| Name        | Type   | Description        |
| ------------|:------:| ------------------:|
| definition  | object | OpenAPI definition |
| endpoint    | string | OpenApi endpoint we want to validate |
| method      | string | OpenApi method we want to validate |
| contentType | string | Content api of the request we want to validate. Optional |

#### validateResponse

```js
validateResponse(definition, endpoint, method, status, contentType)
```

| Name        | Type   | Description        |
| ------------|:------:| ------------------:|
| definition  | object | OpenAPI definition |
| endpoint    | string | OpenApi endpoint we want to validate |
| method      | string | OpenApi method we want to validate |
| status      | string | OpenApi status we want to validate |
| contentType | string | Content api of the request we want to validate. Optional |

