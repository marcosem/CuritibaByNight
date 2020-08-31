interface ITamplateVariables {
  [key: string]: string | number;
}

export default interface IParseMailTemplateProvider {
  file: string;
  variables: ITamplateVariables;
}
