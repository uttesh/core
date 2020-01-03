import { RequestHandler, RouterOptions } from 'express';
import 'reflect-metadata';
import {Middleware} from './middleware.decorator'

type Middleware = RequestHandler;
type WrapperFunction = ((action: any) => any);
type Controller = InstanceType<any>;

export enum ClassProps {
  BasePath = 'BASE_PATH',
  Middleware = 'MIDDLEWARE',
  Wrapper = 'WRAPPER',
  Children = 'CHILDREN',
  Options = 'OPTIONS',
}

export function Controller(path: string): ClassDecorator {
  return <TFunction extends Function>(target: TFunction) => {
      Reflect.defineMetadata(ClassProps.BasePath, '/' + path, target.prototype);
      return target;
  };
}

export function ClassMiddleware(middleware: Middleware | Middleware[]): ClassDecorator {
  return <TFunction extends Function>(target: TFunction) => {
      Reflect.defineMetadata(ClassProps.Middleware, middleware, target.prototype);
      return target;
  };
}

export function ControllerWrapper(wrapperFunction: WrapperFunction): ClassDecorator {
  return <TFunction extends Function>(target: TFunction) => {
      Reflect.defineMetadata(ClassProps.Wrapper, wrapperFunction, target.prototype);
      return target;
  };
}

export function ControllerOptions(options: RouterOptions): ClassDecorator {
  return <TFunction extends Function>(target: TFunction) => {
      Reflect.defineMetadata(ClassProps.Options, options, target.prototype);
      return target;
  };
}

export function ChildControllers(controllers: Controller | Controller[]): ClassDecorator {
  return <TFunction extends Function>(target: TFunction) => {
      Reflect.defineMetadata(ClassProps.Children, controllers, target.prototype);
      return target;
  };
}


export function Wrapper(wrapperFunction: WrapperFunction) {

  return (target: any, propertyKey: string | symbol, descriptor?: PropertyDescriptor) => {
      let routeProperties = Reflect.getOwnMetadata(propertyKey, target);
      if (!routeProperties) {
          routeProperties = {};
      }
      routeProperties = {
          routeWrapper: wrapperFunction,
          ...routeProperties,
      };
      Reflect.defineMetadata(propertyKey, routeProperties, target);
      if (descriptor) {
          return descriptor;
      }
  };
}