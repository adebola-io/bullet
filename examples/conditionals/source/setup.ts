import { setup, css } from "@adbl/bullet";
import sharedStyles from "./styles/shared.css?inline";


export const { createElement } = setup({
  namespace: "x",
  styles: css([
    
    sharedStyles
  ])
});