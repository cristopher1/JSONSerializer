<h1 align="center">Welcome to @cljimenez/json-serializer-core 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/cristopher1/json-serializer#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/cristopher1/json-serializer/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/cristopher1/json-serializer/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/cristopher1/json-serializer-core" />
  </a>
</p>

> Wrapper to use JSON.parse and JSON.stringify methods, based on serializers

### 🏠 [Homepage](https://github.com/cristopher1/json-serializer#readme)

### [Index](#index)

- [Install](#install)
- [What is a Serializer?](#what-is-a-serializer?)
- [How to use?](#how-to-use?)
  - [ Obtain the JsonSerializer object](#obtain-json-serializer-object)
  - [ About the JsonSerializer methods](#about-json-serializer-methods)
    - [1. getSerializerType](#get-serializer-type)
    - [2. installSerializersAndRefreshJsonSerializer](#install-serializers)
    - [3. addSerializerAndRefreshJsonSerializer](#add-serializer)
    - [4. serialize](#serialize)
    - [5. parse](#parse)
  - [Serializes and unserializes complex object that contains objects created by the new operator](#complex-object-with-new-operator)
- [Author](#author)
- [Contributing](#contributing)
- [License](#license)

## <a id="install"></a> Install

```sh
npm install /json-serializer-core
```

**If you want to use some base serializers, you can install [@cljimenez/json-serializer-base-serializers](https://www.npmjs.com/package/@cljimenez/json-serializer-base-serializers?activeTab=readme) using:**

```
npm install @cljimenez/json-serializer-base-serializers
```

## <a id="what-is-a-serializer?"></a> What is a Serializer?

A Serializer is an object that contains three methods:

- **getSerializerType(void)=>string**: Returns the type of serializer, for example: A serializer that serializes `functions` (FunctionSerializer) must return the string `'function'`. The type returned by this method can be one of the following:
  
  1. Some value returned by **typeof operator**: `'array'`, `'function'`, `'bigint'`, `'string'`, `'object'`, etc.

     Example:

     ```js
     const myFunction = (arg1, arg2) => `${arg1} and ${arg2}`

     // Create the serializer

     const functionSerializer = {
       getSerializerType: () => 'function',
       serialize: (unserializedData) => { /* returns serialized data */ },
       parse: (serializedData) => { /* returns unserialized data */ }
     }

     /* Using class */
     class FunctionSerializer {
       /* you can to define constructor, other methods, etc */
     
       getSerializerType() {
         return 'function'
       }

       serialize(unserializedData) {
         /* returns serialized data */
       }

       parse(serializedData) {
         /* returns unserialized data */
       }
     }

     const serializer = new FunctionSerializer(/* call using some parameters */)
     ```

  2. **If the serializer serializes an object**. getSerializerType method must return a value obtained by property **Object.constructor.name**, for example: if you creates a class called `MyOwnClass`, the getSerializerType method of MyOwnClassSerializer must return the string `'MyOwnClass'`, this is equivalent to use `new MyOwnClass().constructor.name`.

     Example:

     ```js
     class MyClassToSerialize {
       // Some implementation
     }

     // Create the serializer

     /* Using object literal */
     const myClassToSerializeSerializer = {
       getSerializerType: () => 'MyClassToSerialize',
       serialize: (unserializedData) => { /* returns serialized data */ },
       parse: (serializedData) => { /* returns unserialized data */ }
     }

     /* Using class */
     class MyClassToSerializeSerializer {
       /* you can to define constructor, other methods, etc */
     
       getSerializerType() {
         return 'MyClassToSerialize'
       }

       serialize(unserializedData) {
         /* returns serialized data */
       }

       parse(serializedData) {
         /* returns unserialized data */
       }
     }

     const serializer = new MyClassToSerializeSerializer(/* call using some parameters */)
     ```

- **serialize(unserializedData: any) => object**: Serializes the data. Returns an object literal.
- **parse(serializedData: object)=>any**: Unserializes the data serialized by serialize method. The serializedData parameter contains the value returned by serialize method.

An example of complete serializer is:

```js
const dateSerializer = {
  getSerializerType: () => 'Date',
  serialize: (unserializedData) => ({
    value: unserializedData.toJSON()
  })
  // serializedData contains the value returned by serialize method.
  parse: (serializedData) => {
    const serializedDate = serializedData.value
    return new Date(serializedDate)
  }
}
```

**Note**:

  1. In general, serialize method will return an object literal with an attribute that contains some object literal or some value supported by JSON.stringify and the parse method will receive that object into the serializedData parameter.

  2. You can use any structure to define the object literal returned by serialize method.
  
  3. When to add a serializer into JsonSerializer object, that serializer is saved in an object literal in the following way:
   
     - The **`key`** is the value returned by **`getSerializerType`** method. 

     - The **`value`** is the serializer object.

     **For that reasons the serializers can be overrides when are added into JsonSerializer object. It is only necessary to return the same value in the `getSerializerType` method**

## <a id="how-to-use?"></a> How to use?

* ### <a id="obtain-json-serializer-object"></a> Obtain the JsonSerializer object

  **The `@cljimenez/json-serializer-core` package contains a class `JsonSerializerFactory` that is used to obtain a new `JsonSerializer` object**.
      
  Example for commonjs:
  
  ```js
  const jsonSerializerCore = require('@cljimenez/json-serializer-core')
  const jsonSerializer = jsonSerializerCore.JsonSerializerFactory.createJsonSerializer()
  ```
  
  Example for ES Modules:
  
  ```js
  import { JsonSerializerFactory } from '@cljimenez/json-serializer-core'
  const jsonSerializer = JsonSerializerFactory.createJsonSerializer()
  ```

* ### <a id="about-json-serializer-methods"></a> About the JsonSerializer methods
  The `JsonSerializer` object is a wrapper to use the methods JSON.stringify and JSON.parse with the replacer and reviver parameters. The `JsonSerializer` object contains five methods:
  
  1. <a id="get-serializer-type"></a> **getSerializers(void) => object**: Returns an object literal that contains all serializers added to the JsonSerializer object.
  
     Example:
  
     ```js
     const jsonSerializer = JsonSerializerFactory.createJsonSerializer()
  
     // add a FunctionSerializer
     // add a DateSerializer
  
     /*
       Returns
       {
         'function': FunctionSerializer,
         'Date': DateSerializer,
       }
      */
     jsonSerializer.getSerializers()
     ```
     The keys `function` and `Date` are obtained from getSerializerType method.
  
  2. <a id="install-serializers"></a> **installSerializersAndRefreshJsonSerializer(serializerInstaller: { install: (serializerHandler: serializerHandler, installOptions?: object) => void }, installOptions: object)=>void**: Install serializers using an installer object and installOptions object that by default is an empty object, if a serializer already exists by a specific data type (both getSerializerType methods returns the same value), this serializer will be override. SerializerHandler is an object used to manage the serializers, this object exposes the methods getSerializers and addSerializer.
  
     Example:
  
     ```js
     // serializerInstaller
      const installer = {
        install: (serializerHandler, installOptions) => {
          const options = {
            excludeSetSerializer: true,
            ...installOptions,
          };

          const bigIntSerializer = {
            getSerializerType: () => "bigint",
            serialize: (unserializedData) => ({
              value: unserializedData.toString(),
            }),
            parse: (serializedData) => {
              const { value } = serializedData
              return BigInt(value)
            },
          }

          const setSerializer = {
            getSerializerType: () => "Set",
            serialize: (unserializedData) => ({
              value: Array.from(unserializedData),
            }),
            parse: (serializedData) => {
              const { value } = serializedData
              return new Set(value)
            },
          }

          serializerHandler.addSerializer(bigIntSerializer)
          if (!options.excludeSetSerializer) {
            serializerHandler.addSerializer(setSerializer)
          }
        },
      }

      // without using the installOptions parameter
      const jsonSerializer = JsonSerializerFactory.createJsonSerializer()
      jsonSerializer.installSerializersAndRefreshJsonSerializer(installer)

     /*
         {
          bigint: {
            getSerializerType: [Function: getSerializerType],
            serialize: [Function: serialize],
            parse: [Function: parse]
          }
        }
      */
      console.log(jsonSerializer.getSerializers())

      // using the installOptions parameter
      const newJsonSerializer = JsonSerializerFactory.createJsonSerializer()
      newJsonSerializer.installSerializersAndRefreshJsonSerializer(installer, {
        excludeSetSerializer: false,
      })
     
      /*
        {                                                                                                                                         
          bigint: {
            getSerializerType: [Function: getSerializerType],
            serialize: [Function: serialize],
            parse: [Function: parse]
          },
          Set: {
            getSerializerType: [Function: getSerializerType],
            serialize: [Function: serialize],
            parse: [Function: parse]
          }
        }
       */
      console.log(newJsonSerializer.getSerializers())
     ```
  3. <a id="add-serializer"></a> **addSerializerAndRefreshJsonSerializer(serializer: Serializer) => void**: Adds a serializer, if a serializer already exists by a specific data type (both getSerializerType methods returns the same value), this serializer will be override.
  
     Example:
  
     ```js
     const bigIntSerializer = {
      getSerializerType: () => 'bigint',
      serialize: (unserializedData) => ({ value: unserializedData.toString() }),
      parse: (serializedData) => {
        const { value } = serializedData
        return BigInt(value)
       } 
     }
  
     const jsonSerializer = JsonSerializerFactory.createJsonSerializer()
  
     // adds a Serializer
     jsonSerializer.addSerializerAndRefreshJsonSerializer(bigIntSerializer)
  
     // overrides a Serializer. How both serializers serializes bigInt (its getSerializerType methods returns the same value), the first serializer is overrides for the second.
     const newBigIntSerializer = {
      getSerializerType: () => 'bigint',
      serialize: (unserializedData) => ({ value: unserializedData.toString() }),
      parse: (serializedData) => {
        const { value } = serializedData
        console.log(value)
        return BigInt(value)
       } 
     }
  
     jsonSerializer.addSerializerAndRefreshJsonSerializer(newBigIntSerializer)
     ```
  
  4. <a id="serialize"></a> **serialize(unserializedData: any, space?: string | int) => string**: This method calls the JSON.stringify method with replacer parameter, the space parameter is used to insert while space into output JSON string for readability purposes. Returns a JSON string.
  
     Example:
    
     ```js
     const bigIntSerializer = {
       getSerializerType: () => 'bigint',
       serialize: (unserializedData) => ({ value: unserializedData.toString() }),
       parse: (serializedData) => {
         const { value } = serializedData
         return BigInt(value)
       } 
     }
  
     const bigInt = BigInt(20000)
  
     const jsonSerializer = JsonSerializerFactory.createJsonSerializer()
  
     jsonSerializer.addSerializerAndRefreshJsonSerializer(bigIntSerializer)
  
     // {"__typeof__":"bigint","value":"20000"}
     console.log(jsonSerializer.serialize(bigInt))
  
     // string
     console.log(typeof jsonSerializer.serialize(bigInt))
     ```
  
     **Note**:
  
       1. When there is not a serializer to serialize data, it will be used the JSON.stringify algorithm to serialize the data.
      
       2. When a serializer serializes data, this serializer adds the `__typeof__` property to the returned serialized object. The `__typeof__` property is used to call to the appropiate serializer to unserialize data.
  
  5. <a id="parse"></a> **parse(serializedData : string) => any**: This method calls the JSON.parse method with reviver parameter, the serializedData is a valid JSON string. Returns the parsed object.
  
     Example:
  
     ```js
     const bigIntSerializer = {
        getSerializerType: () => "bigint",
        serialize: (unserializedData) => ({
          value: unserializedData.toString(),
        }),
        parse: (serializedData) => {
          const { value } = serializedData
          return BigInt(value)
        },
      };

      const bigInt = BigInt(20000)

      const jsonSerializer = JsonSerializerFactory.createJsonSerializer()

      jsonSerializer.addSerializerAndRefreshJsonSerializer(bigIntSerializer)

      const serializedData = jsonSerializer.serialize(bigInt)

      // {"__typeof__":"bigint","value":"20000"}
      console.log(serializedData)

      // string
      console.log(typeof serializedData)

      const unserializedData = jsonSerializer.parse(serializedData)

      // 20000n
      console.log(unserializedData)

      // bigint
      console.log(typeof unserializedData)
     ```

* ### <a id="complex-object-with-new-operator"></a> Serializes and unserializes complex object that contains objects created by the new operator.

  When you creates an object using the **`new`** operator, it is necessary to add to the class some method that returns an object literal representation, for example:
  
    ```js
    class MyOwnClass {
      constructor (element1, element2) {
        this.element1 = element1
        this.element2 = element2
      }
  
      // It is not necessary to call this method same toObjectLiteral, it can have other name.
      toObjectLiteral() {
        return {
          element1: this.element1,
          element2: this.element2
        }
      }
    }
    ```
  
  The object literal must have all elements to recreate the original object.
  
  **Note: It is possible that you needs to use Object.values() or other methods into parse method, when you recreates the original object using destructuring data (...data). See the parse method in the following example.**
  
  An Example for this case from the tests using in the json-serializer-core repository:
  
    ```js
    class AirplaneTestClass {
      #model
    
      constructor(model) {
        this.#model = model
      }
    
      getModel() {
        return this.#model
      }
    
      getObjectLiteral() {
        return {
          model: this.#model,
        }
      }
    }
    
    class WheelTestClass {
      #duration
    
      constructor(duration) {
        this.#duration = duration
      }
    
      getDuration() {
        return this.#duration
      }
    
      getObjectLiteral() {
        return {
          duration: this.#duration,
        }
      }
    }
    
    class TransportVehicleTestClass {
      #wheels
    
      constructor(wheels) {
        this.#wheels = wheels
      }
    
      getWheels() {
        return [...this.#wheels]
      }
    
      getObjectLiteral() {
        return {
          wheels: this.#wheels,
        }
      }
    }
    
    class AirportTestClass {
      #transportVehicles
      #airplanes
    
      constructor(transportVehicles, airplanes) {
        this.#transportVehicles = transportVehicles
        this.#airplanes = airplanes
      }
    
      getTransportVehicles() {
        return [...this.#transportVehicles]
      }
    
      getAirplanes() {
        return [...this.#airplanes]
      }
    
      getObjectLiteral() {
        return {
          transportVehicles: this.#transportVehicles,
          airplanes: this.#airplanes,
        }
      }
    }
    
    const transportVehicles = [
      new TransportVehicleTestClass([
        new WheelTestClass(faker.number.int()),
        new WheelTestClass(faker.number.int()),
        new WheelTestClass(faker.number.int()),
      ]),
      new TransportVehicleTestClass([
        new WheelTestClass(faker.number.int()),
        new WheelTestClass(faker.number.int()),
        new WheelTestClass(faker.number.int()),
        new WheelTestClass(faker.number.int()),
      ]),
      new TransportVehicleTestClass([
        new WheelTestClass(faker.number.int()),
        new WheelTestClass(faker.number.int()),
        new WheelTestClass(faker.number.int()),
        new WheelTestClass(faker.number.int()),
        new WheelTestClass(faker.number.int()),
      ]),
    ]
    
    const airplanes = [
      new AirplaneTestClass(faker.string.sample()),
      new AirplaneTestClass(faker.string.sample()),
      new AirplaneTestClass(faker.string.sample()),
      new AirplaneTestClass(faker.string.sample()),
      new AirplaneTestClass(faker.string.sample()),
      new AirplaneTestClass(faker.string.sample()),
      new AirplaneTestClass(faker.string.sample()),
    ]
    
    const unserializedData = new AirportTestClass(
      transportVehicles,
      airplanes,
    )
  
    const airportTestClassSerializer = getSerializer(
      () => 'AirportTestClass',
      (unserializerData) => ({
        value: unserializerData.getObjectLiteral(),
      }),
      (serializedData) => {
        const { value } = serializedData
        const parameters = Object.values(value)
        return new AirportTestClass(...parameters)
      },
    )
  
    const airplaneTestClassSerializer = getSerializer(
      () => 'AirplaneTestClass',
      (unserializerData) => ({
        value: unserializerData.getObjectLiteral(),
      }),
      (serializedData) => {
        const { value } = serializedData
        const parameters = Object.values(value)
        return new AirplaneTestClass(...parameters)
      },
    )
  
    const transportVehicleTestClassSerializer = getSerializer(
      () => 'TransportVehicleTestClass',
      (unserializerData) => ({
        value: unserializerData.getObjectLiteral(),
      }),
      (serializedData) => {
        const { value } = serializedData
        const parameters = Object.values(value)
        return new TransportVehicleTestClass(...parameters)
      },
    )
  
    const wheelTestClassSerializer = getSerializer(
      () => 'WheelTestClass',
      (unserializerData) => ({
        value: unserializerData.getObjectLiteral(),
      }),
      (serializedData) => {
        const { value } = serializedData
        const parameters = Object.values(value)
        return new WheelTestClass(...parameters)
      },
    )
  
    jsonSerializer.addSerializerAndRefreshJsonSerializer(
      airportTestClassSerializer,
    )
    jsonSerializer.addSerializerAndRefreshJsonSerializer(
      airplaneTestClassSerializer,
    )
    jsonSerializer.addSerializerAndRefreshJsonSerializer(
      transportVehicleTestClassSerializer,
    )
    jsonSerializer.addSerializerAndRefreshJsonSerializer(
      wheelTestClassSerializer,
    )
  
    const serializedData = jsonSerializer.serialize(unserializedData)
    ```
  
    **For this case, the jsonSerializer.serialize(unserializedData) method returns the following JSON string**:
  
    ```json
    {
      "__typeof__": "AirportTestClass",
      "value": {
        "transportVehicles": [
          {
            "__typeof__": "TransportVehicleTestClass",
            "value": {
              "wheels": [
                {
                  "__typeof__": "WheelTestClass",
                  "value": { "duration": 1987494138609664 }
                },
                {
                  "__typeof__": "WheelTestClass",
                  "value": { "duration": 1819535013314560 }
                },
                {
                  "__typeof__": "WheelTestClass",
                  "value": { "duration": 6535380662747136 }
                }
              ]
            }
          },
          {
            "__typeof__": "TransportVehicleTestClass",
            "value": {
              "wheels": [
                {
                  "__typeof__": "WheelTestClass",
                  "value": { "duration": 5250420016414720 }
                },
                {
                  "__typeof__": "WheelTestClass",
                  "value": { "duration": 7651029791277056 }
                },
                {
                  "__typeof__": "WheelTestClass",
                  "value": { "duration": 7619204396089344 }
                },
                {
                  "__typeof__": "WheelTestClass",
                  "value": { "duration": 8366722742484992 }
                }
              ]
            }
          },
          {
            "__typeof__": "TransportVehicleTestClass",
            "value": {
              "wheels": [
                {
                  "__typeof__": "WheelTestClass",
                  "value": { "duration": 8390044339404800 }
                },
                {
                  "__typeof__": "WheelTestClass",
                  "value": { "duration": 6628758633054208 }
                },
                {
                  "__typeof__": "WheelTestClass",
                  "value": { "duration": 493054882480128 }
                },
                {
                  "__typeof__": "WheelTestClass",
                  "value": { "duration": 4292716229820416 }
                },
                {
                  "__typeof__": "WheelTestClass",
                  "value": { "duration": 5818243356819456 }
                }
              ]
            }
          }
        ],
        "airplanes": [
          {
            "__typeof__": "AirplaneTestClass",
            "value": { "model": "N\"X,(e+4zs" }
          },
          {
            "__typeof__": "AirplaneTestClass",
            "value": { "model": "WP)<\"fn]vK" }
          },
          {
            "__typeof__": "AirplaneTestClass",
            "value": { "model": "b)D9bWv_;m" }
          },
          {
            "__typeof__": "AirplaneTestClass",
            "value": { "model": "`YQ4r|v9N(" }
          },
          {
            "__typeof__": "AirplaneTestClass",
            "value": { "model": "XN9r}G4ZWv" }
          },
          {
            "__typeof__": "AirplaneTestClass",
            "value": { "model": "]-u*,}_Ggp" }
          },
          {
            "__typeof__": "AirplaneTestClass",
            "value": { "model": "uY7o{p=Xt&" }
          }
        ]
      }
    }
    ```
  
    You can use the parse method to unserialize the serialized data.
  
    ```js
      const result = json.parse(serializedData)
  
      /*
       Returns all Airplanes
       [
        AirplaneTestClass {},
        AirplaneTestClass {},
        AirplaneTestClass {},
        AirplaneTestClass {},
        AirplaneTestClass {},
        AirplaneTestClass {},
        AirplaneTestClass {}
      ]
      */
      console.log(result.getAirplanes())
  
      /*
       Returns all TransportVehicles
       [                                                                                                                                              
        TransportVehicleTestClass {},                                                                                                                
        TransportVehicleTestClass {},                                                                                                                
        TransportVehicleTestClass {}                                                                                                                 
       ] 
      */
      console.log(result.getTransportVehicles())
    ```

## <a id="author"></a> Author

👤 **Cristopher Jiménez**

- Github: [@cristopher1](https://github.com/cristopher1)

## <a id="contributing"></a> 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/cristopher1/json-serializer/issues).

## <a id="license"></a> 📝 License

Copyright © 2023 [Cristopher Jiménez](https://github.com/cristopher1).<br />
This project is [MIT](https://github.com/cristopher1/json-serializer/blob/master/LICENSE) licensed.

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
