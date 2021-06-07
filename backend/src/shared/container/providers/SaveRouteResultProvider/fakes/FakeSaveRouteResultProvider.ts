import ISaveRouteResultProvider from '@shared/container/providers/SaveRouteResultProvider/models/ISaveRouteResultProvider';

interface IRouteResultDTO {
  route: string;
  result: string;
}

class FakeSaveRouteResultProvider implements ISaveRouteResultProvider {
  private savedRoutesResults: IRouteResultDTO[];

  constructor() {
    this.savedRoutesResults = [];
  }

  public get(route: string): Promise<string> {
    let result = '';
    const routeResult = this.savedRoutesResults.find(
      myResult => myResult.route === route,
    );

    if (routeResult) {
      result = routeResult.result;
    }

    return Promise.resolve(result);
  }

  public set(route: string, result: string): boolean {
    const newRouteResult: IRouteResultDTO = {
      route,
      result,
    };

    const routeResult = this.savedRoutesResults.find(
      myResult => myResult.route === route,
    );

    if (routeResult) {
      this.savedRoutesResults = this.savedRoutesResults.map(myResult =>
        myResult.route === route ? newRouteResult : myResult,
      );
    } else {
      this.savedRoutesResults.push(newRouteResult);
    }
    return true;
  }

  public remove(route: string): Promise<boolean> {
    if (route.indexOf('*') >= 0) {
      const newRoute = route.replace(/[*]/gi, '');

      this.savedRoutesResults = this.savedRoutesResults.filter(
        myResult => myResult.route.indexOf(newRoute) === -1,
      );
    } else {
      this.savedRoutesResults = this.savedRoutesResults.filter(
        myResult => myResult.route !== route,
      );
    }

    return Promise.resolve(true);
  }
}

export default FakeSaveRouteResultProvider;
