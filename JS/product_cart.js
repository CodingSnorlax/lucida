
// API 資訊
const base_url = 'https://vue3-course-api.hexschool.io/v2/api';
const api_path = 'karen666'; 

// 根元件
const app = {

    data(){
        return{
            cartData: {},
            productData: []
        }
    },

    methods: {

        getProductList(){
            axios.get(`${base_url}/${api_path}/products/all`)
            
                .then(res => {
                    console.log(res.data);
                    this.productData = res.data.products;
                })
                .catch(err => {
                    console.log(err);
                })
        },

        // openModal(){
            
        // }

    },

    mounted(){

        this.getProductList();
    }

};


// 註冊 modal 元件
app.component('user-product-modal', {
    template: '#userProductModal',
    props: [],

    methods: {

    },

    // $refs
    mounted(){
        
        // 初始化 Boostrap 商品列表 modal
        var userProductModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
        });

        userProductModal.show();

    }
});

Vue.createApp(app).mount('#app');