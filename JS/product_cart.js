
// API 資訊
const base_url = 'https://vue3-course-api.hexschool.io/v2/api';
const api_path = 'karen666'; 

// 根元件
const app = {

    data(){
        return{
            cartData: [],
            productData: [],
            prodcutId: '',
            isLoadingItem: '',
        }
    },

    methods: {

        // 取得產品列表
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

        // 開啟 modal 元件
        openProductModal(id){
            // 從根元件用 props 傳入產品 id 到 modal 內
            this.prodcutId = id;
            this.$refs.productModal.openProductModal()
        },

        getCartData(){
            axios.get(`${base_url}/${api_path}/cart`)
            .then(res => {
                console.log(res.data.data);
                // 是個陣列
                this.cartData = res.data.data;

            })
            .catch(err => {
                console.log(err);
            })
        },

        // 購物車：加入產品
        // 產品數量：參數預設值 (商品數量為 1)
        addToCart(id, qty = 1){

            const data = {
                "product_id": id,
                "qty": qty, // 也可以解構賦值只寫 qty
            };

            this.isLoadingItem = id;

            axios.post(`${base_url}/${api_path}/cart`, { data })
            .then(res => {
                console.log(res.data);
                this.getCartData();
                this.isLoadingItem = '';
            })
            .catch(err => {
                console.log(err);
            })
        },

        deleteProductItem(id){

            this.isLoadingItem = id;

            axios.delete(`${base_url}/${api_path}/cart/${id}`)
            .then(res => {
                console.log(res, `${id}`);
                this.getCartData();
                this.isLoadingItem = '';
            })
            .catch(err => {
                console.log(err);
            })

        }

    },

    mounted(){

        this.getProductList();
        this.getCartData();
    }

};

// Vue 以 cdn 載入的子元件
Vue.createApp(app)
// 註冊 modal 元件
.component('user-product-modal', {
    template: '#userProductModal',
    props: ['id'],
    data(){
        return{
            bsModal: {},
            productInModal: {},
        }
    },
    watch: {

        // 監控來自 props 的 id，只要畫面上 id 產生變動就會觸發抓取 modal 內不同筆資料
        id(){
            this.getModalProductList();
        }
    },
    methods: {
        openProductModal(){
            this.bsModal.show();
        },
        // 抓取單筆產品資料 (開 modal 的時候就打這支 API)
        getModalProductList(){
            axios.get(`${base_url}/${api_path}/product/${this.id}`)
            .then(res => {
                console.log(res.data.product);
                this.productInModal = res.data.product;
            })
            .catch(err => {
                console.log(err);
            })
        }
    },

    // $refs
    mounted(){
        
        // 初始化 Boostrap 商品列表 modal
        this.bsModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
        });
       
    }
})
.mount('#app');