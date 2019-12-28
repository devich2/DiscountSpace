var fetch = require('node-fetch');

let options = {
    method: 'GET',
    headers: {'user-agent': 'node.js'}
};
function serialize(products, categories, text)
{
    let product_filter = {}, shop_filter, category_filter, text_filter;
    shop_filter =  products.length == 0 ? {} : {shop: {"$in": products}}; 
    category_filter =  categories.length == 0? {} : {category: {"$in": categories}};
    text_filter = (text!= undefined && text!='') ? {"title": {"$regex": text, "$options": "i"}} : {}
    return Object.assign(product_filter,shop_filter,category_filter, text_filter);
}
export function fetch_products(products, categories,word,page)
{      
    let data = serialize(products, categories,word);
    let path = `https://shops-ua.herokuapp.com/find?filter=${JSON.stringify(data)}&skip=${30*(page-1)}&limit=30`
    console.log(path);
     return fetch(path,options).then(res => res.json()).then((json)=>json.items.map(item=>scrapData(item))); 
}
export function count_products(products, categories,word)
{
    let data = serialize(products, categories,word);
    let path = `https://shops-ua.herokuapp.com/count?filter=${JSON.stringify(data)}`;
    console.log(path);
    return fetch(path,options).then(res => res.json()).then(data=>data.count);
}
function scrapData(item)
{
    return Object.assign({}, item);
} 
