import {IGenerateConfig} from "../interface/i-generate-config";
import {GROUP_SERVICE} from "../classes/ref";
import {renderMustache} from "./render-mustache";
import {appendFileSync} from "fs";
import {join} from "path";
import {kebabCaseToCamel} from "./kebab-case-to-camel";
import {kebabCaseToSnake} from "./kebab-case-to-snake";
import {configuration} from "./config";

export interface IReactProviderMustache {
    services: Array<{
        propertyName: string;
        serviceClassName: string;
    }>
    isImport: boolean;
    imports: Array<string>;
}

export const createStaticServices = () => {
    const folder = configuration.getFolderManager();
    const reference = configuration.getReference();

    const services = reference.getByGroup(GROUP_SERVICE)

    const viewData: IReactProviderMustache = {
        services: services.map(v => ({propertyName: kebabCaseToSnake(v.fileName).toUpperCase(), serviceClassName: v.className})),
        isImport: services.length > 0,
        imports: services.map(v => reference.getImportAndTypeByRef(
            v.refKey,
            folder.getReactProviderFolder()).import
        )
    }

    appendFileSync(
        join(folder.getConstantServicesFolder(), `open-api-services.ts`),
        renderMustache('service-constants.mustache', viewData)
    )

}
