const src=function(filePath){return "../src/"+filePath};
const errors=function(filePath){return "../src/errors/"+filePath};

const assert=require('chai').assert;
const Parsed=require(src('parsed.js'));
const StrictParser=require(src('index.js')).StrictParser;
const InvalidKeyError=require(errors('invalidKeyError.js'));

var invalidKeyErrorChecker=function(key,pos) {
  return function(err) {
    if(err instanceof InvalidKeyError && err.invalidKey==key && err.position==pos)
      return true;
    return false;
  }
}

describe("strict parser",function(){
  it("should only parse keys that are specified for a single key",function(){
    let kvParser=new StrictParser(["name"]);
    assert.throws(
      () => { var p=kvParser.parse("age=23");}
    );
    try{
      assert.throws(
        () => { var p=kvParser.parse("age=23");}
      );
    }catch(ex){
      invalidKeyErrorChecker("age",5);
    }
  });

  it("should only parse keys that are specified for multiple keys",function(){
    let kvParser=new StrictParser(["name","age"]);
    let expected=new Parsed();
    let actual=kvParser.parse("name=john age=23");
    expected['name']="john";
    expected['age']="23";
    assert.deepEqual(expected,actual);
    assert.throws(
      () => { var p=kvParser.parse("color=blue");}
    );
    try{
      assert.throws(
        () => { var p=kvParser.parse("color=blue");}
      );
    }catch(ex){
      invalidKeyErrorChecker("color",9);
    }
  });

  it("should throw an error when one of the keys is not valid",function(){
    let kvParser=new StrictParser(["name","age"]);
    assert.throws(
      () => { var p=kvParser.parse("name=john color=blue age=23");}
    );
    try{
      assert.throws(
        () => { var p=kvParser.parse("name=john color=blue age=23");}
      );
    }catch(ex){
      invalidKeyErrorChecker("color",20);
    }
  });

  it("should throw an error on invalid key when there are spaces between keys and assignment operators",function(){
    let kvParser=new StrictParser(["name","age"]);
    assert.throws(
      () => { var p=kvParser.parse("color   = blue");}
    );
    try{
      assert.throws(
        () => { var p=kvParser.parse("color   = blue");}
      );
    }catch(ex){
      invalidKeyErrorChecker("color",13);
    }
  });

  it("should throw an error on invalid key when there are quotes on values",function(){
    let kvParser=new StrictParser(["name","age"]);
    assert.throws(
      () => { var p=kvParser.parse("color   = \"blue\"");}
    );
    try{
      assert.throws(
        () => { var p=kvParser.parse("color   = \"blue\"");}
      );
    }catch(ex){
      invalidKeyErrorChecker("color",15);
    }
  });

  it("should throw an error on invalid key when there are cases of both quotes and no quotes",function(){
    let kvParser=new StrictParser(["name","age"]);
    assert.throws(
      () => { var p=kvParser.parse("name = john color   = \"light blue\"");}
    );
    try{
      assert.throws(
        () => { var p=kvParser.parse("name = john color   = \"light blue\"");}
      );
    }catch(ex){
      invalidKeyErrorChecker("color",33);
    }
  });

  it("should throw an error when no valid keys are specified",function(){
    let kvParser=new StrictParser([]);
    assert.throws(
      () => { var p=kvParser.parse("name=john");}
    );
    try{
      assert.throws(
        () => { var p=kvParser.parse("name=john");}
      );
    }catch(ex){
      invalidKeyErrorChecker("name",8);
    }
  });

  it("should throw an error when no array is passed",function(){
    let kvParser=new StrictParser();
    assert.throws(
      () => { var p=kvParser.parse("name=john");}
    );
    try{
      assert.throws(
        () => { var p=kvParser.parse("name=john");}
      );
    }catch(ex){
      invalidKeyErrorChecker("name",8);
    }
  });

});
