import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { AsyncComponent } from ".";

test("it renders correctly", async () => {
  render(<AsyncComponent />);

  expect(screen.getByText("olá")).toBeInTheDocument();

  // To verify if an item can show in component
  // await waitFor(() => {
  //   return expect(
  //     screen.getByText("Button is now visible")
  //   ).toBeInTheDocument();
  // });

  // To verify if an item can unshow in component
  // await waitForElementToBeRemoved(
  //   screen.queryByText("Button has invisible function")
  // );

  await waitFor(() => {
    return expect(
      screen.queryByText("Button has invisible function")
    ).not.toBeInTheDocument();
  });
});

/**
 * GET => procuram por um elemento de forma async, ou seja,
 * se não estiver em tela (ainda) ou se ele não encontrar,
 * ele vai dar erro
 *
 * QUERY => vai procurar, porém mesmo que não encontre, não vai dar erro
 *
 * FIND => vai procurar, se não existir vai ficar monitorando se vai aparecer
 * se não aparecer, vai dar erro.
 */
