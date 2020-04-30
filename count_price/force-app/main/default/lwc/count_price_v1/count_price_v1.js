import { LightningElement,track,wire,api} from 'lwc';
import get_price_book_name from '@salesforce/apex/count_price.get_price_book';
import get_discount_table_name from '@salesforce/apex/count_price.get_discount_table';
import add_sys_pkey_tail from '@salesforce/apex/count_price.add_sys_pkey_tail';
import insert_new_price_book from '@salesforce/apex/count_price.insert_new_price_book';
import get_clone_book_detail from '@salesforce/apex/count_price.get_clone_book_detail';
export default class Count_price_v1 extends LightningElement {
    @api recordId;
    @track modal_keyin = false;
    @track price_book_layout;
    @track tsc_region_layout;
    @track start_date_layout;
    @track end_date_layout;
    @track brand_layout;
    @track currency_layout;
    @track get_price_book = [];
    @track get_discount_table = [];
    @track get_book_detail = [];
    @track mix_number = "";
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
    @wire(get_clone_book_detail,{pricing_maintain_id :'$recordId'})
    clone_book_detail({error,data}){
        if(data){
            for(let i = 0 ; i < data.length;i++){
                this.get_book_detail[i] = {
                    Name : data[i].Name,
                    Brand__c : data[i].Brand__c,
                    CurrencyIsoCode : data[i].CurrencyIsoCode,
                    End_Date__c : data[i].End_Date__c,
                    Start_Date__c : data[i].Start_Date__c,
                    TSC_Region__c : data[i].TSC_Region__c
                }
            }
            this.price_book_layout = this.get_book_detail[0].Name;
            this.tsc_region_layout = this.get_book_detail[0].TSC_Region__c;
            this.start_date_layout = this.get_book_detail[0].Start_Date__c;
            this.end_date_layout = this.get_book_detail[0].End_Date__c;
            this.brand_layout = this.get_book_detail[0].Brand__c;
            this.currency_layout = this.get_book_detail[0].CurrencyIsoCode;
            this.price_book_value = this.price_book_layout;
        }
        if(error){
            console.log("there is some error in function");
        }
    }
    get get_mix_number(){
        return [
            {label:'2',value:'2'},
            {label:'3',value:'3'},
            {label:'4',value:'4'},
        ]
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
    handler_mix_number(event){
        this.mix_number = event.detail.value;
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