interface Resource {
    resourceUri: string;
    queryAttribute: string;
    queryValue: string;
}
interface ResourceById {
    resourceUri: string;
    resourceId: string;
}
interface POSTResource {
    resourceUri: string;
    body: string;
}
export declare function postResource<T>(vid: string, vkey: string, resource: POSTResource): Promise<T>;
export declare function getResourceByAttribute<T>(vid: string, vkey: string, resource: Resource): Promise<T>;
export declare function deleteResourceById(vid: string, vkey: string, resource: ResourceById): Promise<void>;
export {};
