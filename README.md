[![Build](https://github.com/BRIKEV/openapi-validator-utils/actions/workflows/runTests.yml/badge.svg)](https://github.com/BRIKEV/openapi-validator-utils/actions/workflows/runTests.yml)
[![Known Vulnerabilities](https://snyk.io/test/github/BRIKEV/openapi-validator-utils/badge.svg)](https://snyk.io/test/github/BRIKEV/openapi-validator-utils)
[![Maintainability](https://api.codeclimate.com/v1/badges/efee2f09c8c1887ccbf9/maintainability)](https://codeclimate.com/github/BRIKEV/openapi-validator-utils/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/efee2f09c8c1887ccbf9/test_coverage)](https://codeclimate.com/github/BRIKEV/openapi-validator-utils/test_coverage)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

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
| [validateRequiredValues](#validateRequiredValues) | function | Method to required parameters |
| [isRequestRequired](#isRequestRequired) | function | Method to validate if requestBody is necessary |

#### validateRequest

```js
validateRequest(payload, endpoint, method, contentType)
```

| Name        | Type   | Description        |
| ------------|:------:| ------------------:|
| payload     | object | Payload we want to validate |
| endpoint    | string | OpenApi endpoint we want to validate |
| method      | string | OpenApi method we want to validate |
| contentType | string | Content api of the request we want to validate. Optional |

#### validateQueryParam

```js
validateQueryParam(payload, endpoint, method, contentType)
```

| Name        | Type   | Description        |
| ------------|:------:| ------------------:|
| payload     | object | Payload we want to validate |
| endpoint    | string | OpenApi endpoint we want to validate |
| method      | string | OpenApi method we want to validate |
| contentType | string | Content api of the request we want to validate. Optional |

#### validatePathParam

```js
validatePathParam(payload, endpoint, method, contentType)
```

| Name        | Type   | Description        |
| ------------|:------:| ------------------:|
| payload     | object | Payload we want to validate |
| endpoint    | string | OpenApi endpoint we want to validate |
| method      | string | OpenApi method we want to validate |
| contentType | string | Content api of the request we want to validate. Optional |

#### validateHeaderParam

```js
validateHeaderParam(payload, endpoint, method, contentType)
```

| Name        | Type   | Description        |
| ------------|:------:| ------------------:|
| payload     | object | Payload we want to validate |
| endpoint    | string | OpenApi endpoint we want to validate |
| method      | string | OpenApi method we want to validate |
| contentType | string | Content api of the request we want to validate. Optional |

#### validateResponse

```js
validateResponse(payload, endpoint, method, status, contentType)
```

| Name        | Type   | Description        |
| ------------|:------:| ------------------:|
| payload     | object | Payload we want to validate |
| endpoint    | string | OpenApi endpoint we want to validate |
| method      | string | OpenApi method we want to validate |
| status      | string | OpenApi status we want to validate |
| contentType | string | Content api of the request we want to validate. Optional |

#### validateRequiredValues

```js
validateRequiredValues(values, endpoint, method)
```

| Name        | Type   | Description        |
| ------------|:------:| ------------------:|
| values      | object | Values we want to check if they are required |
| endpoint    | string | OpenApi endpoint we want to validate |
| method      | string | OpenApi method we want to validate |

#### isRequestRequired

```js
isRequestRequired(endpoint, method, contentType)
```

| Name        | Type   | Description        |
| ------------|:------:| ------------------:|
| endpoint    | string | OpenApi endpoint we want to validate |
| method      | string | OpenApi method we want to validate |
| contentType | string | Content api of the request we want to validate. Optional |
