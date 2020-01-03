import * as express from 'express';
import { Router } from 'express';
export interface IRouterAndPath {
  basePath: string | null;
  router: Router | null;
}
