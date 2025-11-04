import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders app brand title and logo", () => {
  render(<App />);
  const title = screen.getByText(/Old Notepad/i);
  expect(title).toBeInTheDocument();

  const logo = screen.getByAltText(/Old Notepad app logo/i);
  expect(logo).toBeInTheDocument();
});
