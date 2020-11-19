export const REPOSITORY_NAME = 'todo-list';

enum Routes {
  Planning,
  Doing
}
export class Navigation {

  public static isPlanning() {
    return Navigation.currentRoute === Routes.Planning;
  }

  public static isDoing() {
    return Navigation.currentRoute === Routes.Doing;
  }

  public static goToPlanning() {
    Navigation.currentRoute = Routes.Planning;
  }

  public static goToDoing() {
    Navigation.currentRoute = Routes.Doing;
  }

  private static currentRoute = Routes.Planning;
}
