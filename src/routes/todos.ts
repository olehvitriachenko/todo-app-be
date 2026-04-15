// CRUD for TODO
import {
  createTodoItem,
  deleteTodoItem,
  getTodoItem,
  getTodoList,
  updateTodoItem,
} from "@/repository/todos.repository";
import { TodoStatus } from "@/types/todos";
import { FastifyPluginAsync } from "fastify";

const STATUS_ENUM = ["Created", "InProgress", "Done"];

const todoRoute: FastifyPluginAsync = async (fastify) => {
  // TODO: POST todo item

  fastify.post<{
    Body: { text: string; status: TodoStatus };
  }>(
    "/todo",
    {
      schema: {
        body: {
          type: "object",
          required: ["text"],
          properties: {
            text: { type: "string" },
            status: { type: "string", enum: STATUS_ENUM },
          },
        },
      },
    },
    async (req) => {
      const body = req.body;
      const todo = createTodoItem(body);

      return todo;
    },
  );

  // TODO: GET todos list
  fastify.get(
    "/todos",
    {
      schema: {
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string", format: "uuid" },
                text: { type: "string" },
                status: { type: "string", enum: STATUS_ENUM },
              },
            },
          },
        },
      },
    },
    async () => {
      const todos = getTodoList();
      return todos;
    },
  );
  // TODO: GET todos list item
  fastify.get<{
    Params: { id: string };
  }>(
    "/todos/:id",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string", format: "uuid" },
          },
        },
      },
    },
    async (req) => {
      const todo = getTodoItem(req.params.id);

      if (!todo) {
        throw fastify.httpErrors.notFound("Todo not found");
      }

      return todo;
    },
  );
  // TODO: PUT todos list item

  fastify.patch<{
    Params: { id: string };
    Body: {
      text?: string;
      status?: TodoStatus;
    };
    Reply: { id: string; text: string; status: TodoStatus };
  }>(
    "/todo/:id",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string", format: "uuid" },
          },
        },
        body: {
          type: "object",
          additionalProperties: false,
          minProperties: 1,
          properties: {
            text: { type: "string" },
            status: { type: "string", enum: STATUS_ENUM },
          },
        },
        response: {
          200: {
            type: "object",
            required: ["id", "text", "status"],
            properties: {
              id: { type: "string" },
              text: { type: "string" },
              status: { type: "string", enum: STATUS_ENUM },
            },
          },
        },
      },
    },
    async (req) => {
      const id = req.params.id;

      const todo = updateTodoItem(id, req.body);

      if (!todo) {
        throw fastify.httpErrors.notFound("Todo not found");
      }

      return todo;
    },
  );

  // TODO: DELETE todos list item
  fastify.delete<{
    Params: {
      id: string;
    };
  }>(
    "/todo/:id",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string", format: "uuid" },
          },
        },
      },
    },
    async (req) => {
      const id = req.params.id;

      const index = deleteTodoItem(id);

      if (!index) {
        throw fastify.httpErrors.notFound("TODO not found");
      }

      return { ok: true };
    },
  );
};

export default todoRoute;
