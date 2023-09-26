const getFields = (document: any) => {

    var item: any = {}

    for(const field in document['fields']){

        for(const [key, fieldValue] of Object.entries(document['fields'][field])){

            item[field] = fieldValue; 

        }

    }
    
    return item;
} 

export default getFields;