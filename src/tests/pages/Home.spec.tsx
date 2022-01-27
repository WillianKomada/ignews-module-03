import { render, screen } from "@testing-library/react";
import { stripe } from "../../services/stripe";

import Home, { getStaticProps } from "../../pages";
import { mocked } from "jest-mock";

jest.mock("next/router");
jest.mock("next-auth/client", () => {
  return {
    useSession: () => [null, false],
  };
});
jest.mock("../../services/stripe");

describe("Home page", () => {
  it("renders correctly", () => {
    render(<Home product={{ priceId: "fake-price-id", amount: "$10.00" }} />);

    expect(screen.getByText("for $10.00 month")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const pricesRetrieveStripeMocked = mocked(stripe.prices.retrieve);

    // sempre que o mock for de uma função que retorna uma promisse se usa esse mockResolvedValueOnce
    pricesRetrieveStripeMocked.mockResolvedValueOnce({
      id: "fake-price-id",
      unit_amount: 1000,
    } as any);
    // coloco as any quando não utilizo toda função e especifíco as que eu quero inserir

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: "fake-price-id",
            amount: "$10.00",
          },
        },
      })
    );
  });
});
