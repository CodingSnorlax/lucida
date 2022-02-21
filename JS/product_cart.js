
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
            qty: 1,
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
                console.log(res.data.product);
                alert('已成功加入購物車')
                this.getCartData();
                this.isLoadingItem = '';
            })
            .catch(err => {
                console.log(err);
            })
        },

        // 修改購物車數量
        editCartItem(id, qty){

            const data = {
                "product_id": id,
                "qty": qty,
            }

            axios.put(`${base_url}/${api_path}/cart/${id}`, { data } )
            .then(res => {
                console.log(res);
                this.getCartData();
            })
            .catch(err => {
                console.log(err);
            })

        },

        // 刪除單一購物車產品
        deleteSingleProductItem(id){

            this.isLoadingItem = id;

            axios.delete(`${base_url}/${api_path}/cart/${id}`)
            .then(res => {
                alert('產品已刪除')
                this.getCartData();
                this.isLoadingItem = '';
            })
            .catch(err => {
                console.log(err);
            })
        },

        // 清空購物車所有產品
        deleteAllCartItems(){
            
            axios.delete(`${base_url}/${api_path}/carts`)
            .then(res => {
                console.log(res.data);
                alert('購物車已清空')
                this.getCartData();
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

        closeProductModal(){
            this.bsModal.hide();
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
        },
        

        // 在 modal 內新增產品數量
        addToCart(){
            console.log(this);
            console.log(this.id, '哪裡來的？');
            this.$emit('add-to-cart', this.id, this.qty);
            this.closeProductModal()
        },

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