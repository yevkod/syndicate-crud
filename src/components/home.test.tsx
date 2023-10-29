import "@testing-library/jest-dom";
import { screen, fireEvent, render } from "@testing-library/react";
import Home from "../../pages/home";
import mockRouter from "next-router-mock";

jest.mock("next/navigation", () => require("next-router-mock"));

describe("Home Component", () => {
  beforeAll(() => {
    mockRouter.setCurrentUrl("/home");
  });
  it("renders without errors", () => {
    render(<Home />);
  });

  it("add a new task", () => {
    render(<Home />);
    const titleInput = screen.getByPlaceholderText("Title");
    const descriptionInput = screen.getByPlaceholderText("Description");
    const addButton = screen.getByText("Add");

    fireEvent.change(titleInput, { target: { value: "New Task" } });
    fireEvent.change(descriptionInput, {
      target: { value: "New Description" },
    });
    fireEvent.click(addButton);
  });

  it("deletes a task", () => {
    mockRouter.push("/home");
    render(<Home />);
    const deleteButtons = screen.queryAllByText("Delete");

    if (deleteButtons.length > 0) {
      fireEvent.click(deleteButtons[0]);
    }
  });

  it("update a task", () => {
    render(<Home />);
    const updateButtons = screen.queryAllByText("Update");

    if (updateButtons.length > 0) {
      fireEvent.click(updateButtons[0]);
    }
  });

  it("marks a task as done", () => {
    mockRouter.push("/home");
    render(<Home />);
    const doneButton = screen.queryAllByText("Done");
    if (doneButton.length > 0) {
      fireEvent.click(doneButton[0]);
    }
  });

  it("logs out", () => {
    mockRouter.push("/");
    render(<Home />);
    const logoutButton = screen.getByText("Log Out");
    fireEvent.click(logoutButton);
  });
});
