import { RequestHandler, RouterOptions } from 'express';
import 'reflect-metadata';

type Middleware = RequestHandler;
type WrapperFunction = (action: any) => any;
type Controller = InstanceType<any>;

enum Route {
  CHECK_OUT = 'checkout',
  COPY = 'copy',
  DELETE = 'delete',
  GET = 'get',
  HEAD = 'head',
  LOCK = 'lock',
  MERGE = 'merge',
  MK_ACTIVITY = 'mkactivity',
  MK_COL = 'mkcol',
  MOVE = 'move',
  M_SEARCH = 'm_search',
  NOTIFY = 'notify',
  OPTIONS = 'options',
  PATCH = 'patch',
  POST = 'post',
  PURGE = 'purge',
  PUT = 'put',
  REPORT = 'REPORT',
  SEARCH = 'search',
  SUBSCRIBE = 'subscribe',
  TRACE = 'trace',
  UNLOCK = 'unlock',
  UN_SUBSCRIBE = 'unsubscribe',
}

export function Checkout(path?: string): MethodDecorator {
  return RoutesUtility(Route.CHECK_OUT, path);
}

export function Copy(path?: string): MethodDecorator {
  return RoutesUtility(Route.COPY, path);
}

export function Delete(path?: string): MethodDecorator {
  return RoutesUtility(Route.DELETE, path);
}

export function Get(path?: string): MethodDecorator {
  return RoutesUtility(Route.GET, path);
}

export function Head(path?: string): MethodDecorator {
  return RoutesUtility(Route.HEAD, path);
}

export function Lock(path?: string): MethodDecorator {
  return RoutesUtility(Route.LOCK, path);
}

export function Merge(path?: string): MethodDecorator {
  return RoutesUtility(Route.MERGE, path);
}

export function Mkactivity(path?: string): MethodDecorator {
  return RoutesUtility(Route.MK_ACTIVITY, path);
}

export function Mkcol(path?: string): MethodDecorator {
  return RoutesUtility(Route.MK_COL, path);
}

export function Move(path?: string): MethodDecorator {
  return RoutesUtility(Route.MOVE, path);
}

export function MSearch(path?: string): MethodDecorator {
  return RoutesUtility(Route.M_SEARCH, path);
}

export function Notify(path?: string): MethodDecorator {
  return RoutesUtility(Route.NOTIFY, path);
}

export function Options(path?: string): MethodDecorator {
  return RoutesUtility(Route.OPTIONS, path);
}

export function Patch(path?: string): MethodDecorator {
  return RoutesUtility(Route.PATCH, path);
}

export function Post(path?: string): MethodDecorator {
  return RoutesUtility(Route.POST, path);
}

export function Purge(path?: string): MethodDecorator {
  return RoutesUtility(Route.PURGE, path);
}

export function Put(path?: string): MethodDecorator {
  return RoutesUtility(Route.PUT, path);
}

export function Report(path?: string): MethodDecorator {
  return RoutesUtility(Route.REPORT, path);
}

export function Search(path?: string): MethodDecorator {
  return RoutesUtility(Route.SEARCH, path);
}

export function Subscribe(path?: string): MethodDecorator {
  return RoutesUtility(Route.SUBSCRIBE, path);
}

export function Trace(path?: string): MethodDecorator {
  return RoutesUtility(Route.TRACE, path);
}

export function Unlock(path?: string): MethodDecorator {
  return RoutesUtility(Route.UNLOCK, path);
}

export function Unsubscribe(path?: string): MethodDecorator {
  return RoutesUtility(Route.UN_SUBSCRIBE, path);
}

function RoutesUtility(httpmethods: string, path?: string): MethodDecorator {
  return (target: any, property: string | symbol, descriptor?: PropertyDescriptor) => {
    let routeAnnotations = Reflect.getOwnMetadata(property, target);
    if (!routeAnnotations) {
      routeAnnotations = {};
    }
    routeAnnotations = {
      httpmethods,
      path: path ? '/' + path : '',
      ...routeAnnotations,
    };
    Reflect.defineMetadata(property, routeAnnotations, target);
    if (descriptor) {
      return descriptor;
    }
  };
}
