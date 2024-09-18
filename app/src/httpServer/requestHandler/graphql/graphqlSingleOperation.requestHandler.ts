import {OperationDefinitionNode, parse} from "graphql/language";
import {RequestHandler} from "../requestHandler.type";
import {resourceReader} from "../../resourceReader/_resourceReader";
import {shellResourceReader} from "../../resourceReader/shell.resourceReader";
import {shellUnderscoreResourceReader} from "../../resourceReader/shellUnderscore.resourceReader";
import {resourceToPayload} from "../http/resourceToPayload/_resourceToPayload";
import {httpResourceReader} from "../../resourceReader/http.resourceReader";
import {httpUnderscoreResourceReader} from "../../resourceReader/httpUnderscore.resourceReader";

const ROOT_FOLDER_NAME = "#gqlSingleOperation";

export class GraphqlSingleOperationRequestHandler implements RequestHandler {

	launchDescription: RequestHandler["launchDescription"] = () => "Graphql Single Named Operation \t #gqlSingleOperation"

	counters = {} as Record<string, number>
	resetCounters: RequestHandler["resetCounters"] = () => {
		this.counters = {};
	};
	getCounters: RequestHandler["getCounters"] = () => {
		return this.counters;
	};

	isConsumable: RequestHandler["isConsumable"] = (request, args) => {
		if (request.method !== "POST") {
			return Promise.resolve(false);
		}
		try {
			const body = JSON.parse(request.body)
			const query = body?.query ?? "";
			const result = parse(query);
			const operations = result.definitions
				.filter((value): value is OperationDefinitionNode => value.kind === "OperationDefinition")
				.filter(value => value?.name?.value)
			if (!body?.operationName && operations?.length !== 1) {
				return Promise.resolve(false);
			}
			const resourcePath = args.rootDirectory.findMatchingPath(request.path);
			const exists = resourcePath.exists(ROOT_FOLDER_NAME);
			return Promise.resolve(exists);
		} catch (e) {
			return Promise.resolve(false);
		}
	};
	consume: RequestHandler["consume"] = async (request, args, httpServerHandlerLogger) => {
		const body = JSON.parse(request.body);
		const query = body?.query ?? "";
		const result = parse(query);
		const operations = result.definitions.filter((value): value is OperationDefinitionNode => value.kind === "OperationDefinition")
		const operationName = body.operationName ?? operations[0]?.name?.value

		const counter = this.counters[`${request.path}#${operationName}`] ?? 0;
		this.counters[`${request.path}#${operationName}`] = 1 + counter;

		const graphqlSingleOperationRequestHandlerLogger = httpServerHandlerLogger.createGraphqlSingleOperationLogger();
		const root = args.rootDirectory.findMatchingPath(request.path)
			.navigateInto(ROOT_FOLDER_NAME);

		graphqlSingleOperationRequestHandlerLogger.start({
			counter,
			operationName,
			moduleRoot: root.relativePath(),
		})

		const resourcePath = root.navigateInto(operationName)
			?? root.navigateInto("*");

		if (!resourcePath) {
			const statusMessage = `Failed to use any resourceReaders for ${request.path}/${ROOT_FOLDER_NAME}/${operationName}`;
			graphqlSingleOperationRequestHandlerLogger.addNoReaderError({
				statusMessage,
				requestPath: `${request.path}/${ROOT_FOLDER_NAME}/${operationName}`,
			})
			return [undefined, {
				statusMessage
			}];
		}

		graphqlSingleOperationRequestHandlerLogger.addResourcePath({
			resource: resourcePath.relativePath()
		})

		graphqlSingleOperationRequestHandlerLogger.addQueryAndVariables({
			query:body?.query,
			variables:body?.variables,
		})

		const [resource, error] = await resourceReader([
			shellResourceReader,
			httpResourceReader,
			shellUnderscoreResourceReader,
			httpUnderscoreResourceReader,
		], {
			directory: resourcePath,
			req: request,
			index: counter
		});
		if (error) {
			const statusMessage = `Failed to use any resourceReaders for ${request.path}/${ROOT_FOLDER_NAME}/${operationName}`
			graphqlSingleOperationRequestHandlerLogger.addNoReaderError({
				statusMessage,
				requestPath: `${request.path}/${ROOT_FOLDER_NAME}/${operationName}`,
			})
			return [undefined, {
				statusMessage
			}];
		}
		return await resourceToPayload(resource, resourcePath, request, graphqlSingleOperationRequestHandlerLogger);
	}
}