import { equal } from "assert";
import {
  after,
  afterAll,
  before,
  beforeAll,
  binding,
  given,
  then,
  when
} from "cucumber-tsflow";

class Foo {
  public readonly actual = true;
}

let beforeAllCalled = false;
let afterAllCalled = false;

let afterBazCount = 0;
let afterCount = 0;

// tslint:disable-next-line:max-classes-per-file
@binding([Foo])
export default class TestSteps {
  constructor(private foo: Foo) {}

  private actual = false;

  @before()
  public before() {
    this.actual = true;
  }

  @beforeAll()
  public static beforeAll() {
    beforeAllCalled = true;
  }

  @afterAll()
  public static afterAll() {
    afterAllCalled = true;
    // TODO how to assert it ?
    // tslint:disable-next-line:no-console
    console.log("afterAll hook is called : ", afterAllCalled);
  }

  @given("foo")
  public async GivenFoo(): Promise<void> {
    await equal(beforeAllCalled, true);
    await equal(this.actual, true);
    await equal(this.foo.actual, true);
  }

  @when("bar")
  public WhenBar(): void {
    equal(1 + 1, 2, "This is true");
  }

  @then("baz")
  public ThenBaz(): void {
    equal(false, false, "This is false");
  }

  @after("not @baz")
  public after() {
    ++afterCount;
    equal(afterCount < 3, true, "It's true, I ran");
  }

  @after("@baz")
  public afterBazOnly() {
    ++afterBazCount;
    equal(afterBazCount, 1, "This should only ever be one");
  }
}
