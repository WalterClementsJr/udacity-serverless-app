import "source-map-support/register";

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult,} from "aws-lambda";
import {getAllToDo} from "../../services/ToDoService";
import {createLogger} from "../../utils/logger";
import {getToken} from "../../auth/utils";

const logger = createLogger("GetTodo");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info("Processing Event ", event);

  const jwtToken = getToken(event.headers.Authorization);

  const toDos = await getAllToDo(jwtToken);
  logger.info("Found todos", toDos);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      items: toDos,
    })
  };
};
