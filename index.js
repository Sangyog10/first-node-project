const fs=require('fs');
const http=require('http');
const url=require('url');
const slugify=require('slugify');

const tempOverview=fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard=fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct=fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');
const data=fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj=JSON.parse(data);
const replaceTemp=(temp,product)=>{ //here product means the stored data at json file
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    
    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}
// console.log(slugify('Fresh Avocados', {lower:true}));
const slugs=dataObj.map(el=>slugify(el.productName,{lower:true}));
console.log(slugs);

const server=http.createServer((req,res)=>{
    // const pathName=req.url;
    const {query,pathname}=url.parse(req.url,true);
    //homepage
    if(pathname==='/' || pathname==='/home'){
        res.writeHead(200,{'Content-type':'text/html'}); //specifies the types of file 
        const cardHtml=dataObj.map(el=>replaceTemp(tempCard,el)).join('');
        const output=tempOverview.replace('{%PRODUCTS_CARDS%}',cardHtml);
        res.end(output); //displays at home page

    }
    else if(pathname==='/product'){
        // console.log(query);
        res.writeHead(200,{'Content-type':'text/html'});
        const product=dataObj[query.id];
        const output=replaceTemp(tempProduct,product);
        res.end(output);
        
    }
    else{
        res.end("Error ......");
    }
    
})

server.listen(8000,'127.0.0.1',()=>{
    console.log("Listening to the port.....")
})
