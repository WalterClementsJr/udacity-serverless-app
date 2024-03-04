import "source-map-support/register";

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult,} from "aws-lambda";
import {generateUploadUrl} from "../../services/ToDoService";
import {createLogger} from "../../utils/logger";

const logger = createLogger("Generate upload Url");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info("Processing Event", event);

  const todoId = event.pathParameters.todoId;

  const url = await generateUploadUrl(todoId);
  logger.info(`Upload url for todo ${todoId}: ${url}`);

  return {
    statusCode: 202,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      uploadUrl: url,
    })
  };
};
