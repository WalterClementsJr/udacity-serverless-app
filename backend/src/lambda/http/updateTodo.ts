import "source-map-support/register";
import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult,} from "aws-lambda";
import {TodoItemUpdate} from "../../models/ToDoItemUpdate";
import {updateToDo} from "../../services/ToDoService";
import {createLogger} from "../../utils/logger";
import {getToken} from "../../auth/utils";

const logger = createLogger("UpdateTodo");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info("Processing Event ", event);

  const jwtToken = getToken(event.headers.Authorization);

  const todoId = event.pathParameters.todoId;
  const updatedTodo: TodoItemUpdate = JSON.parse(event.body);
  logger.info("Updating todo ", updatedTodo);

  const toDoItem = await updateToDo(updatedTodo, todoId, jwtToken);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      item: toDoItem,
    })
  };
};
