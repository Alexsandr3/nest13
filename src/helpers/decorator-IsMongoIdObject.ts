import { registerDecorator, ValidationOptions } from "class-validator";
import { ObjectId } from "mongodb";

export function IsMongoIdObject(validationOptions?: ValidationOptions) {
  return function(object: any, propertyName: string) {
    registerDecorator({
      name: "IsMongoIdObject",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: { validate(value: any) {return ObjectId.isValid(value)}}
      //validator: { validate(value: any) {return ObjectId.isValid(value)}}
    });
  };
}
