import "source-map-support/register";

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult,} from "aws-lambda";
import {deleteToDo} from "../../services/ToDoService";
import {createLogger} from "../../utils/logger";
import {getToken} from "../../auth/utils";

const logger = createLogger("DeleteToDo");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info("Processing Event ", event);

  const jwtToken = getToken(event.headers.Authorization);

  const todoId = event.pathParameters.todoId;
  logger.info("Deleting todo with id ", todoId);

  const deleteData = await deleteToDo(todoId, jwtToken);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: deleteData
  };
};
