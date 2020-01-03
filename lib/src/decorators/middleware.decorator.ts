import { RequestHandler, RouterOptions } from 'express';
import 'reflect-metadata';
type Middleware = RequestHandler;
export function Middleware(middleware: Middleware | Middleware[]): MethodDecorator {

  return (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
      let routeProperties = Reflect.getOwnMetadata(propertyKey, target);
      if (!routeProperties) {
          routeProperties = {};
      }
      routeProperties = {
          routeMiddleware: middleware,
          ...routeProperties,
      };
      Reflect.defineMetadata(propertyKey, routeProperties, target);
      if (descriptor) {
          return descriptor;
      }
  };
}
