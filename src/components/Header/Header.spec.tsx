import { render, screen } from "@testing-library/react";
import { Header } from "../../components/Header";

jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/",
      };
    },
  };
});

jest.mock("next-auth/client", () => {
  return {
    useSession() {
      return [null, false];
    },
  };
});

describe("Header", () => {
  //test or it
  it("renders correctly", () => {
    render(<Header />);

    // screen.logTestingPlaygroundURL();

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Posts")).toBeInTheDocument();
  });
});
