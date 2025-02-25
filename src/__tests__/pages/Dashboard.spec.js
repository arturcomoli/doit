import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import Dashboard from "../../pages/Dashboard";
import api from "../../services/api";
import MockAdapter from "axios-mock-adapter";

const apiMock = new MockAdapter(api);

describe("Dashboard Page", () => {
  it("should be able to retrieve tasks", async () => {
    apiMock.onGet("/tasks").replyOnce(200, [
      {
        id: 1,
        completed: false,
        created_at: "2021-10-05T17:16:18.198Z",
        description: "Fazer as compras",
        userId: 13,
      },
    ]);
    render(<Dashboard authenticated />);

    const cards = screen.getByTestId("tasks-container");

    await waitFor(() => {
      expect(cards).toHaveTextContent("Fazer as compras");
    });
  });

  it("should be able to create a new task", async () => {
    apiMock.onGet("/tasks").replyOnce(200, []);
    apiMock.onPost("/tasks").replyOnce(200, {
      id: 1,
      completed: false,
      created_at: "2021-10-05T17:16:18.198Z",
      description: "Fazer as compras",
      userId: 13,
    });
    render(<Dashboard authenticated />);

    const taskField = screen.getByPlaceholderText("Nova tarefa");

    const buttonElement = screen.getByText("Adicionar");

    fireEvent.change(taskField, {
      target: {
        value: "Fazer as compras",
      },
    });

    fireEvent.click(buttonElement);

    const cards = screen.getByTestId("tasks-container");

    await waitFor(() => {
      expect(cards).toHaveTextContent("Fazer as compras");
    });
  });

  it("should be able to conclude a task", async () => {
    apiMock.onGet("/tasks").replyOnce(200, [
      {
        id: 1,
        completed: false,
        created_at: "2021-10-05T17:16:18.198Z",
        description: "Fazer as compras",
        userId: 13,
      },
    ]);
    apiMock.onPatch("/tasks/1").replyOnce(200, {
      id: 1,
      completed: true,
      created_at: "2021-10-05T17:16:18.198Z",
      description: "Fazer as compras",
      userId: 13,
    });
    render(<Dashboard authenticated />);

    // getBy é sincrono e busca o que já está em tela
    //findBy é assíncrono e busca o que estará na tela
    //queryBy é síncrono e não está em tela

    const cardButton = await screen.findByText("Concluir");

    fireEvent.click(cardButton);

    await waitFor(() => {
      expect(screen.queryByText("Fazer as compras")).not.toBeInTheDocument();
    });
  });
});
