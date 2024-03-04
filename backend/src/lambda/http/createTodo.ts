import "source-map-support/register";

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult,} from "aws-lambda";
import {createToDo} from "../../services/ToDoService";
import {createLogger} from "../../utils/logger";
import {CreateTodoDto} from "../../models/CreateToDoDto";
import {getToken} from "../../auth/utils";

const logger = createLogger("CreateToDo");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info("Processing Event ", event);

  const jwtToken = getToken(event.headers.Authorization);
  const newTodo: CreateTodoDto = JSON.parse(event.body);

  logger.info("Creating new todo", newTodo);
  const toDoItem = await createToDo(newTodo, jwtToken);

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      item: toDoItem,
    })
  };
};
