import React from 'react';
import logo from './logo.svg';
import './App.css';
import {fetch_products, count_products} from './api'
import Pagination from "react-js-pagination"
import TelegramLoginButton from 'react-telegram-login';
const images = {'atb': 'atb-50.png','auchan': 'ashan-50.png','fozzy': 'fozzy-50.png','furshet': 'furshet-50.png',
'megamarket': 'megamarket-50.png','metro': 'metro-50.png','novus': 'novus-50.png','silpo': 'silpo-50.png', 
'varus': 'varus-50.png'}
function NavBars(props)
{
  const shops = ["Atb","Auchan","Fozzy","Furshet","Megamarket","Metro","Novus","Silpo","Varus"];
  const categories = ["Овочі та фрукти", "Риба та морепродукти","М'ясо", "Гастрономія", "Молочні продукти",
"Заморожені продукти", "Бакалія", "Хлібобулочні вироби", "Кондитерські вироби", "Кава та чай", "Напої", "Алкоголь",
"Непродовольчі товари", "Дитячі товари"];
  return(
    <div>
       { props.shops.length !=0 ? <ul className = "flex"> 
         
         <li>  
           {
           props.shops.map(shop=>
          
            <button className="btn" onClick = {props.changeShop.bind(null, shop.toLowerCase(), true)}><i className="fa fa-close cancel-button">{shop}</i></button>
            
           )
            }
           </li>
         
      </ul> : '' }
      
       { props.categories.length !=0 ? <ul className = "flex"> 
         
         <li>  
           {
           props.categories.map(category=>
          
            <button className="btn" onClick = {props.changeCategory.bind(null, category.toLowerCase(), true)}><i className="fa fa-close cancel-button">{category}</i></button>
            
           )
            }
           </li>
         
      </ul> : '' }
      <div className="dropdown" style= {{float:'left'}}>
  <button className="dropbtn"><a href="#">Всі магазини</a></button>
  <div className="dropdown-content" style={{left:0}}>
         <ul className = "scrollable-menu">
        {
        shops.map(shop=>
          (
           <li> <a href ="#" className = {`btn-clear nav-link}`} 
            onClick = {props.changeShop.bind(null, shop.toLowerCase())}>{shop}</a>
          </li>))
         }
          </ul>
    
  </div>
 </div>


    </div>
    
  );
}
function InputSearch(props)
{
  return(
    <div className="search__buttons">   
  <p></p>   
  <form>
  <input type="text" onChange = {props.handleChange} placeholder="Пошук..."/>
  <button type="submit"></button>
  </form>
  <p></p>
  </div>
  )
}
function Logo()
{
  function aloud()
  {

  }
  return (
    <div>
      
      
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div className="logo"><img src="small.png" /></div>
  {/* <a class="navbar-brand" href="#">Navbar</a> */}
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav">
    
    
  
      </ul>
  </div>
  <div className="bot"><a href ="web.telegram.org"><img src = "telegram_button.png"/></a></div>
  </nav>  
      
  </div>
  );
}
function ProductGrid(props)
{
  console.log(props.products);
  return (
    <div className = 'grid-container'>
    {
    
         props.products.map((item,index)=> (
            <div className = 'product-item'>
              <img src = {images[item.shop]} className="product-logo"></img>
            <p><a href={item.url}><img src = {item.thumbnail} className = 'avatar '/></a></p>
            <p>Price : {item.price}</p>
            <p>Old price : {item.old_price}</p>
            <p>Name : {item.title}</p>
            </div>
        ))
    }

</div>
   
  )
 
}

function ViewBar(props)
{
  return(
    props.results.map(prod=>(
      <p><a href = {prod.url} className = 'no-style'>{prod.title},    {prod.category} </a></p>
    ))
  )
}
class App extends React.Component {

  constructor(props)
  {
    super(props);
    this.filterShop = this.filterShop.bind(this);
    this.filterCategory = this.filterCategory.bind(this);
    this.reload_data = this.reload_data.bind(this);
    this.input_search = this.input_search.bind(this);
    this.state = { shops: [], category: [], products :null, activePage: 0, totalItemsCount: 0, filteredProds: [] };
  }
 componentDidMount()
 {
    this.recount_pages();
   
    this.reload_data();
   
 }
 async input_search(e)
 
 {  
   let value = e.target.value;
   if(value =='') this.setState(prevState=>({...prevState, products: []}))
   else
   {
     await this.recount_pages(value);
    fetch_products(this.state.shops, this.state.category, value, 1).then(function(new_products)
    {
       this.setState(prevState=>(
       {
         ...prevState, products: new_products
       }))
    }.bind(this))
   }
    
 }
  recount_pages(word)
  { 
    return count_products(this.state.shops, this.state.category,word).then(function(total)
    {
      console.log('NIce')
       this.setState(prevState=>(
       {
         ...prevState, activePage: 1, totalItemsCount: total
       }))
    }.bind(this))
  }
  reload_data(input_text,page = 1)
  {
    console.log("Reloaded")
     fetch_products(this.state.shops, this.state.category, input_text, page).then(function(new_products)
 {
    this.setState(prevState=>(
    {
      ...prevState, products: new_products
    }))
 }.bind(this))
  }

   filterShop(shop, del = false)
  {   
    this.setState(prevState=>
      {
        let prev_shops =  prevState.shops;
        if(del == true) 
        {
          prev_shops.splice(prev_shops.indexOf(shop),1)
          return {...prevState}
        }
        console.log('Noe')
        return {
          ...prevState,
          shops: prevState.shops.includes(shop) ? prevState.shops : prevState.shops.concat(shop)
      }
      }, async ()=> {await this.recount_pages(); this.reload_data();});
}
 filterCategory(category, del = false)
{
  this.setState(prevState=>
    {
      let prev_category =  prevState.category;
      if(del == true) 
      {
        prev_category.splice(prev_category.indexOf(category),1);
        return {...prevState}
      }
      return {
        ...prevState,
        category: prev_category.includes(category) ? prev_category : prev_category.concat(category)
    }
    }, async ()=> {await this.recount_pages();this.reload_data();});
}
handlePageChange(pageNumber) {
  console.log(`active page is ${pageNumber}`);
  this.setState(prevState=>({...prevState, activePage: pageNumber}));
  this.reload_data('',pageNumber);
}
  render()
  {
    console.log(this.state.totalItemsCount);
    return (
      <div> 
      <Logo />
      <InputSearch handleChange = {this.input_search}/>
      {         !this.state.filteredProds ? 'asd' : (
                <ViewBar results = {this.state.filteredProds} />
            )
       }
      <NavBars state = {this.state} categories = {this.state.category} shops ={this.state.shops} changeShop = {this.filterShop}  changeCategory = {this.filterCategory}/>
      {         !this.state.products ? 'Loadings!!' : (
                <ProductGrid products = {this.state.products} />
            )
      }
     
             <Pagination className = "pagination"
             activeLinkClass = "active"
          activePage={this.state.activePage}
          itemsCountPerPage={30}
          totalItemsCount={this.state.totalItemsCount}
          pageRangeDisplayed={10}
          onChange={this.handlePageChange.bind(this)}
        />
      </div>
     );
  }
 
}

export default App;
