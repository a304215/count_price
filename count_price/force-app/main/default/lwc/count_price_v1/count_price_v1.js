import { LightningElement,track,wire} from 'lwc';
import get_price_book_name from '@salesforce/apex/count_price.get_price_book';
import get_discount_table_name from '@salesforce/apex/count_price.get_discount_table';
import add_sys_pkey_tail from '@salesforce/apex/count_price.add_sys_pkey_tail';
import insert_new_price_book from '@salesforce/apex/count_price.insert_new_price_book';
export default class Count_price_v1 extends LightningElement {
    @track modal_keyin = false;
    @track get_price_book = [];
    @track get_discount_table = []
    @track price_book_value = "";
    @track discount_table_value = "";
    @track region_value = "";
    @track brand_value = "";
    @track currency_value = "";
    @track new_price_book = "";
    @track start_date = "";
    @track end_date = "";
    @track exchange_rate = "";
    @track discount_rate = "";
    @track sys_pkey = "";
    @wire (get_price_book_name) 
    //get the picklist data
    price_book_name({error,data}){
        if(data){
            for(let i = 0 ; i < data.length;i++){
                this.get_price_book[i] = {
                    label:data[i].Name,
                    value:data[i].Name,
                }
            }
        }if(error){
            console.log(error);
        }
    }    
    @wire (get_discount_table_name)
    discount_table_name({error,data}){
        if(data){
            for(let i = 0 ; i < data.length;i++){
                this.get_discount_table[i] = {
                    label:data[i].Name,
                    value:data[i].Name
                }
            }
        }if(error){
            console.log(error);
        }
    }
    get get_region(){
        return [
            {label:'TSC',value:'TSC'},
            {label:'TTSC',value:'TTSC'},
            {label:'TSCAA',value:'TSCAA'},
            {label:'TSCAE',value:'TSCAE'}
        ]
    }
    get get_brand(){
        return [
            {label:'TSC',value:'TSC'},
            {label:'PTX',value:'PTX'}
        ]
    }
    get get_currency(){
        return [
            {label:'TWD',value:'TWD'},
            {label:'CNY',value:'CNY'},
            {label:'USD',value:'USD'},
            {label:'EUR',value:'EUR'},
            {label:'GBP',value:'GBP'}
        ]
        
    }
    get get_Incoterms(){
        return [
            {label:'--None--',value:'--None--'}
        ]
    }
    //solve the picklist onchange event
    handler_select_pricebook(event){
        this.price_book_value = event.detail.value;
    }
    handler_select_discount_table(event){
        this.discount_table_value = event.detail.value;
    }  
    handler_select_region(event){
        this.region_value = event.detail.value;
    } 
    handler_select_brand(event){
        this.brand_value = event.detail.value;
    }
    handler_select_currency(event){
        this.currency_value = event.detail.value;
    }
    //this handle is for button click
    handle_start_button(event){
        this.modal_keyin = true;
    }
    close_page(event){
        this.price_book_value = "";
        this.discount_table_value = "";
        this.region_value = "";
        this.brand_value = "";
        this.currency_value = "";
        this.modal_keyin = false;
    }
    save_page(event){
        this.new_price_book  = this.template.querySelector(".new_price_book").value;
        this.start_date = this.template.querySelector(".Start_Date").value;
        this.end_date = this.template.querySelector(".End_Date").value;
        this.exchange_rate = this.template.querySelector(".Exchange_Rate");
        this.discount_rate = this.template.querySelector(".Discount_Rate");
        console.log(this.new_price_book);
        add_sys_pkey_tail({price_book:this.price_book_value})
        .then(result => {
            this.sys_pkey = result;
            insert_new_price_book({sys_pkey:this.sys_pkey,new_price_book:this.new_price_book,tsc_region:this.region_value,start_date:this.start_date,end_date:this.end_date,set_currency:this.currency_value,brand:this.brand_value})
            .then(result =>{
                console.log(result);
            })
            .catch(error =>{
                console.log(error);
            })
            this.modal_keyin = false;
        })
        .catch(error => {
            this.error = error;
        });
        
    }
}