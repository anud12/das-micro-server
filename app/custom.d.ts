//Allows importing of html files
declare module "*.html" {
  const value: string;
  export default value;
}