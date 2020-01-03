import * as express from 'express';
import { Application, Request, Response, Router, NextFunction } from 'express';
import {ClassProps } from './decorators/controller.decorators';
import {IRouterAndPath} from './route.server'

type Controller = InstanceType<any>;
type RouterStore = ((options?: any) => any);

export class OpenAPIServer {

  private readonly _app: Application;
  private logFlag = false;

  constructor(showLogs?: boolean) {
      this._app = express();
      this.logFlag = showLogs || false;
  }

  protected get app(): Application {
      return this._app;
  }

  protected get showLogs(): boolean {
      return this.logFlag;
  }

  protected set showLogs(showLogs: boolean) {
      this.logFlag = showLogs;
  }


  protected addControllers(controllers: Controller | Controller[], routerLib?: RouterStore): void {
      controllers = (controllers instanceof Array) ? controllers : [controllers];
      const routerLibrary = routerLib || Router;
      controllers.forEach((controller: Controller) => {
          if (controller) {
              const { basePath, router } = this.getRouter(routerLibrary, controller);
              if (basePath && router) {
                  this.app.use(basePath, router);
              }
          }
      });
  }

  private getRouter(routerLibrary: RouterStore, controller: Controller): IRouterAndPath {
      const prototype = Object.getPrototypeOf(controller);
      const options = Reflect.getOwnMetadata(ClassProps.Options, prototype);

      let router: any;
      if (options) {
          router = routerLibrary(options);
      } else {
          router = routerLibrary();
      }
      const basePath = Reflect.getOwnMetadata(ClassProps.BasePath, prototype);
      if (!basePath) {
          return {
              basePath: null,
              router: null,
          };
      }

      if (this.showLogs) {
          console.log('Initializing the controller : ' + controller.constructor.name);
      }
      // Get middleware
      const classMiddleware = Reflect.getOwnMetadata(ClassProps.Middleware, prototype);
      if (classMiddleware) {
          router.use(classMiddleware);
      }
      // Get class-wrapper
      const classWrapper = Reflect.getOwnMetadata(ClassProps.Wrapper, prototype);

      // Add paths/functions to router-object
      let members = Object.getOwnPropertyNames(controller);
      members = members.concat(Object.getOwnPropertyNames(prototype));
      members.forEach((member) => {
          const route = controller[member];
          const routeProperties = Reflect.getOwnMetadata(member, prototype);
          if (route && routeProperties) {
              const { routeMiddleware, httpVerb: httpmethods, path, routeWrapper } = routeProperties;
              let callBack = (req: Request, res: Response, next: NextFunction) => {
                  return controller[member](req, res, next);
              };
              if (classWrapper) {
                  callBack = classWrapper(callBack);
              }
              if (routeWrapper) {
                  callBack = routeWrapper(callBack);
              }
              if (routeMiddleware) {
                  router[httpmethods](path, routeMiddleware, callBack);
              } else {
                  router[httpmethods](path, callBack);
              }
          }
      });

      // Recursively add child controllers
      let children = Reflect.getOwnMetadata(ClassProps.Children, prototype);
      if (children) {
          children = (children instanceof Array) ? children : [children];
          children.forEach((child: Controller) => {
              const childRouterAndPath = this.getRouter(routerLibrary, child);
              if (childRouterAndPath.router) {
                  router.use(childRouterAndPath.basePath, childRouterAndPath.router);
              }
          });
      }

      return {
          basePath,
          router,
      };
  }
}