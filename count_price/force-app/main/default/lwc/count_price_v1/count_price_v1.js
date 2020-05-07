import { LightningElement,track,wire,api} from 'lwc';
import get_price_book_name from '@salesforce/apex/count_price.get_price_book';
import get_discount_table_name from '@salesforce/apex/count_price.get_discount_table';
import add_sys_pkey_tail from '@salesforce/apex/count_price.add_sys_pkey_tail';
import insert_new_price_book from '@salesforce/apex/count_price.insert_new_price_book';
import get_clone_book_detail from '@salesforce/apex/count_price.get_clone_book_detail';
export default class Count_price_v1 extends LightningElement {
    @api recordId;
    @track modal_keyin = false;
    @track get_price_book = [];
    @track get_discount_table = [];
    @track get_book_detail = [];
    @track incoterm_value = ""; 
    @track mix_number = "4";
    @track price_book_value = "";
    @track discount_table_value = "";
    @track region_value = "";
    @track brand_value = "";
    @track readonly_currency = "";
    @track currency_value = "";
    @track new_price_book = "";
    @track start_date = "";
    @track end_date = "";
    @track exchange_rate = "";
    @track discount_rate = "";
    @track sys_pkey = "";
    @track tsc_region_boolean = true;
    @track brand_boolean = true;
    @track currency_boolean = true;
    @track incoterms_boolean = true;
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
                    TSC_Region__c : data[i].TSC_Region__c,
                    Incoterms__c : data[i].Incoterms__c,
                }
            }
            this.price_book_value = this.get_book_detail[0].Name;
            this.region_value = this.get_book_detail[0].TSC_Region__c;
            this.start_date = this.get_book_detail[0].Start_Date__c;
            this.end_date = this.get_book_detail[0].End_Date__c;
            this.brand_value = this.get_book_detail[0].Brand__c;
            this.currency_value = this.get_book_detail[0].CurrencyIsoCode;
            this.incoterm_value = this.get_book_detail[0].Incoterms__c;
            this.new_price_book = this.price_book_value;
            this.readonly_currency = this.get_book_detail[0].CurrencyIsoCode;
        }
        if(error){
            console.log("there is some error in function");
        }
    }
    get get_incoterms(){
        return [
            {label:'CIP',value:'CIP'},
            {label:'FCA',value:'FCA'},
            {label:'FOB',value:"FOB"}
        ]
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
        this.new_price_book = this.price_book_value;
    }
    handler_select_discount_table(event){
        this.discount_table_value = event.detail.value;
    }  
    handler_select_region(event){
        this.region_value = event.detail.value; 
        this.make_new_price_book();
    } 
    handler_select_brand(event){
        this.brand_value = event.detail.value;
        this.make_new_price_book();
    }
    checkbox_tsc_region(event){
        this.tsc_region_boolean = event.target.checked;
        this.make_new_price_book();
    }
    checkbox_brand(event){
        this.brand_boolean = event.target.checked;
        this.make_new_price_book();
    }
    checkbox_currency(event){
        this.currency_boolean = event.target.checked;
        this.make_new_price_book();
    }
    checkbox_incoterms(event){
        this.incoterms_boolean = event.target.checked;
        this.make_new_price_book();
    }
    handler_select_currency(event){
        this.currency_value = event.detail.value;
        this.make_new_price_book();
    }
    //this handle is for button click
    handle_start_button(event){
        this.modal_keyin = true;
    }
    make_new_price_book(){
        let mix_str = "";
        let data_list = [];
        if(this.tsc_region_boolean == true){
            data_list.push(this.region_value);
        }
        if(this.brand_boolean == true){
            data_list.push(this.brand_value);
        }
        if(this.currency_boolean == true){
            data_list.push(this.currency_value);
        }
        if(this.incoterms_boolean == true){
            data_list.push(this.incoterm_value);
        }
        for(let i = 0 ;i < data_list.length;i++){
            if(i==0){
                mix_str=mix_str + data_list[i];
            }
            else{
                mix_str =mix_str+"-"+data_list[i];
            }            
        }
        mix_str = mix_str+ ' List Pricebook';
        this.new_price_book = mix_str;
    }
    handler_incoterm(event){
        this.incoterm_value = event.detail.value;
        console.log(this.incoterm_value);
        this.make_new_price_book();
    }
    close_page(event){ 
        this.price_book_value = "";
        this.discount_table_value = "";
        this.region_value = "";
        this.brand_value = "";
        this.currency_value = "";
        this.modal_keyin = false;
        console.log(this.template.querySelector(".new_price_book").value);
    }
    save_page(event){
        this.new_price_book  = this.template.querySelector(".new_price_book").value;
        this.start_date = this.template.querySelector(".Start_Date").value;
        this.end_date = this.template.querySelector(".End_Date").value;
        this.exchange_rate = this.template.querySelector(".Exchange_Rate");
        this.discount_rate = this.template.querySelector(".Discount_Rate");
        add_sys_pkey_tail({price_book:this.price_book_value})
        .then(result => {
            this.sys_pkey = result;
            console.log(this.new_price_book);
            if(this.end_date == ''){
                this.end_date = "end_date_null";
            }
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