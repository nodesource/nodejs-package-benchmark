// Loads a lot of libraries and demonstrates various TypeScript features
import 'autocannon'
import 'dotenv'
import 'fastify'
import 'lodash'
import 'moment'
import 'pino'
import 'piscina'
import 'prettier'
import 'tinybench'
import 'typescript'
import 'underscore'
import 'winston'

// Decorators
function Logger(target: any, propertyKey: string) {
  console.log(`Property ${propertyKey} has been accessed at ${target}`);
}

// Enums
enum Color {
  Red,
  Green,
  Blue,
  Yellow,
  Purple,
  Cyan,
  Magenta,
  White,
  Black,
  Orange,
  Pink,
  Brown,
  Grey,
  Violet,
  Indigo
}

// Interfaces
interface Person {
  name: string;
  age: number;
  greet(): void;
}

interface Employee extends Person {
  employeeId: number;
  department: string;
}

// Generic Interface
interface Repository<T> {
  getById(id: number): T;
  save(entity: T): void;
  delete(id: number): void;
  getAll(): T[];
}

Logger({ name: 'Alice', age: 30 }, 'name');

// Classes with generics and decorators
class User implements Person {
  name: string;
  age: number;
  private static instance: User;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  static getInstance(name: string, age: number): User {
    if (!User.instance) {
      User.instance = new User(name, age);
    }
    return User.instance;
  }

  greet() {
    console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
  }

  changeName(newName: string): void {
    this.name = newName;
  }
}

class Manager extends User implements Employee {
  employeeId: number;
  department: string;

  constructor(name: string, age: number, employeeId: number, department: string) {
    super(name, age);
    this.employeeId = employeeId;
    this.department = department;
  }

  greet() {
    super.greet();
    console.log(
      `I am a manager of the ${this.department} department with ID: ${this.employeeId}`
    );
  }
}

// Abstract class
abstract class Animal {
  constructor(public name: string) {}

  abstract makeSound(): void;

  move(): void {
    console.log(`${this.name} is moving.`);
  }
}

// Inheritance
class Dog extends Animal {
  makeSound() {
    console.log('Woof! Woof!');
  }
}

class Cat extends Animal {
  makeSound() {
    console.log('Meow! Meow!');
  }
}

class Bird extends Animal {
  makeSound() {
    console.log('Chirp! Chirp!');
  }
}

// Mixins
type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = new Date();
  };
}

function Identifiable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    id = Math.floor(Math.random() * 10000);
  };
}

class BasicLogger {
  log(message: string) {
    console.log(message);
  }
}

const TimestampedLogger = Timestamped(BasicLogger);
const IdentifiedLogger = Identifiable(TimestampedLogger);

const logger = new IdentifiedLogger();
logger.log('This is a log message with a timestamp and ID.');
console.log(logger.timestamp);
console.log(logger.id);

// Namespaces
namespace MathOperations {
  export function add(x: number, y: number): number {
    return x + y;
  }

  export function subtract(x: number, y: number): number {
    return x - y;
  }

  export namespace Advanced {
    export function multiply(x: number, y: number): number {
      return x * y;
    }

    export function divide(x: number, y: number): number {
      if (y === 0) {
        throw new Error('Division by zero');
      }
      return x / y;
    }

    export function power(base: number, exponent: number): number {
      return Math.pow(base, exponent);
    }
  }
}

// Generics and Utility Types
type Nullable<T> = T | null;

class IResponse<T> {
  constructor(
    public data: Nullable<T>,
    public error: Nullable<string> = null
  ) {}
}

// Type Aliases and Union Types
type ID = string | number;

function printID(id: ID): void {
  if (typeof id === 'string') {
    console.log(`ID is a string: ${id}`);
  } else {
    console.log(`ID is a number: ${id}`);
  }
}

// Tuples
let point: [number, number] = [10, 20];
let complexPoint: [number, number, number] = [10, 20, 30];

// Assertions
let someValue: any = 'This is a string';
let strLength: number = (someValue as string).length;

// Function Overloads
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: any, b: any): any {
  return a + b;
}

// More Classes, Interfaces, and Functions
interface Car {
  make: string;
  model: string;
  year: number;
  drive(): void;
}

class SportsCar implements Car {
  constructor(
    public make: string,
    public model: string,
    public year: number
  ) {}

  drive() {
    console.log(`Driving a ${this.year} ${this.make} ${this.model}`);
  }
}

interface Bicycle {
  brand: string;
  gearCount: number;
  ride(): void;
}

class MountainBike implements Bicycle {
  constructor(
    public brand: string,
    public gearCount: number
  ) {}

  ride() {
    console.log(`Riding a ${this.brand} mountain bike with ${this.gearCount} gears`);
  }
}

class HybridBike extends MountainBike {
  constructor(
    brand: string,
    gearCount: number,
    public hasElectricAssist: boolean
  ) {
    super(brand, gearCount);
  }

  ride() {
    super.ride();
    if (this.hasElectricAssist) {
      console.log('This bike has electric assist.');
    }
  }
}

// Using the code
const user1 = User.getInstance('Alice', 30);
user1.greet();
user1.changeName('Alicia');
user1.greet();

const manager = new Manager('Bob', 45, 101, 'Sales');
manager.greet();

const repo: Repository<User> = {
  getById(id: number): User {
    return User.getInstance('Sample User', 25);
  },
  save(user: User): void {
    console.log(`User saved: ${user.name}`);
  },
  delete(id: number): void {
    console.log(`User with ID ${id} deleted`);
  },
  getAll(): User[] {
    return [User.getInstance('Sample User', 25)];
  }
};

const dog = new Dog('Buddy');
dog.makeSound();
dog.move();

const cat = new Cat('Whiskers');
cat.makeSound();
cat.move();

const bird = new Bird('Tweety');
bird.makeSound();
bird.move();

console.log(Color.Green);

console.log(MathOperations.add(5, 10));
console.log(MathOperations.Advanced.multiply(3, 7));
console.log(MathOperations.Advanced.power(2, 3));

const response = new IResponse<User>(user1);
console.log(response.data?.name);

printID('abc123');
printID(98765);

console.log(point);
console.log(complexPoint);
console.log(`Length of someValue: ${strLength}`);

console.log(add(10, 20));
console.log(add('Hello, ', 'world!'));

const sportsCar = new SportsCar('Ferrari', '488', 2021);
sportsCar.drive();

const mountainBike = new MountainBike('Trek', 18);
mountainBike.ride();

const hybridBike = new HybridBike('Specialized', 21, true);
hybridBike.ride();

// More namespaces and functions
namespace Geometry {
  export interface Shape {
    area(): number;
    perimeter(): number;
  }

  export class Rectangle implements Shape {
    constructor(
      public width: number,
      public height: number
    ) {}

    area(): number {
      return this.width * this.height;
    }

    perimeter(): number {
      return 2 * (this.width + this.height);
    }
  }

  export class Circle implements Shape {
    constructor(public radius: number) {}

    area(): number {
      return Math.PI * this.radius * this.radius;
    }

    perimeter(): number {
      return 2 * Math.PI * this.radius;
    }
  }

  export class Triangle implements Shape {
    constructor(
      public base: number,
      public height: number
    ) {}

    area(): number {
      return 0.5 * this.base * this.height;
    }

    perimeter(): number {
      // Assuming an equilateral triangle for simplicity
      return 3 * this.base;
    }
  }
}

const rectangle = new Geometry.Rectangle(10, 20);
console.log(`Rectangle Area: ${rectangle.area()}`);
console.log(`Rectangle Perimeter: ${rectangle.perimeter()}`);

const circle = new Geometry.Circle(10);
console.log(`Circle Area: ${circle.area()}`);
console.log(`Circle Perimeter: ${circle.perimeter()}`);

const triangle = new Geometry.Triangle(10, 20);
console.log(`Triangle Area: ${triangle.area()}`);
console.log(`Triangle Perimeter: ${triangle.perimeter()}`);

// More mixins and classes
function Serializable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    serialize() {
      return JSON.stringify(this);
    }
  };
}

class DataClass {
  constructor(public data: string) {}
}

const SerializableDataClass = Serializable(DataClass);
new SerializableDataClass('Some data');
